<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Slot extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'slot_date',
        'start_time',
        'type',
        'initial_capacity',
        'current_capacity',
        'is_active',
    ];

    protected $casts = [
        'slot_date' => 'date',
        'initial_capacity' => 'integer',
        'current_capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    // --- Relationships ---

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}