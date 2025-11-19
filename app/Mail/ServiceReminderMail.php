<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    public function __construct($mailData)
    {
        $this->mailData = $mailData;
    }

    public function envelope()
    {
        $status = $this->mailData['reminder_status'] ?? 'due_soon';
        $subject = match ($status) {
            'overdue' => '⚠️ Service Reminder Overdue - Action Required',
            'due_soon' => '🔔 Service Reminder Due Soon - Action Required',
            default => '🔔 Service Reminder Notification',
        };

        return new Envelope(
            subject: $subject,
        );
    }

    public function content()
    {
        return new Content(
            view: 'mails.serviceReminderMail',
            with: [
                'mailData' => $this->mailData,
            ],
        );
    }

    public function attachments()
    {
        return [];
    }
}

