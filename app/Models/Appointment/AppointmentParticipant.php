<?php

namespace App\Models\Appointment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'full_name',
        'relationship',
        'identification_number',
    ];

    // --- Relationships ---

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Appointment\Appointment::class);
    }
}
