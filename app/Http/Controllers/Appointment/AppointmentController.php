<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\AppointmentStoreRequest;
use App\Http\Requests\Appointment\AppointmentUpdateRequest;
use App\Http\Resources\Appointment\AppointmentResource;
use App\Models\Appointment\Appointment;
use App\Models\Service\Service;
use App\Enums\Status;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
class AppointmentController extends Controller
{
    public function index(Request $request)
    {
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

        return inertia('Admin/Appointments/Index', [
            'appointments' => $appointments->toResourceCollection(),
            'statusOptions' => collect(Status::cases())->map(fn($s) => ['id' => $s->value, 'name' => $s->getLabel()]),
            'services' => Service::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'users' => \App\Models\User::query()->orderBy('full_name')->take(50)->get(['id', 'full_name as name']),
        ]);
    }

    public function store(AppointmentStoreRequest $request)
    {
        $appointment = Appointment::create($request->validated());

        return new AppointmentResource($appointment);
    }

    public function show(Request $request, Appointment $appointment)
    {
        $appointment->load(['service', 'participants', 'bookedByUser', 'registarUser']);
        return new AppointmentResource($appointment);
    }

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

    public function update(AppointmentUpdateRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());

        return redirect('appointments');
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back();
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $appointment->update(['status' => 'canceled']);
        return redirect()->back();
    }

    public function calendar(Request $request)
    {
        return inertia('Admin/Appointments/Calendar');
    }

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
