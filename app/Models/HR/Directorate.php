<?php

namespace App\Models\HR;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Directorate extends Model
{
    protected $table = 'directorates';

    protected $fillable = [
        'id',
        'name_prs',
        'name_en',
        'name_ps',
        'prefix',
        'parent_id',
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
