<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FuelReport;
use App\Models\Fuel;
use App\Models\Setting;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Auth;

class FuelReportController extends Controller
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
        $tableColumns = Schema::getColumnListing('fuel_reports');
        $query = FuelReport::with([
            'vehicle:id,vehicle_name,make,model,year',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->orderBy('id', 'desc');
        $setting = Setting::first();
        $fuels = Fuel::with(['vehicle', 'vendor'])
            ->when($request->vehicle_id, function ($q) use ($request) {
                $q->where('vehicle_id', $request->vehicle_id);
            })
            ->when($request->start_date, function ($q) use ($request) {
                $q->whereDate('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($q) use ($request) {
                $q->whereDate('date', '<=', $request->end_date);
            })
            ->get(['id', 'vehicle_id', 'vendor_id', 'fuel_type', 'unit_type', 'units', 'price_per_volume_unit', 'total_cost', 'vehicle_meter', 'previous_meter', 'date']);

        $searchTerm = $request->search;

        // Filter by vehicle_id
        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Filter by start_date
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        // Filter by end_date
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('end_date', '<=', $request->end_date);
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

        $fuelReports = $query->paginate(20);

        return response()->json([
            'status' => true,
            'fuel_reports' => $fuelReports,
            'fuels' => $fuels,
            'settings' => $setting
        ]);
    }

    public function store(Request $request)
    {
        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
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

            $fuelReport = new FuelReport;
            $fuelReport->user_id = Auth::id();
            $fuelReport->vehicle_id = $request->vehicle_id;
            $fuelReport->vendor_id = $request->vendor_id ?? null;
            $fuelReport->start_date = $request->start_date ?? null;
            $fuelReport->end_date = $request->end_date ?? null;
            $fuelReport->total_value = $request->total_value ?? null;
            $fuelReport->invoice_number = $request->invoice_number ?? null;
            $fuelReport->po_number = $request->po_number ?? null;
            $fuelReport->counter_number = $request->counter_number ?? null;
            $fuelReport->customer_account = $request->customer_account ?? null;
            $fuelReport->ordered_by = $request->ordered_by ?? null;
            $fuelReport->special_instructions = $request->special_instructions ?? null;
            $fuelReport->sale_type = $request->sale_type ?? null;
            $fuelReport->date = $request->date ?? null;
            $fuelReport->ship_via = $request->ship_via ?? null;

            $lineItems = $request->line_items;
            if (is_string($lineItems)) {
                $decodedLineItems = json_decode($lineItems, true);
                $fuelReport->line_items = $decodedLineItems !== null ? $decodedLineItems : [];
            } else {
                $fuelReport->line_items = $lineItems ?? [];
            }

            $fuelReport->sub_total = $request->sub_total ?? null;
            $fuelReport->sales_tax = $request->sales_tax ?? null;
            $fuelReport->payment_method = $request->payment_method ?? null;
            $fuelReport->payment_reference = $request->payment_reference ?? null;

            if ($fuelReport->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Fuel report created successfully',
                    'data' => $fuelReport->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create fuel report'
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
            Log::error("Fuel report creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the fuel report. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report ID is required'
            ], 400);
        }

        $fuelReport = FuelReport::with([
            'vehicle:id,vehicle_name',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($fuelReport) {
            return response()->json([
                'status' => true,
                'message' => 'Fuel report retrieved successfully',
                'data' => $fuelReport
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report ID is required'
            ], 400);
        }

        $fuelReport = FuelReport::with([
            'vehicle:id,vehicle_name',
            'vendor:id,name,address,city,state,zip,email',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($fuelReport) {
            return response()->json([
                'status' => true,
                'message' => 'Fuel report data',
                'data' => $fuelReport
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report ID is required'
            ], 400);
        }

        $fuelReport = FuelReport::find($id);
        if (!$fuelReport) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report not found'
            ], 404);
        }

        try {
            $this->prepareRequestData($request);

            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
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
                $fuelReport->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('vendor_id')) {
                $fuelReport->vendor_id = $request->vendor_id;
            }
            if ($request->has('start_date')) {
                $fuelReport->start_date = $request->start_date;
            }
            if ($request->has('end_date')) {
                $fuelReport->end_date = $request->end_date;
            }
            if ($request->has('total_value')) {
                $fuelReport->total_value = $request->total_value;
            }
            if ($request->has('invoice_number')) {
                $fuelReport->invoice_number = $request->invoice_number;
            }
            if ($request->has('po_number')) {
                $fuelReport->po_number = $request->po_number;
            }
            if ($request->has('counter_number')) {
                $fuelReport->counter_number = $request->counter_number;
            }
            if ($request->has('customer_account')) {
                $fuelReport->customer_account = $request->customer_account;
            }
            if ($request->has('ordered_by')) {
                $fuelReport->ordered_by = $request->ordered_by;
            }
            if ($request->has('special_instructions')) {
                $fuelReport->special_instructions = $request->special_instructions;
            }
            if ($request->has('sale_type')) {
                $fuelReport->sale_type = $request->sale_type;
            }
            if ($request->has('date')) {
                $fuelReport->date = $request->date;
            }
            if ($request->has('ship_via')) {
                $fuelReport->ship_via = $request->ship_via;
            }
            if ($request->has('line_items')) {
                $lineItems = $request->line_items;
                if (is_string($lineItems)) {
                    $decodedLineItems = json_decode($lineItems, true);
                    $fuelReport->line_items = $decodedLineItems !== null ? $decodedLineItems : [];
                } else {
                    $fuelReport->line_items = $lineItems ?? [];
                }
            }
            if ($request->has('sub_total')) {
                $fuelReport->sub_total = $request->sub_total;
            }
            if ($request->has('sales_tax')) {
                $fuelReport->sales_tax = $request->sales_tax;
            }
            if ($request->has('payment_method')) {
                $fuelReport->payment_method = $request->payment_method;
            }
            if ($request->has('payment_reference')) {
                $fuelReport->payment_reference = $request->payment_reference;
            }

            if ($fuelReport->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Fuel report updated successfully',
                    'data' => $fuelReport->load(['vehicle', 'vendor', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update fuel report'
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
            Log::error("Fuel report update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the fuel report. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report ID is required'
            ], 400);
        }

        $fuelReport = FuelReport::find($id);
        if (!$fuelReport) {
            return response()->json([
                'status' => false,
                'message' => 'Fuel report not found'
            ], 404);
        }

        if ($fuelReport->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Fuel report deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete fuel report'
            ], 500);
        }
    }

    public function download($id)
    {
        try {
            $fuelReport = FuelReport::with(['vehicle', 'vendor', 'user'])->find($id);

            if (!$fuelReport) {
                return response()->json(['status' => false, 'message' => 'Fuel report not found'], 404);
            }

            $lineItems = is_array($fuelReport->line_items)
                ? $fuelReport->line_items
                : (is_string($fuelReport->line_items)
                    ? json_decode($fuelReport->line_items, true) ?? []
                    : []);
            $setting = Setting::first();
            $fuels = Fuel::with(['vehicle', 'vendor'])
                ->when($fuelReport->vehicle_id, function ($q) use ($fuelReport) {
                    $q->where('vehicle_id', $fuelReport->vehicle_id);
                })
                ->when($fuelReport->start_date, function ($q) use ($fuelReport) {
                    $q->whereDate('date', '>=', $fuelReport->start_date);
                })
                ->when($fuelReport->end_date, function ($q) use ($fuelReport) {
                    $q->whereDate('date', '<=', $fuelReport->end_date);
                })
                ->get(['id', 'vehicle_id', 'vendor_id', 'fuel_type', 'unit_type', 'units', 'price_per_volume_unit', 'total_cost', 'vehicle_meter', 'previous_meter', 'date']);

            $data = [
                'fuelReport' => $fuelReport,
                'fuels' => $fuels,
                'lineItems' => $lineItems,
                'settings' => $setting
            ];

            $pdf = Pdf::loadView('fuelReport.fuelReportPdf', $data);
            $fileName = 'Fuel_Report_' . $fuelReport->id . '_' . date('Y-m-d') . '.pdf';

            return $pdf->download($fileName);
        } catch (\Exception $e) {
            Log::error('Fuel report download error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while generating the PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
