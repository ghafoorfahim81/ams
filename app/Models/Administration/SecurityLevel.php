<?php

namespace App\Models\Administration;

use App\Traits\HasSearch;
use App\Traits\HasSorting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class SecurityLevel extends Model
{
    use HasFactory, HasRoles, HasSearch, HasSorting, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name_fa',
        'name_en',
        'name_ps',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
    ];

    protected static function searchableColumns(): array
    {
        return [
            'name_fa',
            'name_en',
            'name_ps',
        ];
    }
}
