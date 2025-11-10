<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MainRoute;
use App\Models\MainRouteStops;
use App\Models\RouteStops;
use App\Models\Trips;
use App\Models\Driver;
use App\Traits\NotificationTrate;
use App\Models\Routes;
use Log;
use Http;

class MainRouteStopsController extends Controller
{
    use NotificationTrate;
    public function index(Request $request) {}
    public function getMainRoutes($id)
    {

        $mainRoutesIds = explode(',', $id);
        $mainRoutes = Trips::whereIn('route_id', $mainRoutesIds) // Select necessary columns
            ->orderBy('route_id') // Ensure grouping works properly
            ->orderBy('created_at', 'desc') // Order by creation date descending
            ->get()
            ->groupBy('route_id') // Group by `route_id`
            ->map(fn($group) => $group->first()->id) // Get the latest `id` for each group
            ->values()
            ->toArray();
        $nonExistingRoutes = collect($mainRoutesIds)  // Start with the $mainRoutesIds array
            ->diff(Trips::pluck('route_id'))  // Find the difference between $mainRoutesIds and the existing route_ids in Trips
            ->values()  // Reindex the collection
            ->toArray();

        $getRoutes = Routes::whereIn('id', $nonExistingRoutes)->select('id', 'name')->get();

        return response()->json(['status' => true, 'mainRoute' => $mainRoutes, 'notExistTrip' => $getRoutes]);
    }
    public function assignRoutes(Request $request)
    {
        $keysToRemove = ['id', 'driver', 'vehicle', 'vendor', 'routes_to', 'auth_code', 'routes_to', 'route_stops'];
        $keysToUpdate = ['pickup_date', 'ship_date', 'status', 'created_at', 'updated_at'];
        $currentTimestamp = now();
        $routStops = [];
        $newValues = [$request->pickUpDate, $request->pickUpDate, 'Assigned', $currentTimestamp, $currentTimestamp];
        $formData = array_map(function ($data) use ($keysToUpdate, $newValues, &$routStops) {
            $mainRoutesId = $data['id'] ?? null;
            $mainRouteStops = [];
            if ($mainRoutesId) {
                $mainRouteStops = MainRouteStops::where('main_route_id', $mainRoutesId)->pluck('route_stops_id');
                $routStops[] = RouteStops::whereIn('id', $mainRouteStops)->get();
            }
            // dd($data['route_stops']);
            foreach ($keysToUpdate as $index => $key) {
                if (array_key_exists($key, $data)) {
                    $data[$key] = $newValues[$index];
                    // $routStops[$key] = RouteStops::whereIn('id', $mainRouteStops)->get();
                }
            }
            return $data;
        }, $request->formData);

        // foreach ($formData as $data) {
        //     $routStops[] = $data['route_stops'];
        // }
        $formData = array_map(function ($data) use ($keysToRemove) {
            return array_diff_key($data, array_flip($keysToRemove));
        }, $formData);

        $count = count($formData);
        $pickUpData = $request->pickUpDate;
        $route_status = 3;
        $tripId = [];
        foreach ($formData as $data) {
            $tripsCount = Trips::where('driver_id', $data['driver_id'])
                ->where('route_id', $data['route_id'])
                ->where('pickup_date', $data['pickup_date'])
                ->count();

            if ($tripsCount >= 1) {
                $route_status = 2;
                continue; // Skip to next iteration if trip already exists
            }
            $location = $this->getCoordinates($data['ship_add1']);
            $addressComponents = $location['results'][0]['address_components'];
            $data["ship_city"] = $addressComponents[2]['long_name'] ?? null;
            $data["ship_state"] = $addressComponents[3]['long_name'] ?? null;
            $data["ship_country"] = $addressComponents[4]['long_name'] ?? null;
            $data["ship_zip"] = $addressComponents[5]['long_name'] ?? null;
            $data["ship_lat"] = $location['results'][0]['geometry']['location']['lat'] ?? null;
            $data["ship_long"] = $location['results'][0]['geometry']['location']['lng'] ?? null;

            $routes = Trips::create($data);

            if (!$routes) {
                continue; // Skip to next iteration if creation fails
            }
            $tripId = $routes->id;
            foreach ($routStops  as $index => $innerArray) {
                $innerArray = $innerArray->toArray();
                if (empty($innerArray)) {
                    break; // Break the loop if $innerArray is empty
                }
                $clonedData = array_map(function ($item) use ($tripId, $pickUpData) {
                    unset($item['id']); // Remove existing ID
                    $location = $this->getCoordinates($item['route_stops_desc']);
                    $item['trip_id'] = $tripId;
                    $item['route_stops_date'] = $pickUpData;
                    $item['latitude'] =  $location['results'][0]['geometry']['location']['lat'];
                    $item['longitude'] = $location['results'][0]['geometry']['location']['lng'];
                    $newRouteStop = new RouteStops($item); // Set the same trip_id
                    $newRouteStop->save();
                    return $item;
                }, $innerArray);
                if ($index === 0) {
                    break;
                }
            }
            $driverID = Driver::where('id', $routes->driver_id)->first();
            if ($driverID) {
                $title = "ATTENTION : New Trip";
                $body = "You have a new trip assigned.";

                $status = 0;
                $this->notification($driverID, $title, $body, $status);
            }
            $route_status = 1;
        }
        if ($route_status === 1) {
            return response()->json(['status' => 1, 'message' => 'Routes renew seuccessfully']);
        } else if ($route_status === 2) {
            return response()->json(['status' => 2, 'message' => 'Routes already exist']);
        } else if ($route_status === 3) {
            return response()->json(['status' => 3, 'message' => 'Failed to renew routes']);
        }
    }
    
    public function getCoordinates($locationName)
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $locationName,
            'key' => env('GOOGLE_MAP_API_KEY'),
        ]);
        // GOOGLE_MAP_API_KEY = "AIzaSyD72l8xa5b6eKw1dqNq_SR1nuD0yUS4L8o"
        $data = $response->json();
        return $data;
    }
}
