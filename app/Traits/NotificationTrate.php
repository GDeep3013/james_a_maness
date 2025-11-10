<?php

namespace App\Traits;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Http;
use Google_Client;
use Log;

trait NotificationTrate
{
    public function notification($driverIds, $title, $body, $status)
    {
        $accessToken = $this->getFirebaseAccessToken();
        if ($driverIds) {
            $endpoint = 'https://fcm.googleapis.com/v1/projects/shiva-app-d50c3/messages:send';

            // Define the notification payload
            $currentTime = now()->format('h:i A');
            $url = config("app.url");
            $payload = [
                'message' => [
                    // Basic notification properties
                    'notification' => [
                        'title' => $title,
                        'body' => $body, // Leave blank to render everything via custom UI
                    ],
                    // Data payload for advanced customization
                    'data' => [
                        'title' => $title,
                        'time' => $currentTime,
                        'body' => $body,
                        'image'=> $url."assets/img/logo_new.png"
                    ],
                    'token' => $driverIds[0], // Single token for the new endpoint
                ],
            ];
            // $payload = [
            //     'message' => [
            //         'notification' => [
            //             'body' => 'Shiva Transport',
            //             'title' => $title,
            //         ],
            //         // 'data' => [
            //         //     'status' => $status,
            //         // ],
            //         'token' => $driverIds[0], // Single token for the new endpoint
            //     ],
            // ];

            // Set the cURL options
            $ch = curl_init($endpoint);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Authorization: Bearer {$accessToken}",
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

            // Execute the cURL request
            $response = curl_exec($ch);

            if ($response === false) {
                $error = curl_error($ch);
                // Log::error("Curl Error: $error");
                curl_close($ch);
                return response()->json(['status' => false, 'message' => 'Notification failed']);
            }

            // Close cURL session
            curl_close($ch);

            // Log::info("FCM Response", ['data' => $response]);
            return $response;
        } else {
            return response()->json(['status' => false, 'message' => 'Invalid credential']);
        }
    }



    function getFirebaseAccessToken()
    {
        $client = new Google_Client();
        // $confit = config('firebase.credentials');
        $client->setAuthConfig(public_path('shiva-app-d50c3-firebase-adminsdk-ditvc-cdb35d017e.json')); // Path to the service account JSON
        $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
        $client->useApplicationDefaultCredentials();

        $token = $client->fetchAccessTokenWithAssertion();
        // Log::info("AccessToken", ['token' => $token['access_token']]);
        return $token['access_token'];
    }
    public function getVehicleTracking($driverIds)
    {
        // if ($driverIds) {
        //     $url = 'https://app.fleethunt.ca/api/fleet';
        //     $params = [
        //         'device_id' => $driverIds,
        //         'api_token' => env('FLEET_HUNT_API_KEY'),
        //     ];
        //     $url .= '?' . http_build_query($params);
        //     $ch = curl_init($url);
        //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
        //     curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification (use it only for testing)
        //     $response = curl_exec($ch);
        //     if ($response === false) { curl_error($ch); }
        //     curl_close($ch);
        //     return $response;
        // } else {
        //     return response()->json(['status' => false, 'message' => 'Invalid credential']);
        // }}

        if ($driverIds) {
            $url = 'https://app.fleethunt.ca/api/fleet';
            $params = [
                'device_id' => $driverIds,
                'api_token' => env('FLEET_HUNT_API_KEY'),
            ];

            $response = Http::withOptions(['verify' => false])->get($url, $params);
            return $response->body();
        } else {
            return response()->json(['status' => false, 'message' => 'Invalid credential']);
        }
    }

    public function getaddress($lat, $lon)
    {
        if (!empty($lat) && !empty($lon)) {
            $format = 'json';
            $url = "https://geocode.maps.co/reverse?lat={$lat}&lon={$lon}";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification (use it only for testing)
            $response = curl_exec($ch);
            if ($response === false) {
                curl_error($ch);
            }
            curl_close($ch);
            return $response;
        } else {
            return response()->json(['status' => false, 'message' => 'Invalid credential']);
        }
    }
}
