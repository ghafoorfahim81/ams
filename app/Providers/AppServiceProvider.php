<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Appointment\Appointment;
use App\Observers\AppointmentObserver;
use App\Services\AuditLogger;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Model Observers
        Appointment::observe($this->app->make(AppointmentObserver::class));

        // Auth Events
        Event::listen(Login::class, function ($event): void {
            /** @var AuditLogger $logger */
            $logger = app(AuditLogger::class);
            $logger->log('auth.login', [
                'user_id' => $event->user->id,
                'ip' => request()?->ip(),
                'user_agent' => request()?->userAgent(),
            ]);
        });
    }
}
