<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Storage;

class DatabaseBackupMail extends Mailable
{
    use Queueable, SerializesModels;

    public $backupFileName;

    public function __construct($backupFileName)
    {
        $this->backupFileName = $backupFileName;
    }

    public function build()
    {
        $backupPath = storage_path("app/{$this->backupFileName}");

        return $this->subject('Database Backup')
                    ->attach($backupPath)
                    ->view('mails.database_backup');
    }
}
