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
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\VehicleImport;

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
        $query = Vehical::with(['driver:id,first_name,last_name', 'vendor:id,name'])->orderBy('id', 'desc');
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

            $vehicle = Vehical::with(['driver:id,first_name,last_name', 'vendor:id,name'])->get();
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
                'make' => 'nullable|string|max:255',
                'model' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:255',
                'vin' => 'nullable|string|max:255',
                'license_plate' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'transmission' => 'nullable|string|max:255',
                'purchase_date' => 'nullable|date',
                'engine_size' => 'nullable|string|max:255',
                'current_mileage' => 'nullable|string|max:255',
                'purchase_price' => 'nullable|string|max:255',
                'initial_status' => 'nullable|in:available,assigned,maintenance,active,inactive',
                'vendor_id' => 'nullable|integer|exists:vendors,id',
                'primary_location' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'assigned_driver' => 'nullable|integer',
                'department' => 'nullable|string|max:255',
            ]);

            $vehicle = new Vehical;
            $vehicle->vehicle_name = $validatedData['vehicle_name'];
            $vehicle->type = $validatedData['type'];
            $vehicle->make = $request->make ?? null;
            $vehicle->model = $request->model ?? null;
            $vehicle->year = $request->year ?? null;
            $vehicle->vin = $request->vin ?? null;
            $vehicle->license_plate = $request->license_plate ?? null;
            $vehicle->color = $request->color ?? null;
            $vehicle->fuel_type = $request->fuel_type ?? null;
            $vehicle->transmission = $request->transmission ?? null;
            $vehicle->purchase_date = $request->purchase_date ?? null;
            $vehicle->engine_size = $request->engine_size ?? null;
            $vehicle->current_mileage = $request->current_mileage ?? null;
            $vehicle->purchase_price = $request->purchase_price ?? null;
            $vehicle->initial_status = $request->initial_status ?? 'available';
            $vehicle->vendor_id = $request->vendor_id ?? null;
            $vehicle->primary_location = $request->primary_location ?? null;
            $vehicle->notes = $request->notes ?? null;
            $vehicle->assigned_driver = $request->assigned_driver ?? null;
            $vehicle->department = $request->department ?? null;

            if ($vehicle->save()) {
                return response()->json(['status' => true, 'message' => 'Vehicle saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save vehicle'], 500);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false, 
                'message' => 'An error occurred while creating the vehicle. Please try again.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                // 'file' => $e->getFile(),
                // 'trace' => $e->getTraceAsString(),
                // 'previous' => $e->getPrevious(),
                // 'code' => $e->getCode(),
                // 'severity' => $e->getSeverity(),
                // 'sql' => $e->getSql(),
                // 'bindings' => $e->getBindings(),
            ], 500);
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
            $data = Vehical::with(['contact:id,first_name,last_name', 'vendor:id,name'])->where('id', $id)->first();
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
                'make' => 'nullable|string|max:255',
                'model' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:255',
                'vin' => 'nullable|string|max:255',
                'license_plate' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'transmission' => 'nullable|string|max:255',
                'purchase_date' => 'nullable|date',
                'engine_size' => 'nullable|string|max:255',
                'current_mileage' => 'nullable|string|max:255',
                'purchase_price' => 'nullable|string|max:255',
                'initial_status' => 'nullable|in:available,assigned,maintenance,active,inactive',
                'vendor_id' => 'nullable|integer|exists:vendors,id',
                'primary_location' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'assigned_driver' => 'nullable|integer',
                'department' => 'nullable|string|max:255',
            ]);

            $vehicle->vehicle_name = $validatedData['vehicle_name'];
            $vehicle->type = $validatedData['type'];
            $vehicle->make = $request->make ?? null;
            $vehicle->model = $request->model ?? null;
            $vehicle->year = $request->year ?? null;
            $vehicle->vin = $request->vin ?? null;
            $vehicle->license_plate = $request->license_plate ?? null;
            $vehicle->color = $request->color ?? null;
            $vehicle->fuel_type = $request->fuel_type ?? null;
            $vehicle->transmission = $request->transmission ?? null;
            $vehicle->purchase_date = $request->purchase_date ?? null;
            $vehicle->engine_size = $request->engine_size ?? null;
            $vehicle->current_mileage = $request->current_mileage ?? null;
            $vehicle->purchase_price = $request->purchase_price ?? null;
            $vehicle->initial_status = $request->initial_status ?? $vehicle->initial_status;
            $vehicle->vendor_id = $request->vendor_id ?? $vehicle->vendor_id;
            $vehicle->primary_location = $request->primary_location ?? null;
            $vehicle->notes = $request->notes ?? null;
            $vehicle->assigned_driver = $request->assigned_driver ?? null;
            $vehicle->department = $request->department ?? null;

            if ($vehicle->save()) {
                return response()->json(['status' => true, 'message' => 'Vehicle updated successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update vehicle'], 500);
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false, 
                'message' => 'An error occurred while updating the vehicle. Please try again.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }


    /**
     * Import vehicles from Excel file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function import(Request $request)
    {
        ini_set('max_execution_time', 0);
        
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls,csv|max:10240',
            ]);

            $file = $request->file('file');
            
            $import = new VehicleImport;
            Excel::import($import, $file);

            return response()->json([
                'status' => true,
                'message' => 'Vehicles imported successfully',
                'imported' => $import->getImportedCount(),
                'skipped' => $import->getSkippedCount(),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while importing vehicles. Please check the file format and try again.',
                'error' => $e->getMessage(),
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
        if ($id) {
            $Vehical = Vehical::find($id);
            if ($Vehical->delete()) {
                return response()->json(['status' => true, 'message' => 'Vehical Delete Successfully',]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehical not found']);
            }
        }
    }

    public function getStatistics()
    {
        
        $totalVehicles = Vehical::count();
        $activeCount = Vehical::where('initial_status', '=', 'active')->count();
        $inMaintenanceCount = Vehical::where('initial_status', '=', 'maintenance')->count();
        $availableCount = Vehical::where('initial_status', '=', 'available')->count();

        return response()->json(['status' => true, 'data' => [
            'total' => $totalVehicles,
            'active' => $activeCount,
            'in_maintenance' => $inMaintenanceCount,
            'available' => $availableCount,
        ]]);
       
    }
}
