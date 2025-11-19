<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ServiceReminder;
use App\Models\Contact;
use App\Models\Vehical;
use App\Mail\ServiceReminderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendServiceReminderMeterCron extends Command
{
    protected $signature = 'service-reminder:send-meter-based';

    protected $description = 'Send service reminder notifications based on meter intervals (runs daily at 7:00 AM)';

    public function handle()
    {
        $this->info('Starting meter-based service reminder check...');

        $currentDate = Carbon::now();

        $reminders = ServiceReminder::with(['vehicle', 'serviceTask'])
            ->where('status', 'active')
            ->where('notifications_enabled', true)
            ->whereNotNull('primary_meter_interval_value')
            ->whereNotNull('primary_meter_interval_unit')
            ->whereNotNull('next_due_meter')
            ->get();

        $sentCount = 0;
        $skippedCount = 0;

        foreach ($reminders as $reminder) {
            try {
                if (!$reminder->next_due_meter || !$reminder->vehicle_id) {
                    continue;
                }

                $vehicle = Vehical::find($reminder->vehicle_id);
                if (!$vehicle || !$vehicle->current_mileage) {
                    $skippedCount++;
                    continue;
                }

                $currentMeter = (float) $vehicle->current_mileage;
                $nextDueMeter = (float) $reminder->next_due_meter;
                $meterDifference = $nextDueMeter - $currentMeter;

                $isOverdue = $meterDifference < 0;
                $isDueSoon = false;

                if ($reminder->primary_meter_due_soon_threshold_value && $reminder->primary_meter_interval_unit) {
                    $thresholdValue = $this->convertToHours(
                        $reminder->primary_meter_due_soon_threshold_value,
                        $reminder->primary_meter_interval_unit
                    );
                    $isDueSoon = $meterDifference >= 0 && $meterDifference <= $thresholdValue;
                }

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
                            $this->sendNotification($reminder, $watcher, $reminderStatus, $meterDifference, $currentMeter, $nextDueMeter);
                            $sentCount++;
                        }
                    }
                } else {
                    $this->warn("Reminder #{$reminder->id} has no watchers assigned.");
                }
            } catch (\Exception $e) {
                Log::error("Error processing meter-based service reminder #{$reminder->id}: " . $e->getMessage());
                $this->error("Error processing reminder #{$reminder->id}: " . $e->getMessage());
            }
        }

        $this->info("Meter-based reminders processed. Sent: {$sentCount}, Skipped: {$skippedCount}");
        return 0;
    }

    private function sendNotification($reminder, $watcher, $reminderStatus, $meterDifference, $currentMeter, $nextDueMeter)
    {
        try {
            $vehicleName = $reminder->vehicle->vehicle_name ?? 'N/A';
            $serviceTaskName = $reminder->serviceTask->name ?? 'N/A';
            $nextDueDate = $reminder->next_due_date ? Carbon::parse($reminder->next_due_date)->format('Y-m-d') : 'N/A';

            $mailData = [
                'title' => 'Service Reminder Notification (Meter-Based)',
                'name' => $watcher->first_name . ' ' . ($watcher->last_name ?? ''),
                'vehicle_name' => $vehicleName,
                'service_task' => $serviceTaskName,
                'next_due_date' => $nextDueDate,
                'reminder_status' => $reminderStatus,
                'meter_difference' => abs($meterDifference),
                'current_meter' => $currentMeter,
                'next_due_meter' => $nextDueMeter,
                'meter_unit' => $reminder->primary_meter_interval_unit ?? 'mi',
                'meter_interval' => $reminder->primary_meter_interval_value . ' ' . $reminder->primary_meter_interval_unit,
                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
            ];

            Mail::to($watcher->email)->send(new ServiceReminderMail($mailData));

            Log::info("Meter-based service reminder notification sent to {$watcher->email} for reminder #{$reminder->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send meter-based service reminder notification to {$watcher->email}: " . $e->getMessage());
            throw $e;
        }
    }

    private function convertToHours($value, $unit)
    {
        $unit = strtolower($unit);
        $value = (float) $value;

        return match ($unit) {
            'hr', 'hour', 'hours' => $value,
            'mi', 'mile', 'miles' => $value,
            'km', 'kilometer', 'kilometers' => $value,
            default => $value,
        };
    }
}

