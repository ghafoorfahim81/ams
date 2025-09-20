<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QRCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'code', 
        'is_active',
        'scanned_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'scanned_at' => 'datetime',
    ];

    // --- Relationships ---

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}