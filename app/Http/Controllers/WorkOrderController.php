<?php

namespace App\Http\Controllers;

use App\Exports\WorkOrderExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;

class WorkOrderController extends Controller
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

    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('work_orders');
        $query = WorkOrder::with([
            'vehicle:id,vehicle_name,type,make,model,year,license_plate',
            'assignedTo:id,first_name,last_name',
            'vendor:id,name',
            'user:id,name'
        ])->orderBy('id', 'desc');

        $searchTerm = $request->search;

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('vendor_id') && !empty($request->vendor_id)) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->has('issue_date') && !empty($request->issue_date)) {
            $query->whereMonth('issue_date', date('m', strtotime($request->issue_date)));
            $query->whereYear('issue_date', date('Y', strtotime($request->issue_date)));
        }

        if ($request->has('start_date') && !empty($request->start_date) && $request->has('end_date') && !empty($request->end_date)) {
            $query->whereBetween('actual_completion_date', [$request->start_date, $request->end_date]);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'labels' && $column !== 'service_items' && $column !== 'parts') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });




            $query->orWhereHas('vehicle', function ($q) use ($searchTerm) {
                $q->where('vehicle_name', 'LIKE', '%' . $searchTerm . '%');
            });

            $query->orWhereHas('assignedTo', function ($q) use ($searchTerm) {
                $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$searchTerm%"]);
            });

            $query->orWhereHas('vendor', function ($q) use ($searchTerm) {
                $q->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('company_contact', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $workOrders = $query->paginate(20);

        return response()->json(['status' => true, 'work_orders' => $workOrders]);
    }

    public function store(Request $request)
    {
        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'status' => 'nullable|string|max:255',
                'repair_priority_class' => 'nullable|string|max:255',
                'issue_date' => 'nullable|date',
                'scheduled_start_date' => 'nullable|date',
                'send_scheduled_start_date_reminder' => 'nullable',
                'actual_start_date' => 'nullable|date',
                'expected_completion_date' => 'nullable|date',
                'actual_completion_date' => 'nullable|date',
                'use_start_odometer_for_completion_meter' => 'nullable',
                'assigned_to' => 'nullable|exists:contacts,id',
                'labels' => 'nullable',
                //'vendor_id' => 'nullable|exists:vendors,id',
                'invoice_number' => 'nullable|string|max:255',
                'po_number' => 'nullable|string|max:255',
                'discount_type' => 'nullable|string|max:255',
                'discount_value' => 'nullable|numeric',
                'base_value' => 'nullable|numeric',
                'total_value' => 'nullable|numeric',
                'tax_type' => 'nullable|string|max:255',
                'tax_value' => 'nullable|numeric',
                'service_items' => 'nullable|array',
                'parts' => 'nullable|array',
            ]);

            DB::beginTransaction();

            $workOrder = new WorkOrder;
            $workOrder->user_id = Auth::id();
            $workOrder->vehicle_id = $request->vehicle_id ?? null;
            $workOrder->status = $request->status ?? null;
            $workOrder->repair_priority_class = $request->repair_priority_class ?? null;
            $workOrder->issue_date = $request->issue_date ?? null;
            $workOrder->scheduled_start_date = $request->scheduled_start_date ?? null;
            $workOrder->send_scheduled_start_date_reminder = $this->convertToBoolean($request->send_scheduled_start_date_reminder, false);
            $workOrder->actual_start_date = $request->actual_start_date ?? null;
            $workOrder->expected_completion_date = $request->expected_completion_date ?? null;
            $workOrder->actual_completion_date = $request->actual_completion_date ?? null;
            $workOrder->use_start_odometer_for_completion_meter = $this->convertToBoolean($request->use_start_odometer_for_completion_meter, true);
            $workOrder->assigned_to = $request->assigned_to ?? null;

            $labels = $request->labels;
            if (is_string($labels)) {
                $decodedLabels = json_decode($labels, true);
                $workOrder->labels = $decodedLabels !== null ? $decodedLabels : null;
            } else {
                $workOrder->labels = $labels ?? null;
            }

            $workOrder->vendor_id = $request->vendor_id ?? null;
            $workOrder->invoice_number = $request->invoice_number ?? null;
            $workOrder->po_number = $request->po_number ?? null;
            $workOrder->discount_type = $request->discount_type ?? null;
            $workOrder->discount_value = $request->discount_value ?? null;
            $workOrder->base_value = $request->base_value ?? null;
            $workOrder->total_value = $request->total_value ?? null;
            $workOrder->tax_type = $request->tax_type ?? null;
            $workOrder->tax_value = $request->tax_value ?? null;

            $serviceItems = $request->service_items;
            if (is_string($serviceItems)) {
                $decodedServiceItems = json_decode($serviceItems, true);
                $workOrder->service_items = $decodedServiceItems !== null ? $decodedServiceItems : [];
            } else {
                $workOrder->service_items = $serviceItems ?? [];
            }

            $parts = $request->parts;
            if (is_string($parts)) {
                $decodedParts = json_decode($parts, true);
                $workOrder->parts = $decodedParts !== null ? $decodedParts : [];
            } else {
                $workOrder->parts = $parts ?? [];
            }

            if ($workOrder->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Work order created successfully',
                    'data' => $workOrder->load(['vehicle', 'assignedTo', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create work order'
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
            Log::error("Work order creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the work order. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Work order ID is required'
            ], 400);
        }

        $workOrder = WorkOrder::where('id', $id)->first();

        if ($workOrder) {
            return response()->json([
                'status' => true,
                'message' => 'Work order retrieved successfully',
                'work_order' => $workOrder
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Work order not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Work order ID is required'
            ], 400);
        }

        $workOrder = WorkOrder::with([
            'vehicle:id,vehicle_name',
            // 'assignedTo:id,first_name,last_name',
            'vendor:id,name',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($workOrder) {
            return response()->json([
                'status' => true,
                'message' => 'Work order data',
                'data' => $workOrder
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Work order not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Work order ID is required'
            ], 400);
        }

        $workOrder = WorkOrder::find($id);
        if (!$workOrder) {
            return response()->json([
                'status' => false,
                'message' => 'Work order not found'
            ], 404);
        }

        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'status' => 'nullable|string|max:255',
                'repair_priority_class' => 'nullable|string|max:255',
                'issue_date' => 'nullable|date',
                'scheduled_start_date' => 'nullable|date',
                'send_scheduled_start_date_reminder' => 'nullable',
                'actual_start_date' => 'nullable|date',
                'expected_completion_date' => 'nullable|date',
                'actual_completion_date' => 'nullable|date',
                'use_start_odometer_for_completion_meter' => 'nullable',
                'assigned_to' => 'nullable|exists:contacts,id',
                'labels' => 'nullable',
                'vendor_id' => 'nullable|exists:vendors,id',
                'invoice_number' => 'nullable|string|max:255',
                'po_number' => 'nullable|string|max:255',
                'discount_type' => 'nullable|string|max:255',
                'discount_value' => 'nullable|numeric',
                'base_value' => 'nullable|numeric',
                'total_value' => 'nullable|numeric',
                'tax_type' => 'nullable|string|max:255',
                'tax_value' => 'nullable|numeric',
                'service_items' => 'nullable|array',
                'parts' => 'nullable|array',
            ]);

            DB::beginTransaction();

            if ($request->has('vehicle_id')) {
                $workOrder->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('status')) {
                $workOrder->status = $request->status;
            }
            if ($request->has('repair_priority_class')) {
                $workOrder->repair_priority_class = $request->repair_priority_class;
            }
            if ($request->has('issue_date')) {
                $workOrder->issue_date = $request->issue_date;
            }
            if ($request->has('scheduled_start_date')) {
                $workOrder->scheduled_start_date = $request->scheduled_start_date;
            }
            if ($request->has('send_scheduled_start_date_reminder')) {
                $workOrder->send_scheduled_start_date_reminder = $this->convertToBoolean($request->send_scheduled_start_date_reminder, false);
            }
            if ($request->has('actual_start_date')) {
                $workOrder->actual_start_date = $request->actual_start_date;
            }
            if ($request->has('expected_completion_date')) {
                $workOrder->expected_completion_date = $request->expected_completion_date;
            }
            if ($request->has('actual_completion_date')) {
                $workOrder->actual_completion_date = $request->actual_completion_date;
            }
            if ($request->has('use_start_odometer_for_completion_meter')) {
                $workOrder->use_start_odometer_for_completion_meter = $this->convertToBoolean($request->use_start_odometer_for_completion_meter, true);
            }
            if ($request->has('assigned_to')) {
                $workOrder->assigned_to = $request->assigned_to;
            }
            if ($request->has('labels')) {
                $labels = $request->labels;
                if (is_string($labels)) {
                    $decodedLabels = json_decode($labels, true);
                    $workOrder->labels = $decodedLabels !== null ? $decodedLabels : null;
                } else {
                    $workOrder->labels = $labels;
                }
            }
            if ($request->has('vendor_id')) {
                $workOrder->vendor_id = $request->vendor_id;
            }
            if ($request->has('invoice_number')) {
                $workOrder->invoice_number = $request->invoice_number;
            }
            if ($request->has('po_number')) {
                $workOrder->po_number = $request->po_number;
            }
            if ($request->has('discount_type')) {
                $workOrder->discount_type = $request->discount_type;
            }
            if ($request->has('discount_value')) {
                $workOrder->discount_value = $request->discount_value;
            }
            if ($request->has('base_value')) {
                $workOrder->base_value = $request->base_value;
            }
            if ($request->has('total_value')) {
                $workOrder->total_value = $request->total_value;
            }
            if ($request->has('tax_type')) {
                $workOrder->tax_type = $request->tax_type;
            }
            if ($request->has('tax_value')) {
                $workOrder->tax_value = $request->tax_value;
            }
            if ($request->has('service_items')) {
                $serviceItems = $request->service_items;
                if (is_string($serviceItems)) {
                    $decodedServiceItems = json_decode($serviceItems, true);
                    $workOrder->service_items = $decodedServiceItems !== null ? $decodedServiceItems : [];
                } else {
                    $workOrder->service_items = $serviceItems ?? [];
                }
            }
            if ($request->has('parts')) {
                $parts = $request->parts;
                if (is_string($parts)) {
                    $decodedParts = json_decode($parts, true);
                    $workOrder->parts = $decodedParts !== null ? $decodedParts : [];
                } else {
                    $workOrder->parts = $parts ?? [];
                }
            }

            if ($workOrder->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Work order updated successfully',
                    'data' => $workOrder->load(['vehicle', 'assignedTo', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update work order'
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
            Log::error("Work order update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the work order. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Work order ID is required'
            ], 400);
        }

        $workOrder = WorkOrder::find($id);
        if (!$workOrder) {
            return response()->json([
                'status' => false,
                'message' => 'Work order not found'
            ], 404);
        }

        if ($workOrder->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Work order deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete work order'
            ], 500);
        }
    }

    public function export(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $status = $request->input('status', '');

            $export = new WorkOrderExport($search, $status);

            $fileName = 'work_orders_export_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while exporting work orders.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
