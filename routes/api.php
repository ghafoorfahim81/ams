<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Broadcast::routes(); // Automatically uses 'auth:sanctum' from the middleware group
});



Route::apiResource('postal-codes', App\Http\Controllers\PostalCode\PostalCodeController::class);


Route::apiResource('holidays', App\Http\Controllers\Holiday\HolidayController::class);
