<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Routes;
use App\Models\Trips;
use App\Models\MainRoute;
use App\Models\Driver;
use App\Models\MainRouteStop;
use App\Models\RouteStops;
use Auth;
use Illuminate\Support\Facades\Schema;
use App\Http\Requests\StoreMainRouteRequest;
use App\Traits\MainRouteStopsTraits;
use App\Traits\TripDataTransformer;
use App\Events\TimeLineUpdated;
use Log;
use App\Traits\NotificationTrate;

class MainRouteController extends Controller
{

    use MainRouteStopsTraits, TripDataTransformer, NotificationTrate;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $tableColumns = Schema::getColumnListing('routes');

        $query = Routes::with('additional_routes')->select('*');

        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            //foreach ($tableColumns as $column) {
            //    if ($column === 'created_at') {
            //        $query->orWhereDate($column, $searchTerm);
            //    } else {
            $query->orWhere('name', 'LIKE', '%' . $searchTerm . '%');
            $query->orWhere('code', 'LIKE', '%' . $searchTerm . '%');
            //    }
            //}
        });
        $query->whereNull('route_ref_id')->orderBy('name', 'asc');
        $mainRoute = $query->paginate(50);

        if (!empty($mainRoute)) {
            return response()->json(['status' => true, 'route' => $mainRoute]);
        } else {
            return response()->json(['status' => false, 'message' => 'Main routes not found']);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                "routeName" => "required|unique:routes,name",
                "routeCode" => "required|unique:routes,code",
                "route_type" => "required|in:complete_line_route,additional_route",
                "route_ref_id" => "required_if:route_type,additional_route|nullable"
            ]);
        
            $routesName = new Routes();
            $routesName->user_id = Auth::id();
            $routesName->name = $validatedData['routeName'];
            $routesName->code = $validatedData['routeCode'];
            $routesName->route_type = $validatedData['route_type'] ?? 'complete_line_route';
            $routesName->route_ref_id = $validatedData['route_ref_id'] ?? NULL;

            if ($routesName->save()) {

                if($validatedData['route_type'] == 'additional_route' &&  !empty($validatedData['route_ref_id'])){
                   $this->cloneDataToAdditionalRoute($validatedData['route_ref_id'],$routesName->id); 
                }

                return response()->json(['status' => true, 'message' => 'Main Route save successfully' ]);

            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save main route']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
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
            $data = Routes::with([
                'mainRoute' => function ($query) {
                    $query->select('*'); // Select specific columns from mainRoute
                },
                'mainRouteStops' => function ($query) {
                    $query->select('*')
                        ->orderBy('route_stops_date')
                        ->orderBy('route_stops_stime'); // Sort by date and then time // Select * columns from MainRouteStop
                },
                'mainRoute.driver' => function ($query) {
                    $query->select('id', 'phone', 'address', 'license_no', 'license_class'); // Select specific columns from driver
                },
                'mainRoute.vehicle' => function ($query) {
                    $query->select('id', 'model', 'truck_type', 'year', 'truck'); // Select specific columns from vehicle
                },
                'mainRoute.vendor' => function ($query) {
                    $query->select('id', 'email', 'company_contact', 'address'); // Select specific columns from vendor
                }
            ])
                ->select('id', 'name', 'code') // Select specific columns from Routes
                ->where('id', $id)
                ->first();
            return response()->json([
                'status' => true,
                'data' => $data
            ]);
        } else {
            return response()->json(['status' => false, 'message' => 'Main route not found']);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreMainRouteRequest $request, $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validated();
            // Check if the route exists
            $routesName = Routes::where("id", $id)->first();

            if ($routesName) {
                // Update the route information
                $routesName->user_id = Auth::user()->id;
                $routesName->name = $request->route_name;
                $routesName->code = $request->route_code;
                $routesName->save();


                $input = $request->all();
                $input['route_id'] = $id;

                // Create main route with stops
                $this->createMainRoutsWithStops($input);

                // try {
                //     Log::debug('main_route_stops', ['data' => $input['main_route_stops']]);
                // } catch (\Exception $logException) {
                //     // Handle logging-specific errors if necessary
                //     Log::error('Failed to log main route stops', [
                //         'error' => $logException->getMessage(),
                //         'file' => $logException->getFile(),
                //         'line' => $logException->getLine(),
                //     ]);
                // }

                $this->saveMainStops($input['main_route_stops'], $id);

                // Return success response
                return response()->json([
                    'status' => true,
                    'message' => 'Main Route updated successfully.',
                ], 200);
            } else {
                // Return failure response if the route is not found
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update main route. Route not found.',
                ], 404);
            }
        } catch (\Exception $e) {
            // Catch other general errors and return them as a JSON response
            return response()->json([
                'status' => false,
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
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
        if (!empty($id)) {

            $mainRouteStop = MainRouteStop::find($id);

            if ($mainRouteStop) {

                if ($mainRouteStop->delete()) {
                    return response()->json(['status' => true, 'message' => 'Route Stop deleted successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to delete Route Stop']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Route Stop not found']);
            }
        }
    }


    public function assignRoutes(Request $request)
    {
       
        try {
            $newDate = $request->pickUpDate;
            $ids = $request->ids;

            if (empty($newDate) || empty($ids)) {
                return response()->json(['status' => false, 'message' => 'Invalid data provided.'], 400);
            }

            $mainRoutes = Routes::with([
                'mainRoute' => function ($query) {
                    $query->select('*');
                },
                'mainRouteStops' => function ($query) {
                    $query->select('*')
                    ->orderBy('route_stops_date')
                        ->orderBy('route_stops_stime');
                }
            ])
            ->select('id', 'name', 'code')
            ->whereIn('id', $ids)
            ->get()->toArray();

            // dd($mainRoutes);

            if ($mainRoutes) {
                $successCount = 0;
                $existingTrips = [];
                $newTripsAssign = [];

                foreach ($mainRoutes as $route) {

                    // $tripCount = Trips::where('pickup_date', $newDate)
                    //     ->where('route_id', $route['id'])
                    //     ->count();

                    // if ($tripCount >= 1) {
                    //     $routeCode = isset($route['name']) ? $route['name'] : null;
                    //     $existingTrips[] = $routeCode;
                    //     continue;
                    // }

                    // Prepare trip data
                    $tripData = $this->prepareTripData($route);
                    $tripData['trip_date'] = $newDate;
                    $tripData['pickup_date'] = $newDate;
                    $tripData['ship_date'] = $newDate;
                    $tripData['auth_code'] = null;
                    $tripData['trip_start_date'] = null;
                    $tripData['trip_end_date'] = null;
                    $tripId = Trips::insertGetId($tripData);
                    $newTripsAssign[] = isset($route['name']) ? $route['name'] : null;
                    if ($tripId) {

                        // Prepare route stops data and insert
                        $stopsData = $this->prepareTripStopsData($route['main_route_stops'], $tripId, $newDate);

                        if (!empty($stopsData)) {
                            RouteStops::insert($stopsData);
                        }

                        // Log the event in the timeline
                        $currentDate = now()->toDateString();
                        $currentTime = now()->toTimeString();
                        event(new TimeLineUpdated(
                            $tripId,
                            Auth::id(),
                            'Assigned',
                            'Route has been assigned.',
                            $currentDate,
                            $currentTime
                        ));

                        // Notify the driver
                        $driverToken = Driver::where('id', $tripData['driver_id'])->value('fcm_token');
                        if ($driverToken) {
                            $this->notification([$driverToken], "ATTENTION : New Trip", "You have a new trip assigned.", 0);
                        }

                        $successCount++;
                    }
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
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found.']);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Error reassigning routes: ' . $e->getMessage()], 500);
        }

    }


    private function cloneDataToAdditionalRoute($route_id, $additional_id)
    {
        // Fetch the main route
        $main_route = MainRoute::where('route_id', $route_id)->first();

        // Fetch the related route stops
        $main_route_stops = MainRouteStop::where('route_id', $route_id)->get();

        if ($main_route) {
            // Clone main route
            $new_main_route = $main_route->replicate(); // Clone all attributes except the primary key
            $new_main_route->route_id = $additional_id;
            $new_main_route->pickup_date = now()->format('Y-m-d'); // Set current date for pickup_date
            $new_main_route->ship_date = now()->format('Y-m-d'); // Set current date for ship_date
            $new_main_route->created_at = now();
            $new_main_route->updated_at = now();
            $new_main_route->save(); // Save the cloned main route

            // Clone route stops
            foreach ($main_route_stops as $stop) {
                $new_stop = $stop->replicate(); // Clone all attributes except the primary key
                $new_stop->route_id = $additional_id; // Assign the new route_id
                $new_stop->route_stops_date = now()->format('Y-m-d'); // Set current date for route_stops_date
                $new_stop->created_at = now();
                $new_stop->updated_at = now();
                $new_stop->save(); // Save the cloned route stop
            }
        }
    }

}
