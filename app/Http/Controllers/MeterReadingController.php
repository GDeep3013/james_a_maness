<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MeterReading;
use Auth;
use Illuminate\Support\Facades\Schema;

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

            $meterReading = new MeterReading;
            $meterReading->user_id = Auth::user()->id;
            $meterReading->vehicle_id = $validatedData['vehicle_id'];
            $meterReading->vehicle_meter = $validatedData['vehicle_meter'];
            $meterReading->date = $validatedData['date'];

            if ($meterReading->save()) {
                return response()->json(['status' => true, 'message' => 'Meter reading saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save meter reading'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
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

            $meterReading->user_id = Auth::user()->id;
            $meterReading->vehicle_id = $validatedData['vehicle_id'];
            $meterReading->vehicle_meter = $validatedData['vehicle_meter'];
            $meterReading->date = $validatedData['date'];

            if ($meterReading->save()) {
                return response()->json(['status' => true, 'message' => 'Meter reading updated successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update meter reading']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
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
}
