<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Vehical;
use App\Models\Locations;
use Illuminate\Support\Facades\Validator;
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
            $vehicle = $query->paginate(10);
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
                'truck' => 'required',
                'number_plate' => 'required|unique:vehicals',
                'track_device_id' => 'nullable|unique:vehicals',
                'vehicle_reg_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'tax_doc_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'vehicle_ins_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'vehicle_mnl_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'other_doc' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
            ]);

            $vehicalRegistery = "";
            if ($request->file('vehicle_reg_file')) {
                $file = $request->file('vehicle_reg_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalRegistery = time() . '.' . $request->vehicle_reg_file->extension();
                    $request->vehicle_reg_file->move(public_path('vehical/registration'), $vehicalRegistery);
                    $filePath = public_path('vehical/registration/' . $vehicalRegistery);
                    chmod($filePath, 0755);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['RC_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $taxDocuments = "";
            if ($request->file('tax_doc_file')) {
                $file = $request->file('tax_doc_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $taxDocuments = time() . '.' . $request->tax_doc_file->extension();
                    $request->tax_doc_file->move(public_path('vehical/tax'), $taxDocuments);
                    $filePath = public_path('vehical/tax/' . $taxDocuments);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['tax_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $vehicalInsurance = "";
            if ($request->file('vehicle_ins_file')) {
                $file = $request->file('vehicle_ins_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalInsurance = time() . '.' . $request->vehicle_ins_file->extension();
                    $request->vehicle_ins_file->move(public_path('vehical/insurance'), $vehicalInsurance);
                    $filePath = public_path('vehical/insurance/' . $vehicalInsurance);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['insurance_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $vehicalManual = "";
            if ($request->file('vehicle_mnl_file')) {
                $file = $request->file('vehicle_mnl_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalManual = time() . '.' . $request->vehicle_mnl_file->extension();
                    $request->vehicle_mnl_file->move(public_path('vehical/manual'), $vehicalManual);
                    $filePath = public_path('vehical/manual/' . $vehicalManual);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['manual_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $otherDocuments = "";
            if ($request->file('other_doc')) {
                $file = $request->file('other_doc');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $otherDocuments = time() . '.' . $request->other_doc->extension();
                    $request->other_doc->move(public_path('vehical/others'), $otherDocuments);
                    $filePath = public_path('vehical/others/' . $otherDocuments);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['other_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $vehicle = new Vehical;
            $vehicle->user_id = Auth::user()->id;
            $vehicle->truck = $validatedData['truck'];
            $vehicle->number_plate = $validatedData['number_plate'];
            $vehicle->truck_type = $request->truck_type;
            $vehicle->vin_no = $request->vin_no;
            $vehicle->make = $request->make;
            $vehicle->model = $request->model;
            $vehicle->year = $request->year;
            $vehicle->fuel_type = $request->fuel_type;
            $vehicle->reg_country = $request->reg_country;
            $vehicle->reg_state = $request->reg_state;
            $vehicle->odometer = $request->odometer;
            $vehicle->unit = $request->unit;
            $vehicle->track_device_id = $request->track_device_id;
            $vehicle->fuel_card = $request->fuel_card;
            $vehicle->purchase_value = $request->purchase_value;
            $vehicle->purchase_date = $request->purchase_date;
            $vehicle->vehicle_reg_file = $vehicalRegistery;
            $vehicle->tax_doc_file = $taxDocuments;
            $vehicle->vehicle_ins_file = $vehicalInsurance;
            $vehicle->vehicle_mnl_file = $vehicalManual;
            $vehicle->other_doc = $otherDocuments;
            $vehicle->vehicle_status = $request->vehicle_status;
            $vehicle->comment = $request->comment;
            // $liveTrack = $this->getVehicleTracking($request->track_device_id);
            // $response = json_decode($liveTrack, true);
            if ($vehicle->save()) {
                return response()->json(['status' => 'success', 'message' => 'Vehicle saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save vehical'], 401);
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
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()], 401);
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
        ini_set('max_execution_time', 0);
        try {
            $validatedData = $request->validate([
                'truck' => 'required',
                'number_plate' => 'required|unique:vehicals,number_plate,' . $id,
                // 'purchase_value'=>'nullable',
                // 'model' => 'nullable|string|min:4',
                'track_device_id' => 'nullable|unique:vehicals,track_device_id,' . $id,
                'vehicle_reg_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'tax_doc_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'vehicle_ins_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'vehicle_mnl_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'other_doc' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
            ]);

            $vehical = Vehical::find($id);
            if (!$vehical) {
                return response()->json(['status' => false, 'message' => 'Vehical not found']);
            }

            $vehicalRegistery = "";
            if ($request->has('exist_vehicle_reg_file')) {
                $vehicalRegistery = $request->exist_vehicle_reg_file;
            } else if ($request->file('vehicle_reg_file')) {
                $file = $request->file('vehicle_reg_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalRegistery = time() . '.' . $request->vehicle_reg_file->extension();
                    $request->vehicle_reg_file->move(public_path('vehical/registration'), $vehicalRegistery);
                    $filePath = public_path('vehical/registration/' . $vehicalRegistery);
                    chmod($filePath, 0755);  //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['vendor_fileRC_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $taxDocuments = "";
            if ($request->has('exist_tax_doc_file')) {
                $taxDocuments = $request->exist_tax_doc_file;
            } else if ($request->file('tax_doc_file')) {
                $file = $request->file('tax_doc_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $taxDocuments = time() . '.' . $request->tax_doc_file->extension();
                    $request->tax_doc_file->move(public_path('vehical/tax'), $taxDocuments);
                    $filePath = public_path('vehical/tax/' . $taxDocuments);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['tax_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $vehicalInsurance = "";
            if ($request->has('exist_vehicle_ins_file')) {

                $vehicalInsurance = $request->exist_vehicle_ins_file;
            } else   if ($request->file('vehicle_ins_file')) {
                $file = $request->file('vehicle_ins_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalInsurance = time() . '.' . $request->vehicle_ins_file->extension();
                    $request->vehicle_ins_file->move(public_path('vehical/insurance'), $vehicalInsurance);
                    $filePath = public_path('vehical/insurance/' . $vehicalInsurance);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['insurance_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }


            $vehicalManual = "";
            if ($request->has('exist_vehicle_mnl_file')) {
                $vehicalManual = $request->exist_vehicle_mnl_file;
            } else  if ($request->file('vehicle_mnl_file')) {
                $file = $request->file('vehicle_mnl_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $vehicalManual = time() . '.' . $request->vehicle_mnl_file->extension();
                    $request->vehicle_mnl_file->move(public_path('vehical/manual'), $vehicalManual);
                    $filePath = public_path('vehical/manual/' . $vehicalManual);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['manual_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }

            $otherDocuments = "";
            if ($request->has('exist_other_doc')) {
                $otherDocuments = $request->exist_other_doc;
            } else  if ($request->file('other_doc')) {
                $file = $request->file('other_doc');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $otherDocuments = time() . '.' . $request->other_doc->extension();
                    $request->other_doc->move(public_path('vehical/others'), $otherDocuments);
                    $filePath = public_path('vehical/others/' . $otherDocuments);
                    chmod($filePath, 0755);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['other_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }
            $vehicle = Vehical::find($id);
            $vehicle->user_id = Auth::user()->id;
            $vehicle->truck = $validatedData['truck'];
            $vehicle->number_plate = $validatedData['number_plate'];
            $vehicle->truck_type = $request->truck_type;
            $vehicle->vin_no = $request->vin_no;
            $vehicle->make = $request->make;
            $vehicle->model = $request->model;
            $vehicle->year = $request->year;
            $vehicle->fuel_type = $request->fuel_type;
            $vehicle->reg_country = $request->reg_country;
            $vehicle->reg_state = $request->reg_state;
            $vehicle->odometer = $request->odometer;
            $vehicle->unit = $request->unit;
            $vehicle->track_device_id = $request->track_device_id;
            $vehicle->fuel_card = $request->fuel_card;
            $vehicle->purchase_value =  $request->purchase_value;
            $vehicle->purchase_date = $request->purchase_date;
            $vehicle->vehicle_reg_file = $vehicalRegistery;
            $vehicle->tax_doc_file = $taxDocuments;
            $vehicle->vehicle_ins_file = $vehicalInsurance;
            $vehicle->vehicle_mnl_file = $vehicalManual;
            $vehicle->other_doc = $otherDocuments;
            $vehicle->vehicle_status = $request->vehicle_status;
            $vehicle->comment = $request->comment;
            if ($vehicle->save()) {
                return response()->json(['status' => 'success', 'message' => 'Vehicle details update successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update vehical details'], 500);
            }
            // $liveTrack = $this->getVehicleTracking($validatedData['track_device_id']);
            // $response = json_decode($liveTrack, true);
            // if (!empty($validatedData['track_device_id']) && $response != null) {
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
            //             return response()->json(['status' => false, 'message' => 'Failed to save vehical'], 500);
            //         }
            //     } else {
            //         return response()->json(['status' => 'api-error', 'message' => 'Vehicle tracking id is not valid'], 500);
            //     }
            // } else {
            //     return response()->json(['status' => 'api-error', 'message' => 'Vehicle tracking ID is required and cannot be left blank. Please enter a valid ID'], 500);
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
        if ($id) {
            $Vehical = Vehical::find($id);
            $location = Locations::where('device_id', $Vehical->track_device_id)->first();


            if ($Vehical->delete() && $location->delete()) {
                return response()->json(['status' => true, 'message' => 'Vehical Delete Successfully',]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehical not found']);
            }
        }
    }
}
