<?php

namespace App\Models\Document;

use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Action extends Model
{
    use HasFactory, HasUserAuditable, HasUserTracking;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'document_id',
        'content',
        'approved_by',
        'approved_at',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'document_id' => 'integer',
        'approved_by' => 'integer',
        'approved_at' => 'date',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
