<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Mail\DatabaseBackupMail;

class BackupDatabase extends Command
{
    protected $signature = 'database:backup';
    protected $description = 'Backup the database and send it via email';

    public function handle()
    {
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST');

        $backupFileName = 'backup-' . Carbon::now()->format('Y-m-d_H-i-s') . '.sql';
        $backupPath = storage_path("app/{$backupFileName}");

        $command = "mysqldump --user={$username} --password={$password} --host={$host} {$database} > {$backupPath}";

        $process = Process::fromShellCommandline($command);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        // Send email with the backup
        Mail::to('deep.webzia@gmail.com')->send(new DatabaseBackupMail($backupFileName));

        // Delete the backup file after sending email
        Storage::delete($backupFileName);

        $this->info('Database backup completed and email sent successfully.');
    }
}