<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trips;
use App\Models\Routes;
use App\Models\Driver;
use App\Models\RouteStops;
use Auth;
use App\Traits\NotificationTrate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use App\Models\MainRouteStops;
use App\Traits\MainRouteStopsTraits;
use App\Models\MainRoutes;
use App\Events\TimeLineUpdated;
use Illuminate\Support\Facades\DB;
use App\Models\MainRoute;
use Log;
use Http;
use App\Http\Requests\TripRequest;
use App\Traits\TripDataTransformer;

class TripController extends Controller
{
    use MainRouteStopsTraits;
    use NotificationTrate, TripDataTransformer;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $currentDate = now()->toDateString(); // Outputs: 2024-11-18
        // $currentTime = now()->toTimeString();
        // dd($currentDate, $currentTime);
        // $serverTimezone = date_default_timezone_get();
        // dd($serverTimezone);

        $tableColumns = Schema::getColumnListing('trips');
        $query = trips::with(['driver', 'vehicle', 'vendor', 'RoutesTo' => function ($query) {
            $query->orderBy('name', 'asc');
        }, 'route_stops', 'time_line']);
        $searchTerm = $request->search;
        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                // Make sure the column exists before querying
                if (Schema::hasColumn('trips', $column)) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            }
            $query->orWhereHas('driver', function ($subQuery) use ($searchTerm) {
                $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
            })
                ->orWhereHas('vehicle', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('truck', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('vendor', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('RoutesTo', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('name', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('code', 'LIKE', '%' . $searchTerm . '%');;
                });
        });

        // $tripsQuery = Trips::with('driver', 'vehicle', 'vendor', 'RoutesTo', 'route_stops');
        if (!empty($request->page) && $request->page !== 'page') {
            $dateString = preg_replace('/\s*GMT\s*\d{4}\s*\(.*\)/', '', $request->date);
            if (strpos($dateString, "GMT") !== false) {
                $gmtPosition = strpos($dateString, "GMT");
                $dateString = substr($dateString, 0, $gmtPosition);
                $dateString = rtrim($dateString);
            }
            $dateTime = Carbon::createFromFormat('D M d Y H:i:s', $dateString);
            $currentDate = $dateTime->format('Y-m-d');
            $old_date_timestamp = strtotime($currentDate);
            $date = date('Y-m-d', $old_date_timestamp);
            $trips = $query->where('pickup_date', $date)->paginate(50);
            if (!empty($trips)) {
                return response()->json(['status' => true, 'trip' => $trips]);
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found']);
            }
        } else if ($request->page === 'page') {
            $trips = trips::with('driver', 'vehicle', 'vendor', 'RoutesTo', 'route_stops', 'time_line')
                ->orderBy('pickup_date', 'desc') // Assuming there's a 'created_at' timestamp field
                ->paginate(10);
            if (!empty($trips)) {
                return response()->json(['status' => true, 'trip' => $trips]);
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found']);
            }
        } else {
            $trips = $query->get();
            if (!empty($trips)) {
                return response()->json(['status' => true, 'trip' => $trips]);
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found']);
            }
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (!empty($id)) {
            $route = Trips::with([
                'driver',
                'vehicle',
                'vendor',
                'RoutesTo',
                'route_stops',
                'time_line' => function ($query) {
                    $query->leftJoin('users', function ($join) {
                        $join->on('timelines.user_id', '=', 'users.id')
                            ->where('timelines.type', 'Assigned'); // Join for Assigned type
                    })
                        ->leftJoin('drivers', function ($join) {
                            $join->on('timelines.user_id', '=', 'drivers.id')
                                ->where('timelines.type', '!=', 'Assigned'); // Join for other types
                        })
                        ->select(
                            'timelines.*',
                            DB::raw("COALESCE(users.name, CONCAT(COALESCE(drivers.first_name, ''), ' ', COALESCE(drivers.last_name, ''))) as user_name"),
                            DB::raw("COALESCE(users.email, drivers.email) as user_email") // Fallback to drivers email
                        );
                }
            ])->where('id', $id)->first();


            return response()->json(['status' => true, 'data' => $route]);
        } else {
            return response()->json(['status' => false, 'message' => 'Routes not found']);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TripRequest $request, $id)
    {

        try {

            $validatedData = $request->validated();

            $routes = Trips::where("id", $id)->first();

            if (!empty($routes)) {
                $routes->user_id = Auth::user()->id;

                $routes->load_time = $request->load_time;

                $routes->vendor_id = $validatedData['vendor_id'];
                $routes->vendor_name = $request->vendor_name;
                $routes->vendor_email = $request->vendor_email;
                $routes->vendor_phone = $request->vendor_phone;
                $routes->vendor_address = $request->vendor_address;

                $routes->driver_id = $validatedData['driver_id'];
                $routes->driver_first_name = $request->driver_first_name;
                $routes->driver_last_name = $request->driver_last_name;
                $routes->driver_phone = $request->driver_phone;
                $routes->driver_license_no = $request->driver_license_no;
                $routes->driver_address = $request->driver_address;

                $routes->vehicle_id = $validatedData['vehicle_id'];
                $routes->vehicle_number_plate = @$request->vehicle_number_plate;
                $routes->vehicle_model = @$request->vehicle_model;
                $routes->vehicle_unit_no = @$request->vehicle_unit_no;

                $routes->pickup_company_name = $request->pickup_company_name;
                $routes->pickup_add1 = $validatedData['pickup_add1'];
                $routes->pickup_city = $request->pickup_city;
                $routes->pickup_state = $request->pickup_state;
                $routes->pickup_country = $request->pickup_country;
                $routes->pickup_zip = $request->pickup_zip;
                $routes->pickup_lat = $request->pickup_lat;
                $routes->pickup_long = $request->pickup_long;

                $routes->pickup_load_time = $request->pickup_load_time;
                $routes->pickup_departure_time = $request->pickup_departure_time;
                $routes->ship_company_name = $request->ship_company_name;
                $routes->ship_first_name = $validatedData['ship_first_name'];
                $routes->ship_last_name = $request->ship_last_name;
                $routes->ship_email = $validatedData['ship_email'];
                $routes->ship_phone = $validatedData['ship_phone'];
                $routes->ship_add1 = $validatedData['ship_add1'];
                $routes->ship_city = $request->ship_city;
                $routes->ship_state = $request->ship_state;
                $routes->ship_country = $request->ship_country;
                $routes->ship_zip = $request->ship_zip;
                $routes->ship_lat = $request->ship_lat;
                $routes->ship_long = $request->ship_long;
                $routes->ship_unload_time = $request->ship_unload_time;
                $routes->load_type = $validatedData['load_type'];
                $routes->load_quantity = $validatedData['load_quantity'];
                $routes->load_unit = $request->load_unit;
                $routes->freight_amt = $request->freight_amt;
                $routes->tax_type = $request->tax_type;
                $routes->pickup_date = $validatedData['pickup_date'];
                $routes->pickup_time = $request->pickup_time;
                $routes->ship_date = $validatedData['ship_date'];
                $routes->ship_time = $request->dropoff_time;
                $routes->info = $request->addtional_info;

                if ($routes->save()) {

                    if ($request->route_stops) {

                        // foreach ($request->route_stops as $key => $s_) {

                        //     $s_ = is_array($s_) ? $s_ : (array)$s_;

                        //     $etime = isset($s_['departure_time'])
                        //         ? Carbon::parse($s_['departure_time'])->addMinutes(20)->format('H:i')
                        //         : null;
                        //     $stop =  isset($s_['id']) ? RouteStops::find($s_['id']) : new RouteStops();
                        //     $stop->trip_id = $id;
                        //     $stop->route_stops_date = $s_['route_stops_date'];
                        //     $stop->route_stops_stime = $s_['route_stops_stime'];
                        //     $stop->route_stops_etime = $etime;
                        //     $stop->departure_time = $s_['departure_time'];
                        //     $stop->route_stops_desc = $s_['route_stops_desc'];
                        //     $stop->latitude = $s_['latitude'];
                        //     $stop->longitude = $s_['longitude'];
                        //     $stop->save();
                        // }
                        foreach ($request->route_stops as $key => $s_) {

                            // Ensure $s_ is an array
                            $s_ = is_array($s_) ? $s_ : (array)$s_;

                            // --- Handle departure_time safely ---
                            $departureTime = null;
                            if (!empty($s_['departure_time']) && $s_['departure_time'] !== 'Invalid Date') {
                                try {
                                    $departureTime = Carbon::parse($s_['departure_time'])->format('H:i');
                                } catch (\Exception $e) {
                                    $departureTime = null;
                                }
                            }

                            // --- Calculate end time (20 minutes after departure) ---
                            $etime = $departureTime
                                ? Carbon::parse($departureTime)->addMinutes(20)->format('H:i')
                                : null;

                            // --- Skip invalid entries (no location or description) ---
                            if (empty($s_['route_stops_desc']) || empty($s_['latitude']) || empty($s_['longitude'])) {
                                continue;
                            }

                            // --- CASE 1: Update existing record if ID is provided ---
                            if (!empty($s_['id'])) {
                                $stop = RouteStops::find($s_['id']);
                                if (!$stop) {
                                    $stop = new RouteStops();
                                }
                            }
                            // --- CASE 2: Otherwise, check for existing record to prevent duplicates ---
                            else {
                                $stop = RouteStops::where([
                                    'trip_id'          => $id,
                                    'route_stops_date' => $s_['route_stops_date'] ?? null,
                                    'route_stops_desc' => $s_['route_stops_desc'] ?? null,
                                    'latitude'         => $s_['latitude'] ?? null,
                                    'longitude'        => $s_['longitude'] ?? null,
                                ])->first() ?? new RouteStops();
                            }

                            // --- Assign fields ---
                            $stop->trip_id = $id;
                            $stop->route_stops_date = $s_['route_stops_date'] ?? null;
                            $stop->route_stops_stime = (!empty($s_['route_stops_stime']) && $s_['route_stops_stime'] !== 'Invalid Date')
                                ? $s_['route_stops_stime']
                                : null;
                            $stop->route_stops_etime = $etime;
                            $stop->departure_time = $departureTime;
                            $stop->route_stops_desc = $s_['route_stops_desc'] ?? null;
                            $stop->latitude = $s_['latitude'] ?? null;
                            $stop->longitude = $s_['longitude'] ?? null;
                            // $stop->active = $s_['active'] ?? true;

                            $stop->save();
                        }
                    }
                    $currentDate = now()->toDateString();
                    $currentTime = now()->toTimeString();
                    event(new TimeLineUpdated(
                        $routes->id,
                        Auth::user()->id,
                        $routes->status,
                        'Route has been' . strtolower($routes->status) . '.',
                        $currentDate,
                        $currentTime
                    ));
                    $driverID = Driver::where('id', $validatedData['driver_id'])->select('id', 'fcm_token')->first();

                    // if ($driverID) {
                    //     $title = "You have a new trip assigned.";
                    //     $status = 0;
                    //     $this->notification($driverID->fcm_token, $title, $status);
                    // }
                    return response()->json(['status' => true, 'message' => 'Routes update successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to save routes']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found']);
            }
            // }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $routeIds = explode(',', $id);
        $recordsExist = Trips::whereIn('id', $routeIds)->exists();
        if ($recordsExist) {
            try {
                // Delete the trips
                Trips::whereIn('id', $routeIds)->delete();
                RouteStops::whereIn('trip_id', $routeIds)->delete();

                return response()->json([
                    'status' => true,
                    'message' => 'The selected route(s) have been successfully deleted.'
                ]);
            } catch (\Exception $e) {
                // Handle unexpected exceptions
                return response()->json([
                    'status' => false,
                    'message' => 'An error occurred while deleting the route(s): ' . $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'The specified route(s) were not found.'
            ], 404);
        }
    }


    public function deleteStop($id)
    {
        RouteStops::where('id', $id)->delete();
        return response()->json(['status' => true, 'message' => 'Stop Delete Successfully']);
    }


    public function reassignRoutes(Request $request)
    {
        try {
            $newDate = $request->pickUpDate;
            $tripIds = $request->tripIds;

            if (empty($newDate) || empty($tripIds)) {
                return response()->json(['status' => false, 'message' => 'Invalid data provided.'], 400);
            }

            $successCount = 0;
            $existingTrips = []; // Array to store trip codes of existing trips
            $newTripsAssign = [];
            foreach ($tripIds as $tripId) {
                // Retrieve the trip by ID
                $trip = Trips::with('RoutesTo')->where('id', $tripId)->first();
                if (!$trip) {
                    continue; // Skip if trip not found
                }

                // $tripCount = Trips::where('pickup_date', $newDate)
                //     ->where('route_id', $trip->route_id)
                //     ->count();
                // // dd($tripCount);s
                // if ($tripCount > 0) {
                //     // dd($trip->RoutesTo);
                //     $routeCode = $trip->RoutesTo ? $trip->RoutesTo->name : null;
                //     $existingTrips[] = $routeCode; // Add trip code to the array
                //     continue; // Skip if a trip with the same route and date already exists
                // }

                // Replicate the trip with the new date
                $newTrip = $trip->replicate();
                $newTrip->trip_date = $newDate;
                $newTrip->pickup_date = $newDate;
                $newTrip->ship_date = $newDate;
                $newTrip->status = "Assigned";
                $newTrip->auth_code = null;
                $newTrip->verify_status = null;
                $newTrip->trip_start_date = null;
                $newTrip->trip_end_date = null;

                $newTrip->save();
                $newTripsAssign[] = $trip->RoutesTo ? $trip->RoutesTo->name : null;
                // Replicate associated route stops
                $routeStops = RouteStops::where('trip_id', $tripId)
                    ->orderBy('route_stops_date')
                    ->orderBy('route_stops_stime')
                    ->get()->toArray();
                $stopsData = $this->prepareTripStopsData($routeStops, $newTrip->id, $newDate);

                if (!empty($stopsData)) {
                    RouteStops::insert($stopsData);
                }
                // foreach ($routeStops as $routeStop) {
                //     $newRouteStop = $routeStop->replicate();
                //     $newRouteStop->trip_id = $newTrip->id;
                //     $newRouteStop->route_stops_date = $newDate;
                //     $newRouteStop->save();
                // }

                // Log the event in the timeline
                $currentDate = now()->toDateString();
                $currentTime = now()->toTimeString();
                event(new TimeLineUpdated(
                    $newTrip->id,
                    Auth::id(),
                    'Assigned',
                    'Route has been assigned.',
                    $currentDate,
                    $currentTime
                ));

                // Notify the driver
                $driverToken = Driver::where('id', $trip->driver_id)->value('fcm_token');
                if ($driverToken) {
                    $this->notification([$driverToken], "ATTENTION : New Trip", "You have a new trip assigned.", 0);
                }

                $successCount++;
            }

            if (empty($existingTrips) && empty($newTripsAssign)) {
                return response()->json(['status' => false, 'message' => 'No routes reassigned. Either routes already exist.']);
            } else if (count($existingTrips) > 0 && empty($newTripsAssign)) {
                return response()->json([
                    'status' => false,
                    // 'message' =>  $string . " has been alredy created with current date " . $newDate,
                    'message' => "Routes Assignment",
                    'newTrip' => $newTripsAssign,
                    'existTrip' => $existingTrips
                ]);
            } else if (count($newTripsAssign) > 0 && count($existingTrips) > 0) {
                return response()->json([
                    'status' => true,
                    // 'message' => implode(', ', $newTripsAssign) . ' have been successfully created. The following trips ' . implode(', ', $existingTrips) . " have been already created with current date " . $newDate,
                    'message' => "Routes Assignment",
                    'newTrip' => $newTripsAssign,
                    'existTrip' => $existingTrips
                ]);
            } else {
                return response()->json([
                    'status' => true,
                    // 'message' => implode(', ', $newTripsAssign) . ' have been successfully created.',
                    'message' => "Routes Assignment",
                    'newTrip' => $newTripsAssign,
                    'existTrip' => $existingTrips
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Error reassigning routes: ' . $e->getMessage()], 500);
        }
    }



    private function getNewPickupTime($newDate, $pickupTime)
    {
        $parsedNewDate = Carbon::parse($newDate);
        $updatedTime = Carbon::parse($pickupTime)
            ->setDate($parsedNewDate->year, $parsedNewDate->month, $parsedNewDate->day)
            ->format('Y-m-d H:i:s');
        return $updatedTime;
    }

    public function getRoutes()
    {
        // $routes = Routes::with('trips')->get();
        $routes = Routes::whereNull('route_ref_id')->orWhere('route_ref_id', '')->get();
        if (!empty($routes)) {
            return response()->json(['status' => true, 'route' => $routes]);
        } else {
            return response()->json(['status' => false, 'message' => 'Routes not found']);
        }
    }

    public function updateAuthCode(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'auth' => 'required|unique:trips,auth_code', // Replace with your actual table and column names
            ]);
            $existingRecord = Trips::where('auth_code', $validatedData['auth'])->where('id', '<>', $request->id)->first();
            // dd($existingRecord);
            if ($existingRecord) {
                return response()->json(['status' => false, 'error' => 'errors', 'message' => 'The auth has already been taken.']);
            }
            $trip = Trips::where('id', $request->id)->first();
            if ($trip) {
                $trip->auth_code = $validatedData['auth'];
                if ($trip->save()) {
                    return response()->json(['status' => true, 'message' => "Authorization code update successfully"]);
                } else {
                    return response()->json(['status' => false,  'message' => "Failed to update authorization code"]);
                }
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }


    public function updateTripStatus(Request $request)
    {
        $trip = Trips::where('id', $request->id)->first();
        $trip->status = $request->status;
        if ($trip->save()) {
            return response()->json(['status' => true, 'message' => "Trip status updated successfully"]);
        } else {
            return response()->json(['status' => false,  'message' => "Failed to update trip status"]);
        }
    }
    public function pushNotification($driverIds)
    {
        $serverKey = 'AAAA2D_4juw:APA91bGA1Uw5PplplfUPUNAnG8ahqQPSopDu6OE4EUXhmWYPviaLO_gGH_8zuh2vEw1c_lBumq6bfzfCG6epVuUdItPYgXDT2lBgz5nzAkO2pe5auAqwvsZHB10hZ0HepMRi8T_FeBhD';

        // Replace with the FCM endpoint
        $endpoint = 'https://fcm.googleapis.com/fcm/send';

        // Define the notification payload
        $payload = array(
            'notification' => array(
                'body' => 'Notification from postman',
                'title' => 'Assign new route.',
            ),
            'data' => array(
                'status' => '1',
            ),
            'registration_ids' => $driverIds,
            // 'registration_ids' => array(
            //     'fxvGXL0hRZ6NW2E6VkDyIp:APA91bFGANyW8sjZQnMDaJ3mkQfn10NFRAbMA28_Yos1pA_qORX6y4BhCnndHfTyYTzpE0AXMIRRzI5r1ZXBWtTxO2lkx7CptDjkXz7XHI0ulZv0K0jLDnicfM-PVHO4WXJ2IIIamVvl',
            // ),
        );

        // Set the cURL options
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: key=' . $serverKey,
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

        // Execute the cURL request
        $response = curl_exec($ch);

        if ($response === false) {
            echo 'cURL error: ' . curl_error($ch);
        } else {
            echo 'Response: ' . $response;
        }

        // Close cURL session
        curl_close($ch);
    }

    public function getRoutesBetweenDates(Request $request)
    {
        // $data = Trips::with('RoutesTo')->where('route_id', $request->id)
        //     ->where('vendor_id', $request->vendor_id)
        //     ->whereBetween('pickup_date', [$request->sDate, $request->eDate])
        //     ->get();
        // return response()->json(['status' => true, 'data' => $data]);

        if (isset($request->type) && $request->type === 'additional_route') {
            $routes = Routes::where('route_ref_id', $request->id)->pluck('id');

            $data = Trips::with('RoutesTo')
                ->withCount('route_stops')
                ->whereIn('route_id', $routes)
                ->where('vendor_id', $request->vendor_id)
                ->whereBetween('pickup_date', [$request->sDate, $request->eDate])
                ->where('status', '!=', 'Canceled')
                ->get();
            return response()->json(['status' => true, 'data' => $data]);
        } else {
            $data = Trips::with('RoutesTo')
                ->withCount('route_stops')
                ->where('route_id', $request->id)
                ->where('vendor_id', $request->vendor_id)
                ->whereBetween('pickup_date', [$request->sDate, $request->eDate])
                ->where('status', '!=', 'Canceled')
                ->get();
            return response()->json(['status' => true, 'data' => $data]);
        }
    }
    public function getCoordinates($locationName)
    {
        $googleMapApiKey = config('app.google_map_api_key');

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $locationName,
            'key' => $googleMapApiKey,
        ]);
        // GOOGLE_MAP_API_KEY = "AIzaSyD72l8xa5b6eKw1dqNq_SR1nuD0yUS4L8o"
        $data = $response->json();
        return $data;
    }
    public function storeMainRouteDataUsingDateRoute()
    {
        ini_set('max_execution_time', 300);
        $routes = Routes::select('id', \DB::raw('MIN(id) as first_trip_id'))
            ->groupBy('id')
            ->with('trips')
            ->get()
            ->map(function ($trip) {
                return Trips::where('route_id', $trip->first_trip_id)->first();
            });
        // dd($routes->toArray());

        foreach ($routes as $route) {
            if (!empty($route)) {
                MainRoute::updateOrCreate(
                    ['route_id' => $route->id],
                    [
                        'user_id' => 1,
                        'vendor_id' => $route->vendor_id,
                        'driver_id' => $route->driver_id,
                        'vehicle_id' => $route->vehicle_id,
                        'pickup_add1' => $route->pickup_add1,
                        'pickup_city' => $route->pickup_city,
                        'pickup_state' => $route->pickup_state,
                        'pickup_country' => $route->pickup_country,
                        'pickup_zip' => $route->pickup_zip,
                        'pickup_lat' => $route->pickup_lat,
                        'pickup_long' => $route->pickup_long,
                        'pickup_load_time' => $route->pickup_load_time,
                        'pickup_departure_time' => $route->pickup_departure_time,
                        'ship_first_name' => $route->ship_first_name,
                        'ship_last_name' => $route->ship_last_name,
                        'ship_email' => $route->ship_email,
                        'ship_phone' => $route->ship_phone,
                        'ship_add1'    => $route->ship_add1,
                        'ship_add2'    => $route->ship_add2,
                        'ship_city'    => $route->ship_city,
                        'ship_state' => $route->ship_state,
                        'ship_country' => $route->ship_country,
                        'ship_zip' => $route->ship_zip,
                        'ship_lat' => $route->ship_lat,
                        'ship_long'    => $route->ship_long,
                        'ship_unload_time' => $route->ship_unload_time,
                        'load_type'    => $route->load_type,
                        'load_quantity' => $route->load_quantity,
                        'load_unit'    => $route->load_unit,
                        'freight_amt' => $route->freight_amt,
                        'tax_type' => $route->tax_type,
                        'pickup_date' => $route->pickup_date,
                        'pickup_time' => $route->pickup_time,
                        'ship_date' => $route->ship_date,
                        'ship_time'    => $route->ship_time,
                        'info' => $route->info,
                        'auto_assign' => $route->auto_assign,
                        'status' => $route->status,
                        'route_stops_date' => $route->route_stops_date,
                        'route_stops_time' => $route->route_stops_time,
                        'route_stops_desc' => $route->route_stops_desc,
                        'trip_start_date' => $route->trip_start_date,
                        'trip_end_date' => $route->trip_end_date,
                        'latitude'    => $route->latitude,
                        'longitude'    => $route->longitude,
                    ]
                );
            }
        }


        $mainRoutes = MainRoute::all();
        // dd($mainRoutes->toArray());
        foreach ($mainRoutes as $routes) {
            // dd($routes);
            $trip = Trips::where('id', $routes->route_id)->first();
            $routeStops = RouteStops::where('trip_id', $trip->id)->get();
            foreach ($routeStops as $stops) {
                $routeData = [
                    'main_routes_id' => $routes->id,
                    'route_stops_id' => $stops->id,
                ];
                MainRouteStops::create($routeData);
            }
        }
        return "success";
    }
}
