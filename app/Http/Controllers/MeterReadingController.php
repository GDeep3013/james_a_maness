<?php

namespace App\Http\Controllers;

use App\Exports\MeterReadingExport;
use Illuminate\Http\Request;
use App\Models\MeterReading;
use App\Models\Vehical;
use Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class MeterReadingController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('meter_readings');
        $query = MeterReading::with(['vehicle', 'user']);
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at'])) {
                        $q->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });
        }

        $query->orderBy('date', 'desc');

        if (!empty($request->page)) {
            $meterReadings = $query->paginate(20);
            return response()->json(['status' => true, 'meterReading' => $meterReadings]);
        } else {
            $meterReadings = $query->get();
            return response()->json(['status' => true, 'meterReading' => $meterReadings]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vehicle_meter' => 'required|string|max:255',
                'date' => 'required|date',
            ]);

            $vehicle = Vehical::find($validatedData['vehicle_id']);
            if (!$vehicle) {
                return response()->json(['status' => false, 'message' => 'Vehicle not found'], 404);
            }

            $currentMileage = $vehicle->current_mileage ? (float) $vehicle->current_mileage : 0;
            $newMeterReading = (float) $validatedData['vehicle_meter'];

            if ($newMeterReading <= $currentMileage) {
                return response()->json([
                    'status' => 'error',
                    'errors' => [
                        'vehicle_meter' => ['Vehicle meter reading must be greater than current mileage (' . $currentMileage . ')']
                    ]
                ], 422);
            }

            DB::beginTransaction();

            $meterReading = new MeterReading;
            $meterReading->user_id = Auth::user()->id;
            $meterReading->vehicle_id = $validatedData['vehicle_id'];
            $meterReading->vehicle_meter = $validatedData['vehicle_meter'];
            $meterReading->date = $validatedData['date'];

            if ($meterReading->save()) {
                $vehicle->current_mileage = $validatedData['vehicle_meter'];
                $vehicle->save();

                DB::commit();
                return response()->json(['status' => true, 'message' => 'Meter reading saved successfully']);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to save meter reading'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            \Log::error('Meter reading store error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while saving the meter reading'], 500);
        }
    }

    public function show($id)
    {
        try {
            if ($id) {
                $data = MeterReading::with(['vehicle', 'user'])->where('id', $id)->first();
                if ($data) {
                    return response()->json(['status' => true, 'meterReading' => $data, 'data' => $data]);
                } else {
                    return response()->json(['status' => false, 'message' => 'Meter reading not found']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Meter reading ID is required']);
            }
        } catch (\Exception $e) {
            \Log::error('Meter reading show error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error loading meter reading: ' . $e->getMessage()], 500);
        }
    }

    public function edit($id)
    {
        if ($id) {
            $data = MeterReading::with(['vehicle', 'user'])->where('id', $id)->first();
            if ($data) {
                return response()->json(['status' => true, 'data' => $data]);
            } else {
                return response()->json(['status' => false, 'message' => 'Meter reading not found']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Meter reading ID is required']);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vehicle_meter' => 'required|string|max:255',
                'date' => 'required|date',
            ]);

            $meterReading = MeterReading::find($id);
            if (!$meterReading) {
                return response()->json(['status' => false, 'message' => 'Meter reading not found']);
            }

            $vehicle = Vehical::find($validatedData['vehicle_id']);
            if (!$vehicle) {
                return response()->json(['status' => false, 'message' => 'Vehicle not found'], 404);
            }

            $currentMileage = $vehicle->current_mileage ? (float) $vehicle->current_mileage : 0;
            $newMeterReading = (float) $validatedData['vehicle_meter'];

            if ($newMeterReading <= $currentMileage) {
                return response()->json([
                    'status' => 'error',
                    'errors' => [
                        'vehicle_meter' => ['Vehicle meter reading must be greater than current mileage (' . $currentMileage . ')']
                    ]
                ], 422);
            }

            DB::beginTransaction();

            $meterReading->user_id = Auth::user()->id;
            $meterReading->vehicle_id = $validatedData['vehicle_id'];
            $meterReading->vehicle_meter = $validatedData['vehicle_meter'];
            $meterReading->date = $validatedData['date'];

            if ($meterReading->save()) {
                $vehicle->current_mileage = $validatedData['vehicle_meter'];
                $vehicle->save();

                DB::commit();
                return response()->json(['status' => true, 'message' => 'Meter reading updated successfully']);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to update meter reading']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            \Log::error('Meter reading update error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while updating the meter reading'], 500);
        }
    }

    public function destroy($id)
    {
        if ($id) {
            $meterReading = MeterReading::find($id);
            if ($meterReading && $meterReading->delete()) {
                return response()->json(['status' => true, 'message' => 'Meter reading deleted successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Meter reading not found']);
            }
        }
    }

    public function export(Request $request)
    {
        try {
            $search = $request->input('search', '');

            $export = new MeterReadingExport($search);

            $fileName = 'meter_readings_export_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while exporting meter readings.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
