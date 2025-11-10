<?php

namespace App\Traits;

use Auth;
use App\Models\Vendor;
use App\Models\Driver;
use App\Models\Vehical;

trait TripDataTransformer
{

    public function prepareTripData(array $data): array
    {

        $tripData =  $data['main_route'];

        unset($tripData['id'], $tripData['created_at'], $tripData['updated_at']);

        $tripData['user_id'] = Auth::id();

        if (isset($tripData['vendor_id']) && $tripData['vendor_id']) {
            $vendor =  Vendor::findOrFail($tripData['vendor_id']);
            $tripData['vendor_name'] = @$vendor->first_name;
            $tripData['vendor_email'] = @$vendor->email;
            $tripData['vendor_phone'] = @$vendor->company_contact;
            $tripData['vendor_address'] = @$vendor->address;
        }

        if (isset($tripData['driver_id']) && $tripData['driver_id']) {
            $driver = Driver::findOrFail($tripData['driver_id']);
            $tripData['driver_first_name'] = @$driver->first_name;
            $tripData['driver_last_name'] = @$driver->last_name;
            $tripData['driver_phone'] = @$driver->phone;
            $tripData['driver_license_no'] = @$driver->license_no;
            $tripData['driver_address'] = @$driver->address;
        }

        if (isset($tripData['vehicle_id']) && $tripData['vehicle_id']) {
            $vehical = Vehical::findOrFail($tripData['vehicle_id']);
            $tripData['vehicle_number_plate'] = @$vehical->number_plate;
            $tripData['vehicle_model'] = @$vehical->model;
            $tripData['vehicle_unit_no'] = @$vehical->truck;
        }


        $tripData['created_at'] = now();
        $tripData['updated_at'] = now();

        // Additional modifications if necessary
        $tripData['status'] = 'Assigned'; // Default value

        return $tripData;
    }

    function prepareTripStopsData(array $stops, $trip_id, $newDate): array
    {

        $allStopes = [];
        // dd($stops);
        $baseDate = \Carbon\Carbon::parse($stops[0]['route_stops_date']);
        $newBaseDate = \Carbon\Carbon::parse($newDate);
        foreach ($stops as $key => $stop) {
            // Calculate date difference between current stop and first stop
            $currentDate = \Carbon\Carbon::parse($stop['route_stops_date']);
            $diffInDays = $baseDate->diffInDays($currentDate);

            // New date = $newDate + difference
            $updatedDate = $newBaseDate->copy()->addDays($diffInDays)->toDateString();

            // Remove unwanted keys
            unset($stop['active'], $stop['id'], $stop['route_id'], $stop['created_at'], $stop['updated_at']);

            // Assign new fields
            $stop['trip_id'] = $trip_id;
            $stop['route_stops_date'] = $updatedDate;

            $allStops[] = $stop;
        }

        return $allStops;

        // foreach ($stops as $key => $stop) {

        //     unset($stop['active'],$stop['id'],$stop['route_id'],$stop['created_at'],$stop['updated_at']);
        //     $stop['trip_id'] =  $trip_id;
        //     $stop['route_stops_date'] = $newDate;
        //     $allStopes[] = $stop;
        // }
        // return $allStopes;
    }
}
