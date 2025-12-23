<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;
use App\Exports\ServiceExport;
use Maatwebsite\Excel\Facades\Excel;

class ServiceController extends Controller
{
    private function prepareRequestData(Request $request)
    {
        $data = $request->all();

        if ($request->has('service_items') && is_string($request->service_items)) {
            $decoded = json_decode($request->service_items, true);
            $data['service_items'] = $decoded !== null ? $decoded : [];
        }

        if ($request->has('parts') && is_string($request->parts)) {
            $decoded = json_decode($request->parts, true);
            $data['parts'] = $decoded !== null ? $decoded : [];
        }

        $request->merge($data);
    }

    private function calculateTotals($serviceItems, $parts, $discountType, $discountValue, $taxType, $taxValue)
    {
        $laborTotal = 0;
        $partsTotal = 0;

        if (is_array($serviceItems)) {
            foreach ($serviceItems as $item) {
                $laborTotal += isset($item['labor_cost']) ? (float)$item['labor_cost'] : 0;
            }
        }

        if (is_array($parts)) {
            foreach ($parts as $part) {
                $unitPrice = isset($part['unit_price']) ? (float)$part['unit_price'] : 0;
                $quantity = isset($part['quantity']) ? (float)$part['quantity'] : 1;
                $partsTotal += $unitPrice * $quantity;
            }
        }

        $subtotal = $laborTotal + $partsTotal;

        $discountAmount = 0;
        if ($discountValue && $discountValue > 0) {
            if ($discountType === 'percentage') {
                $discountAmount = ($subtotal * (float)$discountValue) / 100;
            } else {
                $discountAmount = (float)$discountValue;
            }
        }

        $afterDiscount = $subtotal - $discountAmount;

        $taxAmount = 0;
        if ($taxValue && $taxValue > 0) {
            if ($taxType === 'percentage') {
                $taxAmount = ($afterDiscount * (float)$taxValue) / 100;
            } else {
                $taxAmount = (float)$taxValue;
            }
        }

        $total = $afterDiscount + $taxAmount;

        return [
            'labor_total' => $laborTotal,
            'parts_total' => $partsTotal,
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'total' => $total,
        ];
    }

    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('services');
        $query = Service::with([
            'vehicle:id,vehicle_name,make,model,year,license_plate,current_mileage',
            'vendor:id,name',
            'user:id,name'
        ])->orderBy('id', 'desc');

