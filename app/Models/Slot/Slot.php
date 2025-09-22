<?php

namespace App\Models\Slot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Service\Service;
use App\Models\Appointment\AppointmentParticipant;

class Slot extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'slots';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'service_id',
        'slot_date',
        'start_time',
        'end_time',
        'type',
        'initial_capacity',
        'current_capacity',
        'is_active',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the service that owns the slot.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the appointments for the slot.
     */
    public function participants()
    {
        return $this->hasMany(AppointmentParticipant::class);
    }
}
