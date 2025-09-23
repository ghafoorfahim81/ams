<?php

namespace App\Observers;

use App\Models\Appointment\Appointment;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Auth;

class AppointmentObserver
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    public function created(Appointment $appointment): void
    {
        $this->auditLogger->log('appointment.created', [
            'appointment_id' => $appointment->id,
            'by_admin' => Auth::user()?->hasRole('admin') ?? false,
            'attributes' => $appointment->getAttributes(),
        ]);
    }

    public function updated(Appointment $appointment): void
    {
        $changes = $appointment->getChanges();
        unset($changes['updated_at']);

        if (! empty($changes)) {
            $this->auditLogger->log('appointment.updated', [
                'appointment_id' => $appointment->id,
                'by_admin' => Auth::user()?->hasRole('admin') ?? false,
                'changes' => $changes,
            ]);
        }
    }

    public function deleted(Appointment $appointment): void
    {
        $this->auditLogger->log('appointment.deleted', [
            'appointment_id' => $appointment->id,
            'by_admin' => Auth::user()?->hasRole('admin') ?? false,
        ]);
    }
}
