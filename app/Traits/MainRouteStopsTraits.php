<?php

namespace App\Traits;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Http;
use App\Models\MainRoute;
use App\Models\MainRouteStop;
use Auth;
use Log;
use Illuminate\Support\Arr;
use Carbon\Carbon;

trait MainRouteStopsTraits
{

    public function createMainRoutsWithStops($data)
    {
        $normalizedData = is_array($data) ? $data : (array)$data;
        $mainRoute = MainRoute::updateOrCreate(
            ['route_id' => Arr::get($normalizedData, 'route_id')],
            [
                'user_id' => Auth::user()->id,
                'vendor_id' => Arr::get($normalizedData, 'vendor_id'),
                'driver_id' => Arr::get($normalizedData, 'driver_id'),
                'vehicle_id' => Arr::get($normalizedData, 'vehicle_id'),
                'pickup_company_name' => Arr::get($normalizedData, 'pickup_company_name'),
                'pickup_add1' => Arr::get($normalizedData, 'pickup_add1'),
                'pickup_city' => Arr::get($normalizedData, 'pickup_city'),
                'pickup_state' => Arr::get($normalizedData, 'pickup_state'),
                'pickup_country' => Arr::get($normalizedData, 'pickup_country'),
                'pickup_zip' => Arr::get($normalizedData, 'pickup_zip'),
                'pickup_lat' => Arr::get($normalizedData, 'pickup_lat'),
                'pickup_long' => Arr::get($normalizedData, 'pickup_long'),
                'pickup_load_time' => Arr::get($normalizedData, 'pickup_load_time'),
                'pickup_departure_time' => Arr::get($normalizedData, 'pickup_departure_time'),
                'ship_company_name' => Arr::get($normalizedData, 'ship_company_name'),
                'ship_first_name' => Arr::get($normalizedData, 'ship_first_name'),
                'ship_last_name' => Arr::get($normalizedData, 'ship_last_name'),
                'ship_email' => Arr::get($normalizedData, 'ship_email'),
                'ship_phone' => Arr::get($normalizedData, 'ship_phone'),
                'ship_add1' => Arr::get($normalizedData, 'ship_add1'),
                'ship_city' => Arr::get($normalizedData, 'ship_city'),
                'ship_state' => Arr::get($normalizedData, 'ship_state'),
                'ship_country' => Arr::get($normalizedData, 'ship_country'),
                'ship_zip' => Arr::get($normalizedData, 'ship_zip'),
                'ship_lat' => Arr::get($normalizedData, 'ship_lat'),
                'ship_long' => Arr::get($normalizedData, 'ship_long'),
                'ship_unload_time' => Arr::get($normalizedData, 'ship_unload_time'),
                'load_time' => Arr::get($normalizedData, 'load_time'),
                'load_type' => Arr::get($normalizedData, 'load_type'),
                'load_quantity' => Arr::get($normalizedData, 'load_quantity'),
                'load_unit' => Arr::get($normalizedData, 'load_unit'),
                'freight_amt' => Arr::get($normalizedData, 'freight_amt'),
                'tax_type' => Arr::get($normalizedData, 'tax_type'),
                'pickup_date' => Arr::get($normalizedData, 'pickup_date'),
                'pickup_time' => Arr::get($normalizedData, 'pickup_time'),
                'ship_date' => Arr::get($normalizedData, 'ship_date'),
                'ship_time' => Arr::get($normalizedData, 'dropoff_time'),
                'info' => Arr::get($normalizedData, 'info'),
                'status' => Arr::get($normalizedData, 'status'),
            ]
        );
        if ($mainRoute) {
            return [
                'status' => true,
                'data' => $mainRoute
            ];
        }
    }


    function saveMainStops($stopsData, $id)
    {
        foreach ($stopsData as $stop) {

            // 1. Handle departure time safely
            $departureTime = null;
            if (!empty($stop['departure_time']) && $stop['departure_time'] !== 'Invalid Date') {
                try {
                    $departureTime = Carbon::parse($stop['departure_time'])->format('H:i');
                } catch (\Exception $e) {
                    $departureTime = null;
                }
            }

            // 2. Calculate end time (20 mins later)
            $etime = $departureTime
                ? Carbon::parse($departureTime)->addMinutes(20)->format('H:i')
                : null;

            // 3. Prepare update data
            $data = [
                'route_stops_stime' => (!empty($stop['route_stops_stime']) && $stop['route_stops_stime'] !== 'Invalid Date')
                    ? $stop['route_stops_stime']
                    : null,
                'route_stops_etime' => $etime,
                'departure_time'    => $departureTime,
                'active'            => $stop['active'] ?? true,
            ];

            // 4. CASE 1: Update existing record by ID (if provided)
            if (!empty($stop['id'])) {
                MainRouteStop::updateOrCreate(
                    ['id' => $stop['id']],
                    array_merge([
                        'route_id'          => $id,
                        'route_stops_date'  => $stop['route_stops_date'] ?? null,
                        'route_stops_desc'  => $stop['route_stops_desc'] ?? null,
                        'latitude'          => $stop['latitude'] ?? null,
                        'longitude'         => $stop['longitude'] ?? null,
                    ], $data)
                );
            }

            // 5. CASE 2: No ID — match by route_id + stop info + date (avoid duplicate)
            else {
                MainRouteStop::updateOrCreate(
                    [
                        'route_id'          => $id,
                        'route_stops_date'  => $stop['route_stops_date'] ?? null,
                        'route_stops_desc'  => $stop['route_stops_desc'] ?? null,
                        'latitude'          => $stop['latitude'] ?? null,
                        'longitude'         => $stop['longitude'] ?? null,
                    ],
                    $data
                );
            }
        }
        // foreach ($stopsData as $stop) {

        //     $etime = (isset($stop['departure_time']) && !empty($stop['departure_time']) && $stop['departure_time'] != 'Invalid Date')
        //         ? Carbon::parse($stop['departure_time'])->addMinutes(20)->format('H:i')
        //         : null;
        //     MainRouteStop::updateOrCreate(
        //         [
        //             'id' => $stop['id'] ?? null, // Match by ID if provided
        //             'route_id' => $id,
        //             'route_stops_desc' => $stop['route_stops_desc'] ?? null,
        //             'latitude' => $stop['latitude'] ?? null,
        //             'longitude' => $stop['longitude'] ?? null
        //         ],
        //         [
        //             'route_stops_date' => $stop['route_stops_date'],
        //             'route_stops_stime' => $stop['route_stops_stime'] !== 'Invalid Date' ? $stop['route_stops_stime'] : null,
        //             'route_stops_etime' => $etime,
        //             'departure_time' => @$stop['departure_time'] !== 'Invalid Date' ? @$stop['departure_time'] : null,
        //             // 'route_stops_desc' => $stop['route_stops_desc'] ?? null,
        //             // 'latitude' => $stop['latitude'] ?? null,
        //             // 'longitude' => $stop['longitude'] ?? null,
        //             'active' => $stop['active'] ?? true, // Default active to true
        //         ]
        //     );
        // }
    }



    public function createMainStops($mainRouteId, $routeStopsId)
    {
        $routeData = [
            'main_routes_id' => $mainRouteId->id,
            'route_stops_id' => $routeStopsId->id,
        ];
        Log::info("MainRouteStop", ['data' => $routeData]);
        // $deleted = MainRouteStop::where('main_routes_id', $mainRouteId->id)->delete();
        // if ($deleted) {
        MainRouteStop::create($routeData);
        // }
    }
}
