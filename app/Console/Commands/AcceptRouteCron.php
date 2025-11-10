<?php

namespace App\Console\Commands;
use App\Models\Trips;
use App\Models\Routes;
use App\Models\Driver;
use Auth;
use App\Traits\NotificationTrate;
use Illuminate\Console\Command;

class AcceptRouteCron extends Command
{
    use NotificationTrate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accept:cron';

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
        $currentDate = date('Y-m-d');
        $trips = Trips::with('driver', 'vehicle', 'vendor', 'RoutesTo')->where('pickup_date', $currentDate)->whereNull('verify_status')->get();
        if($trips){
            for ($i = 0; $i < Count($trips); $i++){
                // $serverKey = Auth::user()->project_app_token;
                $driverID = Driver::where('id', $trips[$i]->driver_id)->pluck('fcm_token')->all();
                if ($driverID) {
                    $title = "ATTENTION";
                    $body = "Please review and accept the routes";
                    $status = 0;
                    $this->notification($driverID, $title, $body, $status);
                }
            }
        }
    }
}
