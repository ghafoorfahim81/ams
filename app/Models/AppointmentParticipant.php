<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'full_name',
        'identification_number',
        'relation_to_applicant',
    ];

    // --- Relationships ---

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}