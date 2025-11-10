<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Locations;
use App\Traits\LocationTraits;

class LocationController extends Controller
{
    use LocationTraits;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $searchTerm = $request->search;
        $vehicleData = $this->getVehicleWithAPI();
        if (isset($searchTerm) && !empty($searchTerm)  && isset($vehicleData['data'])) {
            $vehicles = $vehicleData['data'];
            $vehicles = array_filter($vehicles, function ($vehicle) use ($searchTerm) {
                return (isset($vehicle['make']) && strpos(strtolower($vehicle['make']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['model']) && strpos(strtolower($vehicle['model']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['licensePlate']) && strpos(strtolower($vehicle['licensePlate']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['vin']) && strpos(strtolower($vehicle['vin']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['serial']) && strpos(strtolower($vehicle['serial']), strtolower($searchTerm)) !== false)||
                    (isset($vehicle['cameraSerial']) && strpos(strtolower($vehicle['cameraSerial']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['name']) && strpos(strtolower($vehicle['name']), strtolower($searchTerm)) !== false) ||
                    (isset($vehicle['esn']) && strpos(strtolower($vehicle['esn']), strtolower($searchTerm)) !== false);
            });
            $vehicles = array_values($vehicles);
            if (!empty($vehicles)) {
                $vehicleIds = array_column($vehicles, 'id');
                if (!empty($vehicleIds)) {
                    $filteredLocation = $this->getLocation(implode(',', $vehicleIds));
                    return response()->json([
                        'status' => true,
                        'location' => $filteredLocation['data'] ?? [],
                        'vehicle' => $vehicles
                    ]);
                }
            }
            return response()->json([
                'status' => true,
                'location' => [],
                'vehicle' => []
            ]);
        } else {
            $location = $this->getLocation();
            return response()->json([
                'status' => true,
                'location' => $location['data'] ?? [],
                'vehicle' => $vehicleData['data'] ?? []
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
