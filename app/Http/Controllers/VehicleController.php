<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Vehical;
use App\Models\Locations;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use App\Traits\NotificationTrate;
use Auth;
use Illuminate\Support\Facades\Schema;

class VehicleController extends Controller
{
    use NotificationTrate;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('vehicals');
        $query = Vehical::orderBy('id', 'desc');
        $searchTerm = $request->search;


        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });

        if (!empty($request->page) && $request->page !== "page") {
            $vehicle = $query->paginate(20);
            if (!empty($vehicle)) {
                return response()->json(['status' => true, 'vehical' => $vehicle]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle not found']);
            }
        } else if ($request->page === "page") {
            $vehicle = $query->paginate(20);
            if (!empty($vehicle)) {
                return response()->json(['status' => true, 'vehical' => $vehicle]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle not found']);
            }
        } else {

            $vehicle = Vehical::get();
            if (!empty($vehicle)) {
                return response()->json(['status' => true, 'vehical' => $vehicle]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle not found']);
            }
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
        ini_set('max_execution_time', 0);
        try {
            $validatedData = $request->validate([
                'vehicle_name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'vin_sn' => 'nullable|string|max:255',
                'license_plate' => 'nullable|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:255',
                'make' => 'nullable|string|max:255',
                'model' => 'nullable|string|max:255',
                'trim' => 'nullable|string|max:255',
                'registration_state_province' => 'nullable|string|max:255',
                'labels' => 'nullable|string|max:255',
                'photo' => 'nullable|mimes:jpeg,jpg,png,webp|max:5120',
            ]);

            $photo = "";
            if ($request->file('photo')) {
                $file = $request->file('photo');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $photo = time() . '.' . $request->photo->extension();
                    $request->photo->move(public_path('vehicles/photo'), $photo);
                    $filePath = public_path('vehicles/photo/' . $photo);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'errors' => ['photo' => ['Invalid file. Supported formats include .jpg, .png, .jpeg, .webp, with a maximum file size of 5MB.']]], 422);
                }
            }

            $vehicle = new Vehical;
            $vehicle->vehicle_name = $validatedData['vehicle_name'];
            $vehicle->type = $validatedData['type'];
            $vehicle->vin_sn = $request->vin_sn ?? null;
            $vehicle->license_plate = $request->license_plate ?? null;
            $vehicle->fuel_type = $request->fuel_type ?? null;
            $vehicle->year = $request->year ?? null;
            $vehicle->make = $request->make ?? null;
            $vehicle->model = $request->model ?? null;
            $vehicle->trim = $request->trim ?? null;
            $vehicle->registration_state = $request->registration_state_province ?? null;
            $vehicle->labels = $request->labels ?? null;
            $vehicle->photo = $photo;

            if ($vehicle->save()) {
                return response()->json(['status' => true, 'message' => 'Vehicle saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save vehicle'], 500);
            }
            // if (!empty($request->track_device_id) && $response != null) {

            //     if (isset($response['devices'])) {
            //         $conditions = ['device_id' => $response['devices'][0]['id']];
            //         $address = $this->getaddress($response['devices'][0]['latitude'], $response['devices'][0]['longitude']);
            //         $addressData = json_decode($address, true);
            //         Locations::updateOrCreate($conditions, [
            //             'device_id' => $response['devices'][0]['id'],
            //             'name' => $response['devices'][0]['name'],
            //             'angle' => $response['devices'][0]['angle'],
            //             'speed' => $response['devices'][0]['speed'],
            //             'ignition' => $response['devices'][0]['ignition'],
            //             'odometer' => $response['devices'][0]['odometer'],
            //             'device_time' => $response['devices'][0]['device_time'],
            //             'server_time' => $response['devices'][0]['server_time'],
            //             'latitude' => $response['devices'][0]['latitude'],
            //             'longitude' => $response['devices'][0]['longitude'],
            //             'address' => $addressData['display_name'],
            //         ]);
            //         if ($vehicle->save()) {
            //             return response()->json(['status' => 'success', 'message' => 'Vehicle saved successfully']);
            //         } else {
            //             return response()->json(['status' => false, 'message' => 'Failed to save vehical'], 401);
            //         }
            //     } else {
            //         return response()->json(['status' => 'api-error', 'message' => 'Vehicle tracking id is not valid'], 401);
            //     }
            // }else{
            //      return response()->json(['status' => 'api-error', 'message' => 'Vehicle tracking id is not valid'], 401);
            // }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'An error occurred while creating the vehicle. Please try again.'], 500);
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
        if ($id) {
            $data = Vehical::where('id', $id)->first();
            return response()->json(['status' => true, 'vehicle' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Vehicle not found']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (!empty($id)) {
            $data = Vehical::where('id', $id)->first();
            if ($data) {
                $vehicleData = [
                    'vehicle_name' => $data->vehicle_name,
                    'type' => $data->type,
                    'vin_sn' => $data->vin_sn,
                    'license_plate' => $data->license_plate,
                    'fuel_type' => $data->fuel_type,
                    'year' => $data->year,
                    'make' => $data->make,
                    'model' => $data->model,
                    'trim' => $data->trim,
                    'registration_state_province' => $data->registration_state,
                    'labels' => $data->labels,
                    'photo' => $data->photo ? asset('vehicles/photo/' . $data->photo) : null,
                ];
                return response()->json(['status' => true, 'message' => 'Vehicle data', 'data' => $vehicleData]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle not found'], 404);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Vehicle ID is required'], 400);
        }
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
        ini_set('max_execution_time', 0);
        
        if (empty($id)) {
            return response()->json(['status' => false, 'message' => 'Vehicle ID is required'], 400);
        }

        $vehicle = Vehical::find($id);
        if (!$vehicle) {
            return response()->json(['status' => false, 'message' => 'Vehicle not found'], 404);
        }

        try {
            $validatedData = $request->validate([
                'vehicle_name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'vin_sn' => 'nullable|string|max:255',
                'license_plate' => 'nullable|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:255',
                'make' => 'nullable|string|max:255',
                'model' => 'nullable|string|max:255',
                'trim' => 'nullable|string|max:255',
                'registration_state_province' => 'nullable|string|max:255',
                'labels' => 'nullable|string|max:255',
                'photo' => 'nullable|mimes:jpeg,jpg,png,webp|max:5120',
            ]);

            $photo = $vehicle->photo;

            if ($request->file('photo')) {
                $file = $request->file('photo');
                if ($file->isValid()) {
                    if ($photo && File::exists(public_path('vehicles/photo/' . $photo))) {
                        File::delete(public_path('vehicles/photo/' . $photo));
                    }
                    $photo = time() . '.' . $request->photo->extension();
                    $request->photo->move(public_path('vehicles/photo'), $photo);
                    $filePath = public_path('vehicles/photo/' . $photo);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'errors' => ['photo' => ['Invalid file. Supported formats include .jpg, .png, .jpeg, .webp, with a maximum file size of 5MB.']]], 422);
                }
            }

            $vehicle->vehicle_name = $validatedData['vehicle_name'];
            $vehicle->type = $validatedData['type'];
            $vehicle->vin_sn = $request->vin_sn ?? null;
            $vehicle->license_plate = $request->license_plate ?? null;
            $vehicle->fuel_type = $request->fuel_type ?? null;
            $vehicle->year = $request->year ?? null;
            $vehicle->make = $request->make ?? null;
            $vehicle->model = $request->model ?? null;
            $vehicle->trim = $request->trim ?? null;
            $vehicle->registration_state = $request->registration_state_province ?? null;
            $vehicle->labels = $request->labels ?? null;
            $vehicle->photo = $photo;

            if ($vehicle->save()) {
                return response()->json(['status' => true, 'message' => 'Vehicle updated successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update vehicle'], 500);
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'An error occurred while updating the vehicle. Please try again.'], 500);
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
        if ($id) {
            $Vehical = Vehical::find($id);
            if ($Vehical->delete()) {
                return response()->json(['status' => true, 'message' => 'Vehical Delete Successfully',]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehical not found']);
            }
        }
    }
}
