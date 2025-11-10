<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reminder;
use App\Mail\ReminderMail;
use Illuminate\Support\Facades\Mail;


class ReminderCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $reminderData = Reminder::with('driver', 'insurance.vehicle', 'vehicle')->where('status', 'Pending')->get();
        $currentDate = date('Y-m-d');
        if ($reminderData) {
            foreach ($reminderData as $reminder) {
                // dump($reminder->toArray());
                if ($reminder->insurance !== null && ($reminder->document_type === "Insurance")) {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'name' => $reminder->insurance->insured_name,
                                'type' => $reminder->document_type,
                                'expire_date' => $reminder->expire_date,
                                'policy_no' => $reminder->insurance->policy_no,
                                // 'vehicle' => implode(", ", [$reminder->insurance->vehicle->make, $reminder->insurance->vehicle->model, $reminder->insurance->vehicle->year]),
                                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
                                'message' => $reminder->comments,
                                'vehicle_vin_no' => $reminder->vehicle_vin_no,
                                'reminder_type' => $reminder->driver_reminder ?? "",
                                'truck' => $reminder->insurance->vehicle->truck,
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                $mail->cc($reminder->cc_email);
                            }
                            if (!empty($reminder->bcc_email)) {
                                $mail->bcc($reminder->bcc_email);
                            }
                            Mail::to($reminder->email)->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                    // dd($reminder->toArray(), $reminder->insurance->end_date, $daysBefore);
                } else if ($reminder->driver !== null && $reminder->document_type === "Driver") {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore  || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'name' => $reminder->driver->first_name . ' ' . $reminder->driver->last_name,
                                'type' => $reminder->document_type,
                                'expire_date' => $reminder->expire_date,
                                'license_no' => $reminder->driver->license_no,
                                'license_class' => $reminder->driver->license_class,
                                'message' => $reminder->comments,
                                'reminder_type' => $reminder->driver_reminder,
                                'reminder_msg'=> $this->generateReminderMessage($reminder->expire_date, $reminder->driver_reminder),
                                'truck' => ""
                            ];

                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                $mail->cc($reminder->cc_email);
                            }
                            if (!empty($reminder->bcc_email)) {
                                $mail->bcc($reminder->bcc_email);
                            }
                            // if ($reminder->driver_reminder === 'license' && !empty($reminder->driver->license_expire_date) && !empty($reminder->driver->license_no)) {
                            //     Mail::to($reminder->email)->send($mail);
                            //     $reminder->status = "Completed";
                            // } elseif ($reminder->driver_reminder !== 'license') {
                            //     $reminder->status = "Completed";
                            //     Mail::to($reminder->email)->send($mail);
                            // }
                            // $reminder->save();

                            $sendEmail = false;

                            if ($reminder->driver_reminder === 'license') {
                                if (!empty($reminder->driver->license_expire_date) && !empty($reminder->driver->license_no)) {
                                    Mail::to($reminder->email)->send($mail);
                                    $sendEmail = true;
                                }
                            } elseif ($reminder->driver_reminder !== 'license') {
                                Mail::to($reminder->email)->send($mail);
                                $sendEmail = true;
                            }

                            // Update status only if email is sent
                            if ($sendEmail) {
                                $reminder->status = "Completed";
                                $reminder->save();
                            }
                        }
                    }
                } else if ($reminder->document_type === "Safety") {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $originalDate || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                // 'name' => $reminder->toArray(),
                                'type' => $reminder->document_type,
                                'truck' => $reminder->vehicle->truck,
                                'expire_date' => $reminder->expire_date,
                                // 'policy_no' => $reminder->insurance->policy_no,
                                "tires" => $reminder->tires,
                                "brakes" => $reminder->brakes,
                                "lights" => $reminder->lights,
                                "windshield" => $reminder->windshield,
                                "wipers" => $reminder->wipers,
                                "mirrors" => $reminder->mirrors,
                                "seatbelts" => $reminder->seatbelts,
                                "steering" => $reminder->steering,
                                "suspension" => $reminder->suspension,
                                // 'vehicle' => implode(", ", [$reminder->insurance->vehicle->make, $reminder->insurance->vehicle->model, $reminder->insurance->vehicle->year]),
                                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
                                'message' => $reminder->comments,
                               
                                'vehicle_vin_no' => $reminder->vehicle_vin_no,
                                'reminder_type' => $reminder->driver_reminder ?? ""
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                $mail->cc($reminder->cc_email);
                            }
                            if (!empty($reminder->bcc_email)) {
                                $mail->bcc($reminder->bcc_email);
                            }
                            Mail::to($reminder->email)->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                } else {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore  || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'type' => $reminder->document_type,
                                'name' => '',
                                'expire_date' => $reminder->expire_date,
                                'message' => $reminder->comments,
                                'reminder_type' => $reminder->driver_reminder ?? "",
                                'truck' => "",
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                $mail->cc($reminder->cc_email);
                            }
                            if (!empty($reminder->bcc_email)) {
                                $mail->bcc($reminder->bcc_email);
                            }
                            Mail::to($reminder->email)->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                }
            }
        }
    }

    private function generateReminderMessage($expireDate, $reminderType) {
        // $expireDate = $mailData['expire_date'];
        // $reminderType = $mailData['reminder_type'];
    
        switch ($reminderType) {
            case 'permit':
                return "Your International Driving Permit (IDP) will expire on {$expireDate}. Please renew it promptly.";
            case 'health':
                return "Your Health Insurance will expire on {$expireDate}. Please renew it promptly.";
            case 'permit_renewal':
                return "Your Work Permit Renewal is due on {$expireDate}. Please renew it promptly.";
            case 'medical':
                return "Your Medical Fitness certificate will expire on {$expireDate}. Please renew it promptly.";
            default:
                return "A document or item is set to expire on {$expireDate}. Please address this promptly.";
        }
    }
}
