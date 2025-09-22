<?php

namespace App\Http\Controllers\PublicBooking;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\BookAppointmentRequest; // Use the new professional name
use App\Models\Appointment\Appointment;
use App\Services\BookingService; // Use the new Service Class
use App\Models\Service\Service;
use App\Models\Slot\Slot; // <-- NEW: IMPORT THE SLOT MODEL
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicBookingController extends Controller
{
    protected BookingService $bookingService;

    // Inject the service into the controller
    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    // Corresponds to 'book.create' route - Step 1/2 View
    public function create()
    {
        $services = Service::where('is_active', true)->select('id', 'name', 'duration', 'description')->get();

        return inertia('Public/Booking/Create', [
            'services' => $services,
            // Pass any initial data needed for the calendar
        ]);
    }

    // Corresponds to 'book.store' route - Final Submission
    public function store(BookAppointmentRequest $request)
    {
        try {
            // Delegate core logic and transaction to the Service Class
            $appointment = $this->bookingService->bookRegularAppointment($request->user(), $request->validated());
            
            // Success: Redirect to confirmation page
            return redirect()->route('book.confirmation', $appointment)
                             ->with('success', 'Your appointment has been successfully booked.');

        } catch (\Exception $e) {
            // Handle exceptions thrown by the BookingService (e.g., limit exceeded, slot gone)
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    // Corresponds to 'book.confirmation' route - Success View
    public function confirmation(Appointment $appointment)
    {
        $appointment->load('service', 'participants');

        return inertia('Public/Booking/Confirmation', [
            'appointment' => $appointment->toArray(),
        ]);
    }

    // Now correctly use this method to handle the API request.
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $serviceId = $request->input('service_id');
        $month = $request->input('month');

        // 1. Determine the date range for the requested month
        $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
        $endDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();
        
        // 2. Query the database for slots
        $slots = Slot::where('service_id', $serviceId)
            ->where('is_active', true)
            ->where('current_capacity', '>', 0) // Only show slots with capacity
            ->whereBetween('slot_date', [$startDate, $endDate])
            ->orderBy('slot_date')
            ->orderBy('start_time')
            ->get();

        // 3. Transform and group the slots for the frontend
        $groupedSlots = $slots->groupBy('slot_date')->map(function ($daySlots) {
            return $daySlots->map(function ($slot) {
                // Map the database structure to the structure the frontend expects
                return [
                    'id' => $slot->id,
                    'time' => substr($slot->start_time, 0, 5), // Only take HH:MM
                    'end_time' => substr($slot->end_time, 0, 5),
                    'capacity' => $slot->current_capacity,
                ];
            });
        });

        // 4. Return the response
        return response()->json([
            'slots' => $groupedSlots,
        ]);
    }
}
