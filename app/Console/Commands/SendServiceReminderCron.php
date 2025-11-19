<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ServiceReminder;
use App\Models\Contact;
use App\Mail\ServiceReminderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendServiceReminderCron extends Command
{
    protected $signature = 'service-reminder:send-time-based';

    protected $description = 'Send service reminder notifications based on time intervals (runs daily at 7:00 AM)';

    public function handle()
    {
        $this->info('Starting time-based service reminder check...');

        $currentDate = Carbon::now();

        $reminders = ServiceReminder::with(['vehicle', 'serviceTask'])
            ->where('status', 'active')
            ->where('notifications_enabled', true)
            ->whereNotNull('time_interval_value')
            ->whereNotNull('time_interval_unit')
            ->whereNotNull('next_due_date')
            ->get();

        $sentCount = 0;
        $skippedCount = 0;

        foreach ($reminders as $reminder) {
            try {
                if (!$reminder->next_due_date) {
                    continue;
                }

                $nextDueDate = Carbon::parse($reminder->next_due_date);
                $daysUntilDue = $currentDate->diffInDays($nextDueDate, false);

               // dd($daysUntilDue);

                $isOverdue = $daysUntilDue < 0;
                $isDueSoon = false;

                if ($reminder->time_due_soon_threshold_value && $reminder->time_due_soon_threshold_unit) {
                    $thresholdDays = $this->convertToDays(
                        $reminder->time_due_soon_threshold_value,
                        $reminder->time_due_soon_threshold_unit
                    );
                    $isDueSoon = $daysUntilDue >= 0 && $daysUntilDue <= $thresholdDays;
                }

                //dd($isDueSoon,$isOverdue);

                if (!$isOverdue && !$isDueSoon) {
                    $skippedCount++;
                    continue;
                }

                $reminderStatus = $isOverdue ? 'overdue' : 'due_soon';

                if ($reminder->watchers && is_array($reminder->watchers) && count($reminder->watchers) > 0) {
                    
                    $watchers = Contact::whereIn('id', $reminder->watchers)
                        ->where('status', 'Active')
                        ->get();

                    foreach ($watchers as $watcher) {
                        if ($watcher->email) {
                            $this->sendNotification($reminder, $watcher, $reminderStatus, $daysUntilDue);
                            $sentCount++;
                        }
                    }
                } else {
                    $this->warn("Reminder #{$reminder->id} has no watchers assigned.");
                }
            } catch (\Exception $e) {
                Log::error("Error processing service reminder #{$reminder->id}: " . $e->getMessage());
                $this->error("Error processing reminder #{$reminder->id}: " . $e->getMessage());
            }
        }

        $this->info("Time-based reminders processed. Sent: {$sentCount}, Skipped: {$skippedCount}");
        return 0;
    }

    private function sendNotification($reminder, $watcher, $reminderStatus, $daysUntilDue)
    {
        try {
            $vehicleName = $reminder->vehicle->vehicle_name ?? 'N/A';
            $serviceTaskName = $reminder->serviceTask->name ?? 'N/A';
            $nextDueDate = $reminder->next_due_date ? Carbon::parse($reminder->next_due_date)->format('Y-m-d') : 'N/A';

            $mailData = [
                'title' => 'Service Reminder Notification',
                'name' => $watcher->first_name . ' ' . ($watcher->last_name ?? ''),
                'vehicle_name' => $vehicleName,
                'service_task' => $serviceTaskName,
                'next_due_date' => $nextDueDate,
                'reminder_status' => $reminderStatus,
                'days_until_due' => abs($daysUntilDue),
                'time_interval' => $reminder->time_interval_value . ' ' . $reminder->time_interval_unit,
                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
            ];

            Mail::to($watcher->email)->send(new ServiceReminderMail($mailData));

            Log::info("Service reminder notification sent to {$watcher->email} for reminder #{$reminder->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send service reminder notification to {$watcher->email}: " . $e->getMessage());
            throw $e;
        }
    }

    private function convertToDays($value, $unit)
    {
        $unit = strtolower($unit);
        $value = (float) $value;

        return match ($unit) {
            'day', 'days' => $value,
            'week', 'weeks' => $value * 7,
            'month', 'months' => $value * 30,
            'year', 'years' => $value * 365,
            default => $value,
        };
    }
}

