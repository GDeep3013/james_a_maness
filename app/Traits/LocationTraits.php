<?php

namespace App\Traits;


trait LocationTraits
{
    private function getLocation($vehicleIds = null)
    {
        $token = config('app.samsara_api_token');
        $URL = config('app.samsara_api_url');
        $curl = curl_init();
        $API_URL = $URL . 'fleet/vehicles/locations/feed';
        if(!empty($vehicleIds)) {
            $API_URL = $URL . 'fleet/vehicles/locations/feed?vehicleIds='.$vehicleIds;
        }
        curl_setopt_array($curl, array(
            CURLOPT_URL => $API_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization: Bearer ' . $token
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return json_decode($response, true);
    }

    private function getVehicleWithAPI()
    {
        $token = config('app.samsara_api_token');
        $URL = config('app.samsara_api_url');
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $URL . 'fleet/vehicles?limit=512',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization: Bearer ' . $token
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return json_decode($response, true);
    }
}
