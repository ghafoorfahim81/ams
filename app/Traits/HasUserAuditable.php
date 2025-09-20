<?php

namespace App\Traits;

// use Auth;
use Illuminate\Support\Facades\Auth;

trait HasUserAuditable
{
    public static function bootHasUserAuditable(): void
    {
        static::creating(function ($model): void {
            $model->created_by = Auth::id() ?? 1;
            $model->updated_by = Auth::id() ?? 1;
        });

        static::updating(function ($model): void {
            $model->updated_by = Auth::id();
        });
    }
}
