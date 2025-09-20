<?php

namespace App\Models\Document;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'path',
        'tracker_id',
    ];
}
