<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\AcceptRouteCron::class,
        Commands\CompleteRouteCron::class,
    ];
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('accept:cron')->hourly();
        $schedule->command('complete:cron')->dailyAt('22:00');  // Database Backup

        $schedule->command('database:backup')->dailyAt('23:00');

        $schedule->command('track:cron')->everyTwoMinutes();
        $schedule->command('reminder:cron')->daily();

        $schedule->command('service-reminder:send-time-based')->dailyAt('07:00');
        $schedule->command('service-reminder:send-meter-based')->dailyAt('07:00');

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
