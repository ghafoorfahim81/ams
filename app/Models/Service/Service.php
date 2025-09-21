<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\HasSearch;
use App\Traits\HasSorting;
use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;

class Service extends Model
{
    use HasFactory, HasRoles, HasSearch, HasSorting, HasUserAuditable, HasUserTracking, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'duration',
        'capacity_per_slot',
        'is_active',
        'description',
        'is_emergency',
        'created_by',
        'updated_by',
    ];

    protected static function searchableColumns(): array
    {
        return [
            'name',
            'description',
        ];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'is_active' => 'boolean',
            'is_emergency' => 'boolean',
        ];
    }
}
