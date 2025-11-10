<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Traits\NotificationTrate;
use App\Models\Locations;
use App\Models\Vehical;
use App\Traits\LocationTrait;
use App\Http\Controllers\LocationController;

class TrackingCron extends Command
{
    use NotificationTrate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'track:cron';

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
        $controller = new LocationController();
        // $controller->index("");
        // $vehicleData = Vehical::pluck('track_device_id');
        // if(count($vehicleData) > 0) {
        //     for ($i = 0; $i < count($vehicleData); $i++) {
        //         $liveTrack = $this->getVehicleTracking($vehicleData[$i]);
        //         $response = json_decode($liveTrack, true);
        //         // dump($response, $response['devices'][0]['id']);
        //         if ($response['status']) {
        //             $conditions = ['device_id' => $response['devices'][0]['id']];
        //             $address = $this->getaddress($response['devices'][0]['latitude'], $response['devices'][0]['longitude']);
        //             $addressData = json_decode($address, true);
        //             Locations::updateOrCreate($conditions, [
        //                 'device_id' => $response['devices'][0]['id'],	
        //                 'name' => $response['devices'][0]['name'],	
        //                 'angle' => $response['devices'][0]['angle'],	
        //                 'speed' => $response['devices'][0]['speed'],	
        //                 'ignition' => $response['devices'][0]['ignition'],	
        //                 'odometer' => $response['devices'][0]['odometer'],	
        //                 'device_time' => $response['devices'][0]['device_time'],	
        //                 'server_time' => $response['devices'][0]['server_time'],	
        //                 'latitude' => $response['devices'][0]['latitude'],	
        //                 'longitude' => $response['devices'][0]['longitude'],	
        //                 'address' => $addressData['display_name'],
        //             ]);
        //         }
        //     }
           
        // } 
    }
}
