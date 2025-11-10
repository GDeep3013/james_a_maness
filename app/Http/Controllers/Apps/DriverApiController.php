<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Driver;
use App\Models\RouteStops;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;
use Http;
use App\Traits\NotificationTrate;

class DriverApiController extends Controller
{
    use NotificationTrate;
    /**
     * @OA\Get(
     *    path="/profile",
     *    operationId="getDriver",
     *    tags={"Driver"},
     *    summary="Driver profile",
     *    description="Driver profile",
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
    public function getDriver(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));
        $driver = Driver::where('tokens', $tokenWithoutBearer)->first();
        if (!empty($driver)) {
            $profile = isset($driver->profile) ? env("APP_URL") . "driver/profile/" . $driver->profile : "";
            $license_no_file = $driver->license_no_file ? env("APP_URL") . "driver/licence/" . $driver->license_no_file : "";
            $canada_doc_file = $driver->canada_doc_file ? env("APP_URL") . "driver/canada_status/" . $driver->canada_doc_file : "";
            $offer_letter_file = $driver->offer_letter_file ? env("APP_URL") . "driver/offer_letter/" . $driver->offer_letter_file : "";
            $other_doc = $driver->other_doc ? env("APP_URL") . "driver/others/" . $driver->other_doc : "";
            $driver->profile = url($profile);
            $driver->license_no_file = url($license_no_file);
            $driver->canada_doc_file = url($canada_doc_file);
            $driver->offer_letter_file = url($offer_letter_file);
            $driver->other_doc = url($other_doc);
            $data = ['driver' => $driver];
            return $this->success('Driver data retrieved successfully', $data);
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }
    /**
     * @OA\Post(
     *    path="/profile-update",
     *    operationId="updateDriver",
     *    tags={"Driver"},
     *    summary="Update driver profile",
     *    description="Update driver profile",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="profile", in="query", description="Driver profile image", required=true,
     *        @OA\Schema(type="file")
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
    public function updateDriver(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'profile' => ['required', 'image', 'mimes:jpeg,jpg,png']
            // 'profile' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:2048']

        ]);
        if ($validator->fails()) {
            return $this->error('The given data was invalid', $validator->errors());
        }
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));
        $driver = Driver::where('tokens', $tokenWithoutBearer)->first();
        if (!empty($driver)) {
            $directory = public_path('driver/profile/');
            if (File::isDirectory($directory)) {
                $filePath = $directory . '/' . $driver->profile;
                if (File::exists($filePath)) {
                    File::delete($filePath);
                }
            }
            if ($request->file('profile')) {
                $file = $request->file('profile');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $profileFile = time() . '.' . $request->profile->extension();
                    $request->profile->move(public_path('driver/profile'), $profileFile);
                    $filePath = public_path('driver/profile/' . $profileFile);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                    $driver->profile = $profileFile;
                    if ($driver->save()) {
                        return $this->success('Driver profile update successfully.');
                    }
                } else {
                    return $this->error('Invalid file. Supported formats include .jpg, .png, .jpeg with a maximum file size of 2MB');
                }
            }
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }
    /**
     * @OA\Post(
     *    path="/live-tracking",
     *    operationId="driverLiveTracking",
     *    tags={"Driver"},
     *    summary="Update driver location",
     *    description="Update driver location",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="latitude", in="query", description="Latitude", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Parameter(name="longitude", in="query", description="Longitude", required=true,
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
    public function driverLiveTracking(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));
        $driver = Driver::where('tokens', $tokenWithoutBearer)->first();
        $currentDate = date("Y-m-d");
        $currentDateTime = now();
        $updatedDateTime = Carbon::parse($currentDateTime)->addMinutes(20);

        $driver = Driver::with([
            'routes' => function ($query) use ($currentDate) {
                $query->where('pickup_date', $currentDate)->where('status', 'Accept');
            },
            'routes.route_stops'
        ])->where('tokens', $tokenWithoutBearer)->first();
        
        if (!empty($driver)) {
            if(count($driver->routes) > 0) {
                $driver->latitude = $request->latitude;
                $driver->longitude = $request->longitude;
                if ($driver->save()) {
                    $routeStops = RouteStops::where('trip_id', $driver->routes[0]['id'])->get();
                    if ($routeStops) {
                        foreach ($routeStops as $stops) {
                            if ($currentDateTime->greaterThan(Carbon::parse($stops->route_stops_stime)) && $currentDateTime->lessThan(Carbon::parse($stops->route_stops_etime))) {
                                $distance = $this->getDistanceMatrix($driver->latitude, $driver->longitude, $stops->latitude, $stops->longitude);
                                $driverId = Driver::where('id', $driver->id)->select('id', 'fcm_token')->first();
                                if ($distance) {
                                    $title = "ATTENTION";
                                    $body = "Your arrival is delayed by " . $distance['rows'][0]['elements']['0']['duration']['text'] . " and there is a remaining distance of " . $distance['rows'][0]['elements']['0']['distance']['text'] . " to reach your destination. Please make adjustments to expedite your journey.";
                                    $status = 0;
                                    $this->notification($driverId->fcm_token, $title, $body, $status);
                                }
                                // $title = "Your arrival is delayed by ".$distance['rows'][0]['elements']['0']['duration']['text']." and there is a remaining distance of ".$distance['rows'][0]['elements']['0']['distance']['text']. " to reach your destination. Please make adjustments to expedite your journey.";
                                // dd($title, $distance);
                            }
                            // else {
                            //     $desiredsTime = Carbon::parse($stops->route_stops_stime);
                            //     $desiredeTime = Carbon::parse($stops->route_stops_etime);
    
                            //     dd("welcome", $currentDateTime->format('H:i'), $desiredsTime, $desiredeTime);
                            // }
                        }
                    }
                    return $this->success('Driver location update successfully');
                }
            } else {
                return $this->error("Please confirm the trip first,and then provide the driver's live location.", null, 200);
            }
        } else {
            return $this->error('Unauthorized token', null, 401);
        }
    }
    public function getDistanceMatrix($originLatitude, $originLongitude, $destinationLatitude, $destinationLongitude)
    {
        // Replace with your Google Maps API key

        // $originLatitude = 40.7128;
        // $originLongitude = -74.0060;

        // $destinationLatitude = 34.0522;
        // $destinationLongitude = -118.2437;
        $googleMapApiKey = config('app.google_map_api_key');
        $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
            'origins' => $originLatitude . ',' . $originLongitude,
            'destinations' => $destinationLatitude . ',' . $destinationLongitude,
            'mode' => 'driving',
            'key' => $googleMapApiKey,
        ]);

        $data = $response->json();
        return $data;
        // Handle the response data as needed
        // $distance = $data['rows'][0]['elements'][0]['distance']['text'];
        // $duration = $data['rows'][0]['elements'][0]['duration']['text'];

        // return view('distance_matrix', compact('distance', 'duration'));
    }
    public function getCoordinates($locationName)
    {
        $googleMapApiKey = config('app.google_map_api_key');
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $locationName,
            'key' => $googleMapApiKey,
        ]);

        $data = $response->json();
        return $data;

        // Extract latitude and longitude
        // $latitude = $data['results'][0]['geometry']['location']['lat'];
        // $longitude = $data['results'][0]['geometry']['location']['lng'];

        // return view('geocoding', compact('latitude', 'longitude'));
    }
}
