<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MMRReport;
use App\Models\Vehical;
use Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MMRReportController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('mmr_reports');
        $query = MMRReport::with(['vehicle', 'user'])->orderBy('created_at', 'desc');
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at', 'maintenance_records'])) {
                        $q->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });
        }

        if (!empty($request->page) && $request->page !== "page") {
            $reports = $query->paginate(20);
            return response()->json(['status' => true, 'mmrReport' => $reports]);
        } else {
            $reports = $query->get();
            return response()->json(['status' => true, 'mmrReport' => $reports]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'date' => 'required|date',
                'domicile_station' => 'required|string|max:255',
                'provider_company_name' => 'required|string|max:255',
                'current_mileage' => 'nullable|string|max:255',
                'vehicle_id' => 'required|exists:vehicals,id',
                'preventative_maintenance' => 'nullable|boolean',
                'out_of_service' => 'nullable|boolean',
                'signature' => 'nullable|string|max:255',
                'completed_date' => 'required|date',
            ]);

            DB::beginTransaction();

            $mmrReport = new MMRReport;
            $mmrReport->user_id = Auth::user()->id;
            $mmrReport->date = $validatedData['date'];
            $mmrReport->domicile_station = $validatedData['domicile_station'] ?? null;
            $mmrReport->provider_company_name = $validatedData['provider_company_name'] ?? null;
            $mmrReport->current_mileage = $validatedData['current_mileage'] ?? null;
            $mmrReport->vehicle_id = $validatedData['vehicle_id'];
            $mmrReport->preventative_maintenance = $validatedData['preventative_maintenance'] ?? null;
            $mmrReport->out_of_service = $validatedData['out_of_service'] ?? null;
            $mmrReport->signature = $validatedData['signature'] ?? null;
            $mmrReport->completed_date = $validatedData['completed_date'] ?? null;

            if ($mmrReport->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'MMR report saved successfully',
                    'mmrReport' => $mmrReport
                ]);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to save MMR report'], 500);
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
            \Log::error('MMR report store error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while saving the MMR report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $mmrReport = MMRReport::with(['vehicle', 'user'])->find($id);
        
        if ($mmrReport) {
            return response()->json(['status' => true, 'mmrReport' => $mmrReport]);
        } else {
            return response()->json(['status' => false, 'message' => 'MMR report not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $mmrReport = MMRReport::find($id);
            
            if (!$mmrReport) {
                return response()->json(['status' => false, 'message' => 'MMR report not found'], 404);
            }

            $validatedData = $request->validate([
                'date' => 'required|date',
                'domicile_station' => 'required|string|max:255',
                'provider_company_name' => 'required|string|max:255',
                'current_mileage' => 'nullable|string|max:255',
                'vehicle_id' => 'required|exists:vehicals,id',
                'preventative_maintenance' => 'nullable|boolean',
                'out_of_service' => 'nullable|boolean',
                'signature' => 'nullable|string|max:255',
                'completed_date' => 'required|date',
            ]);

            DB::beginTransaction();

            $mmrReport->date = $validatedData['date'];
            $mmrReport->domicile_station = $validatedData['domicile_station'] ?? null;
            $mmrReport->provider_company_name = $validatedData['provider_company_name'] ?? null;
            $mmrReport->current_mileage = $validatedData['current_mileage'] ?? null;
            $mmrReport->vehicle_id = $validatedData['vehicle_id'];
            $mmrReport->preventative_maintenance = $validatedData['preventative_maintenance'] ?? null;
            $mmrReport->out_of_service = $validatedData['out_of_service'] ?? null;
            $mmrReport->signature = $validatedData['signature'] ?? null;
            $mmrReport->completed_date = $validatedData['completed_date'] ?? null;

            if ($mmrReport->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'MMR report updated successfully',
                    'mmrReport' => $mmrReport
                ]);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to update MMR report'], 500);
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
            \Log::error('MMR report update error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the MMR report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $mmrReport = MMRReport::find($id);
            
            if (!$mmrReport) {
                return response()->json(['status' => false, 'message' => 'MMR report not found'], 404);
            }

            if ($mmrReport->delete()) {
                return response()->json(['status' => true, 'message' => 'MMR report deleted successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to delete MMR report'], 500);
            }
        } catch (\Exception $e) {
            \Log::error('MMR report delete error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the MMR report',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

