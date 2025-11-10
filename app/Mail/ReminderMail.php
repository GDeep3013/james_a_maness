<?php 
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReminderMail extends Mailable
{
    use Queueable, SerializesModels;
    public $mailData;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($mailData)
    {
        // dd($mailData);
        $this->mailData = $mailData;
    }
    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        $type = $this->mailData['type'];

        $subject = match ($type) {
            'Insurance' => '🚚 Your Vehicle Insurance Is Expiring Soon - Take Action Now!',
            'Driver' => match ($this->mailData['reminder_type'] ?? 'default') { 
                'permit' => '✈️ Your International Driving Permit (IDP) Is Expiring Soon - Renew Now!',
                'health' => '🩺 Your Health Insurance Is Expiring Soon - Renew Now!',
                'permit_renewal' => '💼 Your Work Permit Renewal Is Due Soon - Take Action Now!',
                'medical' => '🏥 Your Medical Fitness Certificate Is Expiring Soon - Renew Now!',
                'Others' => '⚠️ Your Document Is Expiring Soon - Take Action Now!',
                default => '🚚 Your Driving License Is Expiring Soon - Renew Now!',
            },
            'Safety' => '🚚 Your Vehicle Safety Inspection - Take Action Now!',
            'Others' => '🚚 Other Reminders - Take Action Now!', 
            default => '⚠️ Important Reminder - Take Action Now!', 
        };
    
        return new Envelope(
            subject: $subject,
        );
        // return new Envelope(
        //     subject: $this->mailData['type'] === "Insurance" ? '🚚 Your Vehicle Insurance Is Expiring Soon - Take Action Now!' : '🚚 Your Driving License Is Expiring Soon - Renew Now!',
        // );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'mails.reminderMail',
            with: [
                'mailData' => $this->mailData, 
            ],
        );
    }
    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}