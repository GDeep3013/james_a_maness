<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fuel;
use Auth;
use Illuminate\Support\Facades\Schema;

class FuelController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('fuels');
        $query = Fuel::with(['vehicle', 'vendor']);
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
        // dd($query);
        if (!empty($request->page)) {
            $fuels = $query->paginate(20);
            return response()->json(['status' => true, 'fuel' => $fuels]);
        } else {
            $fuels = $query->get();
            return response()->json(['status' => true, 'fuel' => $fuels]);
        }
    }

    public function store(Request $request)
    {
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'required|exists:vendors,id',
                'fuel_type' => 'required|string|in:gasoline,diesel,electric,hybrid',
                'unit_type' => 'required|in:us_gallons,liters,uk_gallons',
                'units' => 'required|numeric|min:0',
                'price_per_volume_unit' => 'required|numeric|min:0',
                'vehicle_meter' => 'required|string|max:255',
                'notes' => 'nullable|string',
                'date' => 'required|date',
            ]);

            $fuel = new Fuel;
            $fuel->user_id = Auth::user()->id;
            $fuel->vehicle_id = $validatedData['vehicle_id'];
            $fuel->vendor_id = $validatedData['vendor_id'];
            $fuel->fuel_type = $validatedData['fuel_type'];
            $fuel->unit_type = $validatedData['unit_type'];
            $fuel->units = $validatedData['units'];
            $fuel->price_per_volume_unit = $validatedData['price_per_volume_unit'];
            $fuel->total_cost =  ($validatedData['units']* $validatedData['price_per_volume_unit']);
            $fuel->vehicle_meter = $validatedData['vehicle_meter'];
            $fuel->notes = $validatedData['notes'] ?? null;
            $fuel->date = $validatedData['date'];

            if ($fuel->save()) {
                return response()->json(['status' => true, 'message' => 'Fuel entry saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save fuel entry'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        }
    }

    public function show($id)
    {
        try {
            if ($id) {
                $data = Fuel::with(['vehicle', 'vendor'])->where('id', $id)->first();
                if ($data) {
                    return response()->json(['status' => true, 'fuel' => $data, 'data' => $data]);
                } else {
                    return response()->json(['status' => false, 'message' => 'Fuel entry not found']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Fuel ID is required']);
            }
        } catch (\Exception $e) {
            \Log::error('Fuel show error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error loading fuel entry: ' . $e->getMessage()], 500);
        }
    }

    public function edit($id)
    {
        if ($id) {
            $data = Fuel::with(['vehicle', 'vendor'])->where('id', $id)->first();
            if ($data) {
                return response()->json(['status' => true, 'data' => $data]);
            } else {
                return response()->json(['status' => false, 'message' => 'Fuel entry not found']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Fuel ID is required']);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'required|exists:vendors,id',
                'fuel_type' => 'required|string|in:gasoline,diesel,electric,hybrid',
                'unit_type' => 'required|in:us_gallons,liters,uk_gallons',
                'units' => 'required|numeric|min:0',
                'price_per_volume_unit' => 'required|numeric|min:0',
                'vehicle_meter' => 'required|string|max:255',
                'notes' => 'nullable|string',
                'date' => 'required|date',
            ]);

            $fuel = Fuel::find($id);
            if (!$fuel) {
                return response()->json(['status' => false, 'message' => 'Fuel entry not found']);
            }

            $fuel->user_id = Auth::user()->id;
            $fuel->vehicle_id = $validatedData['vehicle_id'];
            $fuel->vendor_id = $validatedData['vendor_id'];
            $fuel->fuel_type = $validatedData['fuel_type'];
            $fuel->unit_type = $validatedData['unit_type'];
            $fuel->units = $validatedData['units'];
            $fuel->price_per_volume_unit = $validatedData['price_per_volume_unit'];
            $fuel->total_cost =  ($validatedData['units'] * $validatedData['price_per_volume_unit']);
            $fuel->vehicle_meter = $validatedData['vehicle_meter'];
            $fuel->notes = $validatedData['notes'] ?? null;
            $fuel->date = $validatedData['date'];

            if ($fuel->save()) {
                return response()->json(['status' => true, 'message' => 'Fuel entry updated successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update fuel entry']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        }
    }

    public function destroy($id)
    {
        if ($id) {
            $fuel = Fuel::find($id);
            if ($fuel && $fuel->delete()) {
                return response()->json(['status' => true, 'message' => 'Fuel entry deleted successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Fuel entry not found']);
            }
        }
    }
}
