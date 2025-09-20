<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\HR\Employee;
use App\Traits\HasSearch;
use App\Traits\HasSorting;
use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    // /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, HasSearch, HasSorting, HasUserAuditable, HasUserTracking, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_name',
        'email',
        'password',
        'status',
        'avatar',
        'employee_id',
        'created_at',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    protected static function searchableColumns(): array
    {
        return [
            'user_name',
            'email',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function directorate()
    {
        return $this->employee?->directorate;
    }
}
