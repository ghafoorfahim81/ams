<?php

namespace App\Models\Appointment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\HasSearch;
use App\Traits\HasFilters;
use App\Traits\HasSorting;
use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;

class Appointment extends Model
{
    use HasFactory, HasRoles, HasSearch, HasFilters, HasSorting, HasUserAuditable, HasUserTracking, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'service_id',
        'booked_by_user_id',
        'registar_user_id',
        'type',
        'status',
        'scheduled_date',
        'start_time',
        'end_time',
        'postal_address',
        'notes',
        'created_by',
        'updated_by',
        'canceled_at',
        'canceled_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'scheduled_date' => 'datetime',
            'canceled_at' => 'timestamp',
        ];
    }

    protected static function searchableColumns(): array
    {
        return [
            'code',
            'type',
            'status',
            'scheduled_date',
            'start_time',
            'end_time',
            'postal_address',
            'notes',
            'service.name',
            'bookedByUser.email',
        ];
    }

    /**
     * Attributes that can be filtered via query string
     * Supports relation columns using dot notation per HasFilters
     *
     * Available filters:
     * - code
     * - booked_by_user_id
     * - status
     * - type
     * - name (service.name)
     * - email (bookedByUser.email)
     */
    protected static array $filterableAttributes = [
        'code',
        'booked_by_user_id',
        'service_id',
        'status',
        'type',
        'service.name',
        'bookedByUser.email',
    ];


    public function service(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Service\Service::class);
    }

    public function bookedByUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'booked_by_user_id');
    }

    public function registarUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function canceledBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function participants()
    {
        return $this->hasMany(\App\Models\Appointment\AppointmentParticipant::class);
    }
}
