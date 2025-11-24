<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VehicleReplacement;
use Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class VehicleReplacementController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('vehicle_replacements');
        $query = VehicleReplacement::with(['vehicle', 'user']);
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at', 'service_cost_estimates', 'fuel_cost_estimates'])) {
                        $q->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) use ($searchTerm) {
                $q->where('vehicle_name', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if ($request->vehicle_id) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $query->orderBy('created_at', 'desc');

        if (!empty($request->page)) {
            $vehicleReplacements = $query->paginate(20);
            return response()->json(['status' => true, 'vehicle_replacements' => $vehicleReplacements]);
        } else {
            $vehicleReplacements = $query->get();
            return response()->json(['status' => true, 'vehicle_replacements' => $vehicleReplacements]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'estimated_vehicle_life' => 'required|integer|min:1',
                'estimated_annual_usage' => 'required|integer|min:1',
                'estimated_fuel_efficiency' => 'required|numeric|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'estimated_disposal_cost' => 'required|numeric|min:0',
                'estimated_salvage_value' => 'required|numeric|min:0',
                'method_of_depreciation' => 'required|in:Double Declining,Sum of Years',
                'service_cost_estimates' => 'nullable|array',
                'fuel_cost_estimates' => 'nullable|array',
            ]);

            DB::beginTransaction();

            $vehicleReplacement = new VehicleReplacement;
            $vehicleReplacement->user_id = Auth::user()->id;
            $vehicleReplacement->vehicle_id = $validatedData['vehicle_id'];
            $vehicleReplacement->estimated_vehicle_life = $validatedData['estimated_vehicle_life'];
            $vehicleReplacement->estimated_annual_usage = $validatedData['estimated_annual_usage'];
            $vehicleReplacement->estimated_fuel_efficiency = $validatedData['estimated_fuel_efficiency'];
            $vehicleReplacement->purchase_price = $validatedData['purchase_price'];
            $vehicleReplacement->estimated_disposal_cost = $validatedData['estimated_disposal_cost'];
            $vehicleReplacement->estimated_salvage_value = $validatedData['estimated_salvage_value'];
            $vehicleReplacement->method_of_depreciation = $validatedData['method_of_depreciation'];
            $vehicleReplacement->service_cost_estimates = $validatedData['service_cost_estimates'] ?? null;
            $vehicleReplacement->fuel_cost_estimates = $validatedData['fuel_cost_estimates'] ?? null;

            if ($vehicleReplacement->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Vehicle replacement analysis created successfully',
                    'data' => $vehicleReplacement->load(['user', 'vehicle'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create vehicle replacement analysis'
                ], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json([
                'status' => 'error',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            \Log::error('Vehicle replacement store error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error creating vehicle replacement analysis: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            if ($id) {
                $data = VehicleReplacement::with(['vehicle', 'user'])->where('id', $id)->first();
                if ($data) {
                    return response()->json(['status' => true, 'vehicle_replacement' => $data, 'data' => $data]);
                } else {
                    return response()->json(['status' => false, 'message' => 'Vehicle replacement analysis not found']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle replacement analysis ID is required']);
            }
        } catch (\Exception $e) {
            \Log::error('Vehicle replacement show error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error loading vehicle replacement analysis: ' . $e->getMessage()], 500);
        }
    }

    public function edit($id)
    {
        if ($id) {
            $data = VehicleReplacement::with(['vehicle', 'user'])->where('id', $id)->first();
            if ($data) {
                return response()->json(['status' => true, 'data' => $data]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vehicle replacement analysis not found']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Vehicle replacement analysis ID is required']);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'sometimes|exists:vehicals,id',
                'estimated_vehicle_life' => 'sometimes|integer|min:1',
                'estimated_annual_usage' => 'sometimes|integer|min:1',
                'estimated_fuel_efficiency' => 'sometimes|numeric|min:0',
                'purchase_price' => 'sometimes|numeric|min:0',
                'estimated_disposal_cost' => 'sometimes|numeric|min:0',
                'estimated_salvage_value' => 'sometimes|numeric|min:0',
                'estimated_salvage_value_unit' => 'sometimes|string|max:255',
                'method_of_depreciation' => 'sometimes|in:Double Declining,Sum of Years',
                'service_cost_estimates' => 'nullable|array',
                'fuel_cost_estimates' => 'nullable|array',
            ]);

            DB::beginTransaction();

            $vehicleReplacement = VehicleReplacement::findOrFail($id);
            
            if (isset($validatedData['vehicle_id'])) {
                $vehicleReplacement->vehicle_id = $validatedData['vehicle_id'];
            }
            if (isset($validatedData['estimated_vehicle_life'])) {
                $vehicleReplacement->estimated_vehicle_life = $validatedData['estimated_vehicle_life'];
            }
            
            if (isset($validatedData['estimated_annual_usage'])) {
                $vehicleReplacement->estimated_annual_usage = $validatedData['estimated_annual_usage'];
            }
            
            if (isset($validatedData['estimated_fuel_efficiency'])) {
                $vehicleReplacement->estimated_fuel_efficiency = $validatedData['estimated_fuel_efficiency'];
            }
            
            if (isset($validatedData['purchase_price'])) {
                $vehicleReplacement->purchase_price = $validatedData['purchase_price'];
            }
            if (isset($validatedData['estimated_disposal_cost'])) {
                $vehicleReplacement->estimated_disposal_cost = $validatedData['estimated_disposal_cost'];
            }
            if (isset($validatedData['estimated_salvage_value'])) {
                $vehicleReplacement->estimated_salvage_value = $validatedData['estimated_salvage_value'];
            }
            
            if (isset($validatedData['method_of_depreciation'])) {
                $vehicleReplacement->method_of_depreciation = $validatedData['method_of_depreciation'];
            }
            if (isset($validatedData['service_cost_estimates'])) {
                $vehicleReplacement->service_cost_estimates = $validatedData['service_cost_estimates'];
            }
            if (isset($validatedData['fuel_cost_estimates'])) {
                $vehicleReplacement->fuel_cost_estimates = $validatedData['fuel_cost_estimates'];
            }

            if ($vehicleReplacement->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Vehicle replacement analysis updated successfully',
                    'data' => $vehicleReplacement->load(['user', 'vehicle'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update vehicle replacement analysis'
                ], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json([
                'status' => 'error',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            \Log::error('Vehicle replacement update error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error updating vehicle replacement analysis: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $vehicleReplacement = VehicleReplacement::findOrFail($id);
            
            if ($vehicleReplacement->delete()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Vehicle replacement analysis deleted successfully'
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to delete vehicle replacement analysis'
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Vehicle replacement delete error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error deleting vehicle replacement analysis: ' . $e->getMessage()
            ], 500);
        }
    }
}

