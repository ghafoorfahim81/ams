<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentParticipant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingService
{
    // Define the maximum allowed appointments globally
    private const MAX_TOTAL_APPOINTMENTS = 7;

    /**
     * Executes the appointment booking transaction, enforcing all business rules.
     *
     * @param User $user The authenticated user making the booking.
     * @param array $data Validated data from the request.
     * @return Appointment The newly created appointment model.
     * @throws \Exception If a business rule is violated or the transaction fails.
     */
    public function bookRegularAppointment(User $user, array $data): Appointment
    {
        // Fetch the slot data to use in the transaction (assuming you have a Slot model/table)
        // For now, we simulate fetching the slot details:
        // NOTE: In a real system, you'd fetch the Slot model and lock it: Slot::lockForUpdate()->findOrFail($data['slot_id']);

        $slotDetails = [
            'scheduled_date' => $data['slot_date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'capacity' => 1, // Assume 1 for simplicity of this example
            'slot_id' => 1, // Placeholder
        ];

        // 1. Initial Business Rule Checks (These checks are idempotent and safe outside the transaction)
        $this->ensureLimitsAreMet($user, $data['service_id']);

        try {
            DB::beginTransaction();

            // 2. Concurrency Check (This MUST be done inside the transaction boundary)
            // If using a Slot model, this is where you check capacity and decrement:
            // if ($slot->capacity <= 0) { throw new \Exception('Slot capacity is zero.'); }
            // $slot->decrement('capacity');

            // 3. Create Appointment
            $appointment = Appointment::create([
                'code' => 'AMS-' . time() . Str::random(4),
                'service_id' => $data['service_id'],
                'booked_by_user_id' => $user->id,
                'type' => 'REGULAR',
                'status' => 'confirmed',
                'scheduled_date' => $slotDetails['scheduled_date'],
                'start_time' => $slotDetails['start_time'],
                'end_time' => $slotDetails['end_time'],
                'postal_address' => $user->userPostalCode->address ?? $data['postal_address'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            // 4. Add Participants
            foreach ($data['participants'] as $participant) {
                AppointmentParticipant::create([
                    'appointment_id' => $appointment->id,
                    'full_name' => $participant['full_name'],
                    'relationship' => $participant['relation'] ?? null, // Match your request field 'relation'
                    'identification_number' => $participant['identification_number'] ?? null,
                ]);
            }

            // 5. Generate QR Code (Placeholder for secure, non-PII generation)
            // $this->generateSecureQrCode($appointment);

            // 6. Audit Log (Placeholder)
            // $this->logBookingAction($user, $appointment);

            DB::commit();

            // 7. Notification (Outside transaction, using queues)
            // $user->notify(new AppointmentBookedNotification($appointment));

            return $appointment;

        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception for system tracing
            \Log::error("Booking Transaction Failed: " . $e->getMessage(), ['user_id' => $user->id]);
            // Re-throw the exception for the controller to handle
            throw $e;
        }
    }

    /**
     * Enforces the Max 7 appointments and One Active per Service rules.
     * @throws \Exception
     */
    private function ensureLimitsAreMet(User $user, int $serviceId): void
    {
        // Max 7 appointments per user (across services)
        $totalAppointments = Appointment::where('booked_by_user_id', $user->id)->count();
        if ($totalAppointments >= self::MAX_TOTAL_APPOINTMENTS) {
            throw new \Exception('You have reached the maximum limit of 7 appointments allowed across all services.');
        }

        // Only one active upcoming per (user, service)
        $hasActiveAppointment = Appointment::where('booked_by_user_id', $user->id)
            ->where('service_id', $serviceId)
            ->where('status', '!=', 'canceled') // Not canceled
            ->whereDate('scheduled_date', '>=', Carbon::today()) // Date is today or later
            ->exists();

        if ($hasActiveAppointment) {
            throw new \Exception('You already have one active (upcoming) appointment for this service type.');
        }
    }
}