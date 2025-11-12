<?php

namespace App\Console\Commands;

use App\Models\Trips;
use App\Models\Routes;
use App\Models\Contact;
use App\Traits\NotificationTrate;
use Auth;

use Illuminate\Console\Command;

class CompleteRouteCron extends Command
{
    use NotificationTrate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'complete:cron';

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
        $currentTime = time();
        $currentDate = date('Y-m-d');
        $oneDayBefore = date('Y-m-d', strtotime('-1 day', $currentTime));
        // dd($oneDayBefore);    
        // $currentDate = date('Y-m-d');
        if ($currentDate) {
            $trips = Trips::with('driver', 'vehicle', 'vendor', 'RoutesTo')->where('ship_date', $currentDate)->where('verify_status', "Accept")->get();
            if ($trips) {
                for ($i = 0; $i < Count($trips); $i++) {
                    // $serverKey = Auth::user()->project_app_token;
                    $driverID = Contact::where('id', $trips[$i]->driver_id)->pluck('fcm_token')->all();
                    if ($driverID) {
                        $title = "ATTENTION";
                        $body = "Please Complete routes";
                        $status = 1;
                        $this->notification($driverID, $title, $body, $status);
                    }
                }
            }
        }
    }
}
