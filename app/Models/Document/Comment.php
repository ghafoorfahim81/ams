<?php

namespace App\Models\Document;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'parent_id',
        'tracker_id',
        'body',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function tracker()
    {
        return $this->belongsTo(Tracker::class);
    }
}
