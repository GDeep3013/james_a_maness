<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceRecord;
use App\Models\Part;
use App\Models\Setting;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Auth;
class MaintenanceRecordController extends Controller
{
    private function prepareRequestData(Request $request)
    {
        $data = $request->all();

        if ($request->has('line_items') && is_string($request->line_items)) {
            $decoded = json_decode($request->line_items, true);
            $data['line_items'] = $decoded !== null ? $decoded : [];
        }

        $request->merge($data);
    }

    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('maintenance_records');
        $query = MaintenanceRecord::with([
            'vehicle:id,vehicle_name,make,model,year',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->orderBy('id', 'desc');
         $setting = Setting::first();
        $workOrders = WorkOrder::with(['vehicle','vendor'])
            ->when($request->vehicle_id, function ($q) use ($request) {
                $q->where('vehicle_id', $request->vehicle_id);
            })
            ->when($request->actual_start_date, function ($q) use ($request) {
                $q->whereDate('actual_start_date', '>=', $request->actual_start_date);
            })
            ->when($request->actual_completion_date, function ($q) use ($request) {
                $q->whereDate('actual_completion_date', '<=', $request->actual_completion_date);
            })
            ->get(['id', 'vehicle_id', 'service_items', 'actual_start_date', 'actual_completion_date', 'total_value' ,"parts"]);

        $searchTerm = $request->search;

        // Filter by vehicle_id
        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Filter by actual_start_date
        if ($request->has('actual_start_date') && !empty($request->actual_start_date)) {
            $query->whereDate('actual_start_date', '>=', $request->actual_start_date);
        }

        // Filter by actual_completion_date
        if ($request->has('actual_completion_date') && !empty($request->actual_completion_date)) {
            $query->whereDate('actual_completion_date', '<=', $request->actual_completion_date);
        }

        // Search functionality
        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'line_items') {
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

        $maintenanceRecords = $query->paginate(20);

        return response()->json(['status' => true, 'maintenance_records' => $maintenanceRecords, 'work_orders' => $workOrders, 'settings' => $setting]);
    }

    public function store(Request $request)
    {
        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'actual_start_date' => 'nullable|date',
                'actual_completion_date' => 'nullable|date',
                'total_value' => 'nullable|numeric',
                'invoice_number' => 'nullable|string|max:255',
                'po_number' => 'nullable|string|max:255',
                'counter_number' => 'nullable|string|max:255',
                'customer_account' => 'nullable|string|max:255',
                'ordered_by' => 'nullable|string|max:255',
                'special_instructions' => 'nullable|string',
                'sale_type' => 'nullable|string|max:255',
                'date' => 'nullable|date',
                'ship_via' => 'nullable|string|max:255',
                'line_items' => 'nullable|array',
                'sub_total' => 'nullable|numeric',
                'sales_tax' => 'nullable|numeric',
                'payment_method' => 'nullable|string|max:255',
                'payment_reference' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            $maintenanceRecord = new MaintenanceRecord;
            $maintenanceRecord->user_id = Auth::id();
            $maintenanceRecord->vehicle_id = $request->vehicle_id;
            $maintenanceRecord->vendor_id = $request->vendor_id ?? null;
            $maintenanceRecord->actual_start_date = $request->actual_start_date ?? null;
            $maintenanceRecord->actual_completion_date = $request->actual_completion_date ?? null;
            $maintenanceRecord->total_value = $request->total_value ?? null;
            $maintenanceRecord->invoice_number = $request->invoice_number ?? null;
            $maintenanceRecord->po_number = $request->po_number ?? null;
            $maintenanceRecord->counter_number = $request->counter_number ?? null;
            $maintenanceRecord->customer_account = $request->customer_account ?? null;
            $maintenanceRecord->ordered_by = $request->ordered_by ?? null;
            $maintenanceRecord->special_instructions = $request->special_instructions ?? null;
            $maintenanceRecord->sale_type = $request->sale_type ?? null;
            $maintenanceRecord->date = $request->date ?? null;
            $maintenanceRecord->ship_via = $request->ship_via ?? null;

            $lineItems = $request->line_items;
            if (is_string($lineItems)) {
                $decodedLineItems = json_decode($lineItems, true);
                $maintenanceRecord->line_items = $decodedLineItems !== null ? $decodedLineItems : [];
            } else {
                $maintenanceRecord->line_items = $lineItems ?? [];
            }

            $maintenanceRecord->sub_total = $request->sub_total ?? null;
            $maintenanceRecord->sales_tax = $request->sales_tax ?? null;
            $maintenanceRecord->payment_method = $request->payment_method ?? null;
            $maintenanceRecord->payment_reference = $request->payment_reference ?? null;

            if ($maintenanceRecord->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Maintenance record created successfully',
                    'data' => $maintenanceRecord->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create maintenance record'
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
            Log::error("Maintenance record creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the maintenance record. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record ID is required'
            ], 400);
        }

        $maintenanceRecord = MaintenanceRecord::with([
            'vehicle:id,vehicle_name',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($maintenanceRecord) {
            return response()->json([
                'status' => true,
                'message' => 'Maintenance record retrieved successfully',
                'data' => $maintenanceRecord
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record ID is required'
            ], 400);
        }

        $maintenanceRecord = MaintenanceRecord::with([
            'vehicle:id,vehicle_name',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($maintenanceRecord) {
            return response()->json([
                'status' => true,
                'message' => 'Maintenance record data',
                'data' => $maintenanceRecord
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record ID is required'
            ], 400);
        }

        $maintenanceRecord = MaintenanceRecord::find($id);
        if (!$maintenanceRecord) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record not found'
            ], 404);
        }

        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'actual_start_date' => 'nullable|date',
                'actual_completion_date' => 'nullable|date',
                'total_value' => 'nullable|numeric',
                'invoice_number' => 'nullable|string|max:255',
                'po_number' => 'nullable|string|max:255',
                'counter_number' => 'nullable|string|max:255',
                'customer_account' => 'nullable|string|max:255',
                'ordered_by' => 'nullable|string|max:255',
                'special_instructions' => 'nullable|string',
                'sale_type' => 'nullable|string|max:255',
                'date' => 'nullable|date',
                'ship_via' => 'nullable|string|max:255',
                'line_items' => 'nullable|array',
                'sub_total' => 'nullable|numeric',
                'sales_tax' => 'nullable|numeric',
                'payment_method' => 'nullable|string|max:255',
                'payment_reference' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            if ($request->has('vehicle_id')) {
                $maintenanceRecord->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('vendor_id')) {
                $maintenanceRecord->vendor_id = $request->vendor_id;
            }
            if ($request->has('actual_start_date')) {
                $maintenanceRecord->actual_start_date = $request->actual_start_date;
            }
            if ($request->has('actual_completion_date')) {
                $maintenanceRecord->actual_completion_date = $request->actual_completion_date;
            }
            if ($request->has('total_value')) {
                $maintenanceRecord->total_value = $request->total_value;
            }
            if ($request->has('invoice_number')) {
                $maintenanceRecord->invoice_number = $request->invoice_number;
            }
            if ($request->has('po_number')) {
                $maintenanceRecord->po_number = $request->po_number;
            }
            if ($request->has('counter_number')) {
                $maintenanceRecord->counter_number = $request->counter_number;
            }
            if ($request->has('customer_account')) {
                $maintenanceRecord->customer_account = $request->customer_account;
            }
            if ($request->has('ordered_by')) {
                $maintenanceRecord->ordered_by = $request->ordered_by;
            }
            if ($request->has('special_instructions')) {
                $maintenanceRecord->special_instructions = $request->special_instructions;
            }
            if ($request->has('sale_type')) {
                $maintenanceRecord->sale_type = $request->sale_type;
            }
            if ($request->has('date')) {
                $maintenanceRecord->date = $request->date;
            }
            if ($request->has('ship_via')) {
                $maintenanceRecord->ship_via = $request->ship_via;
            }
            if ($request->has('line_items')) {
                $lineItems = $request->line_items;
                if (is_string($lineItems)) {
                    $decodedLineItems = json_decode($lineItems, true);
                    $maintenanceRecord->line_items = $decodedLineItems !== null ? $decodedLineItems : [];
                } else {
                    $maintenanceRecord->line_items = $lineItems ?? [];
                }
            }
            if ($request->has('sub_total')) {
                $maintenanceRecord->sub_total = $request->sub_total;
            }
            if ($request->has('sales_tax')) {
                $maintenanceRecord->sales_tax = $request->sales_tax;
            }
            if ($request->has('payment_method')) {
                $maintenanceRecord->payment_method = $request->payment_method;
            }
            if ($request->has('payment_reference')) {
                $maintenanceRecord->payment_reference = $request->payment_reference;
            }

            if ($maintenanceRecord->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Maintenance record updated successfully',
                    'data' => $maintenanceRecord->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update maintenance record'
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
            Log::error("Maintenance record update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the maintenance record. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record ID is required'
            ], 400);
        }

        $maintenanceRecord = MaintenanceRecord::find($id);
        if (!$maintenanceRecord) {
            return response()->json([
                'status' => false,
                'message' => 'Maintenance record not found'
            ], 404);
        }

        if ($maintenanceRecord->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Maintenance record deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete maintenance record'
            ], 500);
        }
    }

    /**
     * Download maintenance record as PDF
     */
    public function download($id)
    {
        try {
            $maintenanceRecord = MaintenanceRecord::with(['vehicle', 'vendor', 'user'])->find($id);

            if (!$maintenanceRecord) {
                return response()->json(['status' => false, 'message' => 'Maintenance record not found'], 404);
            }


            $lineItems = is_array($maintenanceRecord->line_items)
                ? $maintenanceRecord->line_items
                : (is_string($maintenanceRecord->line_items)
                    ? json_decode($maintenanceRecord->line_items, true) ?? []
                    : []);

            $setting = Setting::first();
            $workOrders = WorkOrder::with(['vehicle','vendor'])
            ->when($maintenanceRecord->vehicle_id, function ($q) use ($maintenanceRecord) {
                $q->where('vehicle_id', $maintenanceRecord->vehicle_id);
            })
            ->when($maintenanceRecord->actual_start_date, function ($q) use ($maintenanceRecord) {
                $q->whereDate('actual_start_date', '>=', $maintenanceRecord->actual_start_date);
            })
            ->when($maintenanceRecord->actual_completion_date, function ($q) use ($maintenanceRecord) {
                $q->whereDate('actual_completion_date', '<=', $maintenanceRecord->actual_completion_date);
            })
            ->get(['id', 'vehicle_id', 'service_items', 'actual_start_date', 'actual_completion_date', 'total_value']);

            $data = [
                'maintenanceRecord' => $maintenanceRecord,
                'workOrders' => $workOrders,
                'lineItems' => $lineItems,
                'settings' => $setting
            ];
            //    dd($data);
            $pdf = Pdf::loadView('invoice.maintenanceReportPdf', $data);
            $fileName = 'Maintenance_Report_' . $maintenanceRecord->id . '_' . date('Y-m-d') . '.pdf';

            return $pdf->download($fileName);
        } catch (\Exception $e) {
            Log::error('Maintenance report download error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while generating the PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
