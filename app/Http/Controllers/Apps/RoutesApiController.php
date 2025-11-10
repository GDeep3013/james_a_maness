<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trips;
use App\Models\Driver;
use App\Models\Vehical;
use Illuminate\Support\Facades\Mail;
use App\Mail\DriverOtpSendMail;
use App\Traits\NotificationTrate;
use App\Models\Locations;
use App\Models\Reminder;
use App\Mail\ReminderMail;
use App\Models\RouteStops;
use App\Events\TimeLineUpdated;
use Http;
use Auth;
use Carbon\Carbon;
class RoutesApiController extends Controller
{
    use NotificationTrate;
    /**
     * @OA\Get(
     *    path="/routes",
     *    operationId="getRoutesDetails",
     *    tags={"Routes"},
     *    summary="Routes details",
     *    description="Routes details",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function getRoutesDetails(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $date = date('Y-m-d');


        $driver = Driver::with([
            'routes' => function ($query) use ($date) {
                $query->where('pickup_date', '<=', $date)
                    ->where(function ($subQuery) {
                        $subQuery->whereNull('verify_status')
                            ->orWhere('verify_status', '');
                    })
                    ->orderBy('pickup_date', 'desc');
            },
            // 'routes.vendor',
            'routes.route_stops',
            'routes.time_line',
        ])->where('tokens', $tokenWithoutBearer)->first();

        if ($driver) {
            if ($driver->routes->isEmpty()) {
                return $this->error('Routes not found');
            }
            $driver->routes->pluck('RoutesTo.name');

            $data = ['routes' => $driver->routes->toArray()];

            return $this->success('Route data retrieved successfully', $data);
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }
    /**
     * @OA\Post(
     *    path="/update-status",
     *    operationId="updateRoutesStatus",
     *    tags={"Routes"},
     *    summary="Update routes status",
     *    description="Update routes status",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="id", in="query", description="Routes Id", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *    @OA\Parameter(name="status", in="query", description="Routes Status", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function updateRoutesStatus(Request $request)
    {

        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $timeStamp = date('Y-m-d H:i:s');

        $date = date('Y-m-d');
        $currentDate = now()->toDateString();
        $currentTime = now()->toTimeString();

        $driver = Driver::with(['routes' => function ($query) use ($date) {
            $query->where('pickup_date', $date);
        }])->where('tokens', $tokenWithoutBearer)->first();
        // dd($driver->toArray());
        if ($driver) {

            //$trips = Trips::where('driver_id', $driver->id)->where('pickup_date', '<', $date)->where('status', 'Accept')->count();
            $trips = 0;

            if ($trips  < 1) {

                $routes = Trips::where('id', $request->id)->first();

                if ($routes) {

                    if ($request->status === 0) {

                        if ($routes->varify_status === "Accept") {

                            return $this->error('Routes have already been accepted by the driver.');
                        } else {
                            $routes->status = 'Accepted';
                            $routes->verify_status = 'Accept';
                            $routes->trip_start_date = $timeStamp;
                            if ($routes->save()) {
                                event(new TimeLineUpdated(
                                    $routes->id,
                                    $driver->id,
                                    'Accepted',
                                    'Route has been accepted.',
                                    $currentDate,
                                    $currentTime
                                ));

                                return $this->success('Routes have been accepted by the driver.');
                            }
                        }
                    }

                    if ($request->status === 1) {
                        $routes->status = 'Rejected';
                        $routes->verify_status = 'Reject';
                        if ($routes->save()) {
                            event(new TimeLineUpdated(
                                $routes->id,
                                $driver->id,
                                'Rejected',
                                'Route has been rejected.',
                                $currentDate,
                                $currentTime
                            ));
                            return $this->success('Routes have been rejected by the driver.');
                        }
                    }
                    if ($request->status === 2) {

                        if ($routes->verify_otp === 1) {
                            $routes->status = 'Completed';
                            $routes->verify_status = 'Completed';
                            $routes->trip_end_date = $timeStamp;
                            $routes->one_time_pin = null;
                            $routes->verify_otp = 0;
                            if ($routes->save()) {

                                return $this->success('Routes have been completed by the driver.');
                            }
                        } else {

                            return $this->error('OTP has expired');
                        }
                    }
                } else {

                    return $this->error('Routes not found');
                }
            } else {

                return $this->error('Please complete the previous trip before accepting the new one');
            }
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }
    /**
     * @OA\Post(
     *    path="/view-routes",
     *    operationId="getViewRoutes",
     *    tags={"Routes"},
     *    summary="Accepted routes details",
     *    description="Accepted routes details",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function getViewRoutes(Request $request)
    {
        // Extract Bearer token
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $date = date('Y-m-d');

        // Fetch driver and their routes with relationships
        $driver = Driver::with([
            'routes' => function ($query) use ($request) {
                $query->where('id', $request->trip_id);
            },
            'routes.RoutesTo',
            'routes.route_stops',
            'routes.time_line',
        ])->where('tokens', $tokenWithoutBearer)->first();

        // Check if driver exists
        if ($driver) {
            // Reverse routes and check if routes exist
            $driverRoutes = $driver->routes->toArray();

            if (empty($driverRoutes)) {
                return $this->error('No route data found for the given trip ID: ' . $request->trip_id);
            }

            // Prepare response data
            $data = ['routes' => array_reverse($driverRoutes)];

            return $this->success('Route data retrieved successfully', $data);
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }


    public function getCompletedTrip(Request $request)
    {
        // Extract Bearer token
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        // Fetch driver and their completed routes
        $driver = Driver::with([
            'routes' => function ($query) {
                $query->where('status', 'Completed');
            },
            'routes.RoutesTo',
            'routes.route_stops',
            'routes.time_line',
        ])->where('tokens', $tokenWithoutBearer)->first();

        // Check if the driver exists
        if ($driver) {
            $completedRoutes = $driver->routes->toArray();

            // Check if there are no completed routes
            if (empty($completedRoutes)) {
                return $this->error('No completed trips found');
            }

            // Reverse the routes (optional)
            $data = ['routes' => array_reverse($completedRoutes)];

            return $this->success('Completed trip data retrieved successfully', $data);
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }

    public function getRoutesInProgress(Request $request)
    {
        // Extract Bearer token
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        // Get today's date
        $date = date('Y-m-d');

        // Fetch driver with their routes that are in progress
        $driver = Driver::with([
            'routes' => function ($query) use ($date) {
                $query->where('pickup_date', '<=', $date)
                ->where('verify_status', 'Accept');
            },
            'routes.RoutesTo',
            'routes.route_stops',
            'routes.time_line',
        ])->where('tokens', $tokenWithoutBearer)->first();

        // Check if the driver exists
        if ($driver) {
            $inProgressRoutes = $driver->routes->toArray();

            // Check if no "in-progress" routes exist
            if (empty($inProgressRoutes)) {
                return $this->error('No in-progress routes found for today');
            }

            // Reverse the routes (optional) for the desired order
            $data = ['routes' => array_reverse($inProgressRoutes)];

            return $this->success('In-progress routes retrieved successfully', $data);
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }

    /**
     * @OA\Get(
     *    path="/history",
     *    operationId="getRoutesHistory",
     *    tags={"Routes"},
     *    summary="Routes history",
     *    description="Routes history",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function getRoutesHistory(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $driver = Driver::with('routes')->where('tokens', $tokenWithoutBearer)->first();

        $driver = Driver::with([
            'routes' => function ($query) {
                $query->where('status', 'Completed')
                      ->whereDate('created_at', '>=', Carbon::now()->subDays(90)) // Get last 90 days
                      ->orderBy('id', 'desc'); // Order by latest
                    //   ->take(20); // Limit to 20 records
            }
        ])->where('tokens', $tokenWithoutBearer)->first();

        if ($driver) {

            if ($driver->routes->isEmpty()) {
                return $this->error('Routes not found');
            }

            $driver->routes->pluck('RoutesTo.name');

            $data = ['routes' => $driver->routes->toArray()];

            return $this->success('Route data retrieved successfully', $data);
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }
    /**
     * @OA\Post(
     *    path="/route-status/check",
     *    operationId="checkRoutesStatus",
     *    tags={"Routes"},
     *    summary="Check routes status",
     *    description="Check routes status",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="id", in="query", description="Routes id", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function checkRoutesStatus(Request $request)
    {

        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $timeStamp = date('Y-m-d H:i:s');

        $routeId = $request->id;

        $driver = Driver::with(['routes' => function ($query) use ($routeId) {
            $query->where('id', $routeId)->where('status', 'Accepted');
        }])->where('tokens', $tokenWithoutBearer)->first();

        if ($driver) {
            $routes = Trips::where('id', $request->id)->first();
            if ($routes) {
                $token = substr(str_shuffle("0123456789"), 0, 4);
                $routes->one_time_pin = $token;
                $routes->verify_otp = 0;
                if ($routes->save()) {
                    $mailData = [
                        'title' => 'Mail From Shiva Transport',
                        'name' => $routes->ship_first_name . ' ' . $routes->ship_last_name,
                        'phone' => $routes->phone,
                        'otp' => $routes->one_time_pin,
                        'email' => $driver->email,
                    ];

                    Mail::to($driver->email)->send(new DriverOtpSendMail($mailData));

                    return $this->success('OTP has been sent successfully');
                }
            } else {

                return $this->error('Routes not found');
            }
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }

    /**
     * @OA\Post(
     *    path="/route-status/verify",
     *    operationId="checkRoutesVerify",
     *    tags={"Routes"},
     *    summary="Verify routes status",
     *    description="Verify routes status",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="id", in="query", description="Routes id", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *    @OA\Parameter(name="one_time_pin", in="query", description="OTP", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function checkRoutesVerify(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $timeStamp = date('Y-m-d H:i:s');

        $routeId = $request->id;

        $driver = Driver::with(['routes' => function ($query) use ($routeId) {
            $query->where('id', $routeId)->where('status', 'Accepted');
        }])->where('tokens', $tokenWithoutBearer)->first();

        if ($driver) {

            $routes = Trips::where('id', $request->id)->first();
            $currentDate = now()->toDateString();
            $currentTime = now()->toTimeString();
            if ($routes) {

                // if ($routes->one_time_pin !== $request->one_time_pin) {

                //     $routes->verify_otp = 0;

                //     $routes->save();

                //     return $this->error('Incorrect OTP');

                // } else {

                $routes->status = 'Completed';

                $routes->verify_status = 'Completed';

                $routes->trip_end_date = $timeStamp;
                $routes->completed_reason = $request->reason;
                $routes->completed_date = $request->date;

                $routes->one_time_pin = null;

                $routes->verify_otp = 0;

                if ($routes->save()) {
                    event(new TimeLineUpdated(
                        $routes->id,
                        $driver->id,
                        'Completed',
                        'Route has been completed.',
                        $currentDate,
                        $currentTime
                    ));
                    if (!empty($request->reason)) {
                        event(new TimeLineUpdated(
                            $routes->id,
                            $driver->id,
                            'Reason',
                            $request->reason,
                            $currentDate,
                            $currentTime
                        ));
                    }
                    return $this->success('Trip completed successfully');
                }

                // }

            } else {

                return $this->error('Routes not found');
            }
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }

    public function createFcmToken(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        $driver = Driver::with('routes')->where('tokens', $tokenWithoutBearer)->first();

        if ($driver) {

            $driver->fcm_token = $request->ftoken;

            if ($driver->save()) {

                return $this->success('Driver fcm token save successfully');
            }else {
                return $this->error('Failed to save fcm token');
            }
        } else {

            return $this->error('Unauthorized token', null, 401);
        }
    }

    public function getRoutesStops(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));

        // Get the routeId from the request
        $routeId = $request->tripId;

        // Check if routeId is provided
        if (empty($routeId)) {
            return $this->error('Trip ID is required', null, 400);
        }

        // Retrieve the driver based on the token and check if they have routes
        $driver = Driver::with(['routes' => function ($query) use ($routeId) {
            $query->with('route_stops')
                ->where('id', (int)$routeId)
                ->where('status', 'Accepted');
        }])->where('tokens', $tokenWithoutBearer)->first();

        // Check if driver exists
        if (!$driver) {
            return $this->error('Unauthorized token or driver not found', null, 401);
        }

        // Check if driver has routes
        if ($driver->routes->isEmpty()) {
            return $this->error('No routes found for the given trip ID or accept the trip first', null, 404);
        }

        // Ensure the route contains stops
        $stops = $driver->routes[0]['route_stops'];
        if (empty($stops) || count($stops) === 0) {
            return $this->error('No stops found for the route', null, 404);
        }

        // Get pickup and dispatch coordinates
        try {
            $pickUp = $this->getCoordinates($driver->routes[0]->pickup_add1);
            $dispatch = $this->getCoordinates($driver->routes[0]->ship_add1);

            // Ensure both coordinates are available
            if (empty($pickUp['results'][0]['geometry']['location']) || empty($dispatch['results'][0]['geometry']['location'])) {
                return $this->error('Could not retrieve pickup or dispatch coordinates', null, 500);
            }
        } catch (\Exception $e) {
            return $this->error('Error retrieving coordinates: ' . $e->getMessage(), null, 500);
        }

        // Prepare the response data
        $data = [
            'stops' => $stops->toArray(),
            'pickUpAddress' => $pickUp['results'][0]['geometry']['location'],
            'dispatchAddress' => $dispatch['results'][0]['geometry']['location']
        ];

        // Return the success response
        return $this->success('Route stops retrieved successfully', $data);
    }

    public function vehicleLiveTracking(Request $request)
    {

        $vehicleData = Vehical::pluck('track_device_id');

        if (count($vehicleData) > 0) {

            $status = false;

            for ($i = 0; $i < count($vehicleData); $i++) {

                $liveTrack = $this->getVehicleTracking($vehicleData[$i]);

                $response = json_decode($liveTrack, true);

                if ($response['status']) {

                    $conditions = ['device_id' => $response['devices'][0]['id']];

                    $address = $this->getaddress($response['devices'][0]['latitude'], $response['devices'][0]['longitude']);

                    $addressData = json_decode($address, true);


                    Locations::updateOrCreate($conditions, [
                        'device_id' => $response['devices'][0]['id'],
                        'name' => $response['devices'][0]['name'],
                        'speed' => $response['devices'][0]['speed'],
                        'ignition' => $response['devices'][0]['ignition'],
                        'odometer' => $response['devices'][0]['odometer'],
                        'device_time' => $response['devices'][0]['device_time'],
                        'server_time' => $response['devices'][0]['server_time'],
                        'latitude' => $response['devices'][0]['latitude'],
                        'longitude' => $response['devices'][0]['longitude'],
                        'address' => $addressData['display_name'],
                    ]);

                    $status = true;
                }
            }

            if ($status) {

                return response()->json(['status' => true, 'message' => 'Update location data successfully']);
            } else {

                return response()->json(['status' => true, 'message' => 'Faild to update']);
            }
        } else {

            return response()->json(['status' => true, 'message' => 'Vehicle not found']);
        }
    }

    public function upComingTrips(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));
        $date = date('Y-m-d');

        // Fetch driver with related routes
        $driver = Driver::with([
            'routes' => function ($query) use ($date) {
                $query->where('pickup_date', '>', $date) // Pickup date greater than today
                    ->where(function ($subQuery) {
                        $subQuery->whereNull('verify_status') // Verify status is null
                            ->orWhere('verify_status', ''); // Or empty
                    });
            },
            'routes.route_stops', // Include route stops
            'routes.time_line'    // Include time line
        ])->where('tokens', $tokenWithoutBearer)->first();

        // Check if driver exists
        if ($driver) {
            if ($driver->routes->isEmpty()) {
                return $this->error('Routes not found');
            }
            $driver->routes->pluck('RoutesTo.name');
            $data = ['routes' => $driver->routes->toArray()];

            return $this->success('Route data retrieved successfully', $data);
        } else {
            return $this->error('Unauthorized token', null, 401);
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

        // Extract latitude and longitude
        // $latitude = $data['results'][0]['geometry']['location']['lat'];
        // $longitude = $data['results'][0]['geometry']['location']['lng'];

        // return view('latitude', 'longitude'));
    }
}
