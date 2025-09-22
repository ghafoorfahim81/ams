<?php

use App\Http\Controllers\DirectorateController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', 'login');

Route::middleware('auth')->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('dashboard', [App\Http\Controllers\Dashboard\DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard-data', [\App\Http\Controllers\Dashboard\DashboardController::class, 'dashboardData'])->name('dashboard-data');

    Route::resource('users', App\Http\Controllers\Administration\UserController::class);

    Route::resource('roles', App\Http\Controllers\RolePermission\RoleController::class);
    Route::get('/roles/{role}/permissions', [App\Http\Controllers\RolePermission\RoleController::class, 'getRolePermissions']);
    Route::post('/roles/{role}/assign-permissions', [App\Http\Controllers\RolePermission\RoleController::class, 'assignPermissions']);

    // Permission Routes
    Route::apiResource('permissions', App\Http\Controllers\RolePermission\PermissionController::class);

    // User Role/Permission Routes
    Route::get('/users/{user}/roles-permissions', [App\Http\Controllers\RolePermission\UserRolePermissionController::class, 'getUserRolesAndPermissions']);
    Route::post('/users/{user}/assign-role', [App\Http\Controllers\RolePermission\UserRolePermissionController::class, 'assignRole']);
    Route::post('/users/{user}/revoke-role', [App\Http\Controllers\RolePermission\UserRolePermissionController::class, 'revokeRole']);
    Route::post('/users/{user}/assign-permission', [App\Http\Controllers\RolePermission\UserRolePermissionController::class, 'assignPermission']);
    Route::post('/users/{user}/revoke-permission', [App\Http\Controllers\RolePermission\UserRolePermissionController::class, 'revokePermission']);

    // Administration

    Route::get('/get-locale', [LanguageController::class, 'getLocale'])->name('language.get');
    Route::get('/search-items', SearchController::class)->name('search.items');
    Route::get('/directorates/{id}/users', [DirectorateController::class, 'getUsersByDirectorate'])->name('directorate.users');

    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);

    Route::get('/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'unreadCount']);

    Route::resource('services', App\Http\Controllers\Service\ServiceController::class);
    Route::get('/appointments/calendar', [App\Http\Controllers\Appointment\AppointmentController::class, 'calendar'])->name('appointments.calendar');
    Route::get('/appointments/events', [App\Http\Controllers\Appointment\AppointmentController::class, 'events'])->name('appointments.events');
    Route::resource('appointments', App\Http\Controllers\Appointment\AppointmentController::class);
    Route::resource('postal-codes', App\Http\Controllers\PostalCode\PostalCodeController::class);
    Route::resource('holidays', App\Http\Controllers\Holiday\HolidayController::class);
    Route::post('/appointments/{appointment}/cancel', [App\Http\Controllers\Appointment\AppointmentController::class, 'cancel'])->name('appointments.cancel');

    Route::get('/broadcast', function () {
        $message = 'Hello from the server';
        broadcast(new \App\Events\DocumentOverdue($message));

        return response()->json(['message' => 'Broadcasting event']);
    });
    Route::fallback(fn() => response()->json([
        'message' => 'Route Not Found, Please check the URL and try again',
    ], 404));
});

Route::post('/switch-locale', [LanguageController::class, 'switch'])->name('language.switch');

require __DIR__ . '/auth.php';