        $searchTerm = $request->search;


        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('vendor_id') && !empty($request->vendor_id)) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->has('start_date') && !empty($request->start_date) && $request->has('end_date') && !empty($request->end_date)) {
            $query->whereBetween('completion_date', [$request->start_date, $request->end_date]);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'service_items' && $column !== 'parts') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) use ($searchTerm) {
                $q->where('vehicle_name', 'LIKE', '%' . $searchTerm . '%');
            });

            $query->orWhereHas('vendor', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $services = $query->paginate(20);

        $services->getCollection()->transform(function ($service) {
            if ($service->vehicle_id) {
                $lastCompletedService = Service::where('vehicle_id', $service->vehicle_id)
                    ->where('id', '!=', $service->id)
                    ->whereNotNull('completion_date')
                    ->orderBy('completion_date', 'desc')
                    ->first(['completion_date', 'primary_meter']);

                $service->last_completed_date = $lastCompletedService ? $lastCompletedService->completion_date : null;
                $service->last_completed_meter = $lastCompletedService ? $lastCompletedService->primary_meter : null;
            } else {
                $service->last_completed_date = null;
                $service->last_completed_meter = null;
            }

            return $service;
        });

        return response()->json(['status' => true, 'services' => $services]);
    }

    public function store(Request $request)
    {
        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'repair_priority_class' => 'nullable|string|max:255',
                'primary_meter' => 'nullable|numeric',
                'completion_date' => 'nullable|date',
                'set_start_date' => 'nullable',
                'start_date' => 'nullable|date',
                'service_items' => 'nullable|array',
                'parts' => 'nullable|array',
            ]);

            DB::beginTransaction();

            $service = new Service;
            $service->user_id = Auth::id();
            $service->vehicle_id = $request->vehicle_id ?? null;
            $service->vendor_id = $request->vendor_id ?? null;
            $service->repair_priority_class = $request->repair_priority_class ?? null;
            $service->primary_meter = $request->primary_meter ?? null;
            $service->completion_date = $request->completion_date ?? null;
            $service->set_start_date = $this->convertToBoolean($request->set_start_date, false);
            $service->start_date = $request->start_date ?? null;
            $service->notes = $request->notes ?? null;
            $service->discount_type = $request->discount_type ?? null;
            $service->discount_value = $request->discount_value ?? null;
            $service->tax_type = $request->tax_type ?? null;
            $service->tax_value = $request->tax_value ?? null;

            $serviceItems = $request->service_items;
            if (is_string($serviceItems)) {
                $decodedServiceItems = json_decode($serviceItems, true);
                $service->service_items = $decodedServiceItems !== null ? $decodedServiceItems : [];
            } else {
                $service->service_items = $serviceItems ?? [];
            }

            $parts = $request->parts;
            if (is_string($parts)) {
                $decodedParts = json_decode($parts, true);
                $service->parts = $decodedParts !== null ? $decodedParts : [];
            } else {
                $service->parts = $parts ?? [];
            }

            $totals = $this->calculateTotals(
                $service->service_items,
                $service->parts,
                $service->discount_type,
                $service->discount_value,
                $service->tax_type,
                $service->tax_value
            );

            $service->labor_total = $totals['labor_total'];
            $service->parts_total = $totals['parts_total'];
            $service->subtotal = $totals['subtotal'];
            $service->discount_amount = $totals['discount_amount'];
            $service->tax_amount = $totals['tax_amount'];
            $service->total = $totals['total'];

            if ($service->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service created successfully',
                    'data' => $service->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create service'
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
            Log::error("Service creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the service. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service ID is required'
            ], 400);
        }

        $service = Service::where('id', $id)->first();

        if ($service) {
            return response()->json([
                'status' => true,
                'message' => 'Service retrieved successfully',
                'service' => $service
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service ID is required'
            ], 400);
        }

        $service = Service::with([
            'vehicle:id,vehicle_name',
            'vendor:id,name',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($service) {
            return response()->json([
                'status' => true,
                'message' => 'Service data',
                'data' => $service
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service ID is required'
            ], 400);
        }

        $service = Service::find($id);
        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service not found'
            ], 404);
        }

        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'repair_priority_class' => 'nullable|string|max:255',
                'primary_meter' => 'nullable|numeric',
                'completion_date' => 'nullable|date',
                'set_start_date' => 'nullable',
                'start_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'discount_type' => 'nullable|string|max:255',
                'discount_value' => 'nullable|numeric',
                'tax_type' => 'nullable|string|max:255',
                'tax_value' => 'nullable|numeric',
                'service_items' => 'nullable|array',
                'parts' => 'nullable|array',
            ]);

            DB::beginTransaction();

            if ($request->has('vehicle_id')) {
                $service->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('vendor_id')) {
                $service->vendor_id = $request->vendor_id;
            }
            if ($request->has('repair_priority_class')) {
                $service->repair_priority_class = $request->repair_priority_class;
            }
            if ($request->has('primary_meter')) {
                $service->primary_meter = $request->primary_meter;
            }
            if ($request->has('completion_date')) {
                $service->completion_date = $request->completion_date;
            }
            if ($request->has('set_start_date')) {
                $service->set_start_date = $this->convertToBoolean($request->set_start_date, false);
            }
            if ($request->has('start_date')) {
                $service->start_date = $request->start_date;
            }
            if ($request->has('notes')) {
                $service->notes = $request->notes;
            }
            if ($request->has('discount_type')) {
                $service->discount_type = $request->discount_type;
            }
            if ($request->has('discount_value')) {
                $service->discount_value = $request->discount_value;
            }
            if ($request->has('tax_type')) {
                $service->tax_type = $request->tax_type;
            }
            if ($request->has('tax_value')) {
                $service->tax_value = $request->tax_value;
            }
            if ($request->has('service_items')) {
                $serviceItems = $request->service_items;
                if (is_string($serviceItems)) {
                    $decodedServiceItems = json_decode($serviceItems, true);
                    $service->service_items = $decodedServiceItems !== null ? $decodedServiceItems : [];
                } else {
                    $service->service_items = $serviceItems ?? [];
                }
            }
            if ($request->has('parts')) {
                $parts = $request->parts;
                if (is_string($parts)) {
                    $decodedParts = json_decode($parts, true);
                    $service->parts = $decodedParts !== null ? $decodedParts : [];
                } else {
                    $service->parts = $parts ?? [];
                }
            }

            $totals = $this->calculateTotals(
                $service->service_items,
                $service->parts,
                $service->discount_type,
                $service->discount_value,
                $service->tax_type,
                $service->tax_value
            );

            $service->labor_total = $totals['labor_total'];
            $service->parts_total = $totals['parts_total'];
            $service->subtotal = $totals['subtotal'];
            $service->discount_amount = $totals['discount_amount'];
            $service->tax_amount = $totals['tax_amount'];
            $service->total = $totals['total'];

            if ($service->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service updated successfully',
                    'data' => $service->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update service'
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
            Log::error("Service update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the service. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service ID is required'
            ], 400);
        }

        $service = Service::find($id);
        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service not found'
            ], 404);
        }

        if ($service->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Service deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete service'
            ], 500);
        }
    }

    public function export(Request $request)
    {
        try {
            $search = $request->input('search', '');

            $export = new ServiceExport($search);

            $fileName = 'services_export_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while exporting services.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
