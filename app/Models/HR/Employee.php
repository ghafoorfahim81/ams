<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';

    protected $fillable = [
        'id',
        'name',
        'last_name',
        'father_name',
        'position',
        'gender',
        'phone',
        'bast',
        'email',
        'department',
        'directorate_id',
        'hire_status',
        'deleted_at',
    ];

    public function directorate()
    {
        return $this->belongsTo(Directorate::class);
    }
}
