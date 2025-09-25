<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\AppointmentStoreRequest;
use App\Http\Requests\Appointment\AppointmentUpdateRequest;
use App\Http\Requests\Public\BookAppointmentRequest;
use App\Http\Resources\Appointment\AppointmentResource;
use App\Models\Appointment\Appointment;
use App\Models\Service\Service;
use App\Models\Slot\Slot;
use App\Services\BookingService;
use App\Enums\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class AppointmentController extends Controller
{
    protected BookingService $bookingService;

    // Inject the service into the controller
    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    // Displays a list of appointments based on the user's role
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->hasRole('applicant')) {
            $appointments = $user->appointments()->with(['service', 'participants'])->latest()->paginate(10);
            return Inertia::render('Appointments/Index', [ // Corrected path and capitalization
                'appointments' => $appointments,
            ]);
        }

        // Admin/Registrar view
        $appointments = Appointment::with(['service'])
            ->search($request->query('q'))
            ->filter($request->all())
            ->when($request->filled('date_from') || $request->filled('date_to'), function ($query) use ($request): void {
                $start = $request->input('date_from');
                $end = $request->input('date_to');
                if ($start && $end) {
                    $query->whereBetween('scheduled_date', [$start, $end]);
                } elseif ($start) {
                    $query->whereDate('scheduled_date', '>=', $start);
                } elseif ($end) {
                    $query->whereDate('scheduled_date', '<=', $end);
                }
            })
            ->sort($request->sort_by)
            ->paginate();

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => $appointments->toResourceCollection(),
            'statusOptions' => collect(Status::cases())->map(fn($s) => ['id' => $s->value, 'name' => $s->getLabel()]),
            'services' => Service::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'users' => \App\Models\User::query()->orderBy('full_name')->take(50)->get(['id', 'full_name as name']),
        ]);
    }

    // Applicant-facing: Displays the booking form
    public function create()
    {
        $services = Service::where('is_active', true)->select('id', 'name', 'duration', 'description')->get();
        return inertia('Public/Booking/Create', [
            'services' => $services,
        ]);
    }
    
    // Applicant-facing: Processes the booking form submission
    public function store(BookAppointmentRequest $request)
    {
        try {
            $appointment = $this->bookingService->bookRegularAppointment($request->user(), $request->validated());
            return redirect()->route('appointments.confirmation', $appointment)
                             ->with('success', 'Your appointment has been successfully booked.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    // Applicant-facing: Displays the booking confirmation page
    public function confirmation(Appointment $appointment)
    {
        $appointment->load('service', 'participants');
        return inertia('Public/Booking/Confirmation', [
            'appointment' => $appointment->toArray(),
        ]);
    }

    // Applicant-facing: Fetches available slots for the booking calendar
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'month' => 'required|date_format:Y-m',
        ]);
        $serviceId = $request->input('service_id');
        $month = $request->input('month');
        $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
        $endDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();
        $slots = Slot::where('service_id', $serviceId)
            ->where('is_active', true)
            ->where('current_capacity', '>', 0)
            ->whereBetween('slot_date', [$startDate, $endDate])
            ->orderBy('slot_date')
            ->orderBy('start_time')
            ->get();
        $groupedSlots = $slots->groupBy('slot_date')->map(function ($daySlots) {
            return $daySlots->map(function ($slot) {
                return [
                    'id' => $slot->id,
                    'time' => substr($slot->start_time, 0, 5),
                    'end_time' => substr($slot->end_time, 0, 5),
                    'capacity' => $slot->current_capacity,
                ];
            });
        });
        return response()->json(['slots' => $groupedSlots]);
    }

    // Admin/Registrar: Shows a single appointment
    public function show(Request $request, Appointment $appointment)
    {
        $appointment->load(['service', 'participants', 'bookedByUser', 'registarUser']);
        return new AppointmentResource($appointment);
    }

    // Admin/Registrar: Shows the edit form for an appointment
    public function edit(Request $request, Appointment $appointment)
    {
        return inertia('Admin/Appointments/Edit', [
            'appointment' => new AppointmentResource($appointment->load('service')),
            'services' => Service::query()
                ->select('id', 'name')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    // Admin/Registrar: Updates an appointment
    public function update(AppointmentUpdateRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());
        return redirect('appointments');
    }

    // Admin/Registrar: Deletes an appointment
    public function destroy(Request $request, Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back();
    }

    // Admin/Registrar: Cancels an appointment
    public function cancel(Request $request, Appointment $appointment)
    {
        $appointment->update(['status' => 'canceled']);
        return redirect()->back();
    }

    // Admin/Registrar: Displays the calendar view
    public function calendar(Request $request)
    {
        return inertia('Admin/Appointments/Calendar');
    }

    // Admin/Registrar: Provides calendar events data
    public function events(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');
        $appointments = Appointment::with(['service'])
            ->when($start && $end, function ($query) use ($start, $end) {
                $query->whereDate('scheduled_date', '>=', $start)
                    ->whereDate('scheduled_date', '<=', $end);
            })
            ->orderBy('scheduled_date')
            ->limit(1000)
            ->get();
        $events = $appointments->map(function ($appointment) {
            $date = optional($appointment->scheduled_date)->format('Y-m-d');
            $startTime = $appointment->start_time ? $appointment->start_time : '00:00:00';
            $endTime = $appointment->end_time ? $appointment->end_time : $startTime;
            return [
                'id' => $appointment->id,
                'title' => trim(($appointment->service->name ?? 'Appointment') . ' ' . ($appointment->code ? '(' . $appointment->code . ')' : '')),
                'start' => $date . 'T' . $startTime,
                'end' => $date . 'T' . $endTime,
                'extendedProps' => [
                    'status' => $appointment->status,
                    'type' => $appointment->type,
                    'service' => $appointment->service->name ?? null,
                    'code' => $appointment->code,
                ],
            ];
        });
        return response()->json($events);
    }

    // Admin/Registrar: Generates a PDF report
    public function report(Request $request)
    {
        $filters = $request->all();
        $appointments = Appointment::with(['service', 'bookedByUser'])
            ->filter($filters)
            ->orderBy('scheduled_date')
            ->limit(1000)
            ->get(); 
        $data = ['appointments' => $appointments->toResourceCollection()];
        return Pdf::loadView('appointments.report', $data)
              ->download('document.pdf');
    }
}