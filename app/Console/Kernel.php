<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Console\Scheduling\ScheduleListCommand;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\CheckDocumentDeadlines::class,
        ScheduleListCommand::class, // ✅ Add this line
    ];

    protected function schedule(Schedule $schedule)
    {

        $schedule->command('backup:run')->daily()->at('14:12')->timezone('Asia/Kabul');

        $schedule->command('document:check-deadlines')
            ->everySixHours()
            ->timezone('Asia/Kabul');
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}




