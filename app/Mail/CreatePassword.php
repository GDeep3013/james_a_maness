<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CreatePassword extends Mailable
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

    // public function build()
    // {
    //     // Embed the logo image and pass it to the view
    //     $logoImagePath = public_path('/assets/img/logo.png');
    //     $logoImageContentId = 'logo_image';
    //     $logoImageData = file_get_contents($logoImagePath);
        
    //     return $this->subject('Create Password')
    //                 ->view('mails.createPassword')
    //                 ->with('mailData', $this->mailData)
    //                 ->attachData($logoImageData, 'logo.png', [
    //                     'mime' => 'image/png',
    //                     'as' => $logoImageContentId
    //                 ]);
    // }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Create Password',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        
        return new Content(
            view: 'mails.createPassword',
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