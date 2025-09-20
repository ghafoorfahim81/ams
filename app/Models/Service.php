<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'duration', // In minutes (used for calculating slot end time)
        'capacity', // Base capacity per slot
        'is_active',
    ];

    protected $casts = [
        'duration' => 'integer',
        'capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    // --- Relationships ---

    /**
     * Get the appointments associated with the service.
     *
     * @return HasMany
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the available time slots for the service.
     *
     * @return HasMany
     */
    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }
}