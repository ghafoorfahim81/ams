<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostalCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'is_permitted', 
    ];

    protected $casts = [
        'is_permitted' => 'boolean',
    ];
}