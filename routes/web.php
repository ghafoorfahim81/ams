<?php

use App\Http\Controllers\LanguageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicBooking\PublicBookingController;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;

// Public Routes - Unauthenticated users can access these
Route::group([], function () {
    Route::get('/', function () {
        return Inertia::render('Public/Welcome');
    })->name('welcome');
    Route::post('/switch-locale', [LanguageController::class, 'switch'])->name('language.switch');
});

// Guest Routes - Only unauthenticated users can access these
Route::middleware('guest')->group(function (): void {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('register/verify-otp', [RegisteredUserController::class, 'showOtpVerificationForm'])->name('register.verify_otp');
    Route::post('verify-otp', [RegisteredUserController::class, 'verifyOtp'])->name('verify.otp');
});

// Authenticated Routes - Login required
Route::middleware('auth')->group(function (): void {

    // All booking routes are now protected
    Route::prefix('book')->name('book.')->group(function () {
        Route::get('/', [PublicBookingController::class, 'create'])->name('create');
        Route::get('slots', [PublicBookingController::class, 'getAvailableSlots'])->name('slots');
        Route::post('/', [PublicBookingController::class, 'store'])->name('store');
        Route::get('confirmation/{appointment}', [PublicBookingController::class, 'confirmation'])->name('confirmation');
    });

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
 
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);

    Route::get('/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'unreadCount']);

    Route::resource('services', App\Http\Controllers\Service\ServiceController::class);
    Route::resource('service-categories', App\Http\Controllers\Service\ServiceCategoryController::class);
    Route::get('/appointments/calendar', [App\Http\Controllers\Appointment\AppointmentController::class, 'calendar'])->name('appointments.calendar');
    Route::get('/appointments/events', [App\Http\Controllers\Appointment\AppointmentController::class, 'events'])->name('appointments.events');
    Route::get('/appointments/report', [App\Http\Controllers\Appointment\AppointmentController::class, 'report'])->name('appointments.report');
    Route::resource('appointments', App\Http\Controllers\Appointment\AppointmentController::class);
    Route::resource('postal-codes', App\Http\Controllers\PostalCode\PostalCodeController::class);
    Route::resource('holidays', App\Http\Controllers\Holiday\HolidayController::class);
    Route::post('/appointments/{appointment}/cancel', [App\Http\Controllers\Appointment\AppointmentController::class, 'cancel'])->name('appointments.cancel');
    // Audit Logs
    Route::get('/logs', [App\Http\Controllers\Audit\AuditLogController::class, 'index'])->name('logs.index');
    Route::get('/logs/{log}', [App\Http\Controllers\Audit\AuditLogController::class, 'show'])->name('logs.show');

    Route::get('/broadcast', function () {
        $message = 'Hello from the server';
        broadcast(new \App\Events\DocumentOverdue($message));

        return response()->json(['message' => 'Broadcasting event']);
    });
    Route::fallback(fn() => response()->json([
        'message' => 'Route Not Found, Please check the URL and try again',
    ], 404));
});

require __DIR__ . '/auth.php';
