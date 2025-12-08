<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Auth;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => true,
                'reports' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 20,
                    'total' => 0,
                ]
            ]);
        }

        $searchTerm = $request->search ?? '';
        $status = $request->status ?? '';
        $reportType = $request->report_type ?? '';

        $query = DB::table('reports')
            ->leftJoin('users', 'reports.created_by', '=', 'users.id')
            ->select(
                'reports.*',
                'users.id as user_id',
                'users.first_name',
                'users.last_name'
            )
            ->orderBy('reports.id', 'desc');

        if (!empty($status)) {
            $query->where('reports.status', $status);
        }

        if (!empty($reportType)) {
            $query->where('reports.report_type', $reportType);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('reports.report_name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('reports.report_type', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $reports = $query->paginate(20);

        $formattedReports = $reports->getCollection()->map(function ($report) {
            return [
                'id' => $report->id,
                'report_type' => $report->report_type ?? null,
                'report_name' => $report->report_name ?? null,
                'generated_date' => $report->generated_date ?? $report->created_at ?? null,
                'status' => $report->status ?? 'Pending',
                'file_url' => $report->file_url ?? null,
                'created_by' => $report->user_id ? [
                    'id' => $report->user_id,
                    'first_name' => $report->first_name ?? null,
                    'last_name' => $report->last_name ?? null,
                ] : null,
                'created_at' => $report->created_at ?? null,
            ];
        });

        return response()->json([
            'status' => true,
            'reports' => [
                'data' => $formattedReports,
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => false,
                'message' => 'Reports table does not exist. Please run migrations first.'
            ], 500);
        }

        $validator = Validator::make($request->all(), [
            'report_type' => 'required|string|max:255',
            'report_name' => 'nullable|string|max:255',
            'filters' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reportId = DB::table('reports')->insertGetId([
                'report_type' => $request->report_type,
                'report_name' => $request->report_name ?? $request->report_type . ' Report',
                'status' => 'Generating',
                'created_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Report generation started',
                'report' => ['id' => $reportId]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to create report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => false,
                'message' => 'Report not found'
            ], 404);
        }

        $report = DB::table('reports')
            ->leftJoin('users', 'reports.created_by', '=', 'users.id')
            ->where('reports.id', $id)
            ->select(
                'reports.*',
                'users.id as user_id',
                'users.first_name',
                'users.last_name'
            )
            ->first();

        if (!$report) {
            return response()->json([
                'status' => false,
                'message' => 'Report not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'report' => [
                'id' => $report->id,
                'report_type' => $report->report_type ?? null,
                'report_name' => $report->report_name ?? null,
                'generated_date' => $report->generated_date ?? $report->created_at ?? null,
                'status' => $report->status ?? 'Pending',
                'file_url' => $report->file_url ?? null,
                'created_by' => $report->user_id ? [
                    'id' => $report->user_id,
                    'first_name' => $report->first_name ?? null,
                    'last_name' => $report->last_name ?? null,
                ] : null,
                'created_at' => $report->created_at ?? null,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => false,
                'message' => 'Reports table does not exist. Please run migrations first.'
            ], 500);
        }

        $validator = Validator::make($request->all(), [
            'report_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Generating,Completed,Failed',
            'file_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];
            if ($request->has('report_name')) {
                $updateData['report_name'] = $request->report_name;
            }
            if ($request->has('status')) {
                $updateData['status'] = $request->status;
            }
            if ($request->has('file_url')) {
                $updateData['file_url'] = $request->file_url;
            }
            if ($request->has('status') && $request->status === 'Completed') {
                $updateData['generated_date'] = now();
            }

            $updateData['updated_at'] = now();

            DB::table('reports')->where('id', $id)->update($updateData);

            return response()->json([
                'status' => true,
                'message' => 'Report updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => false,
                'message' => 'Report not found'
            ], 404);
        }

        try {
            $deleted = DB::table('reports')->where('id', $id)->delete();

            if ($deleted) {
                return response()->json([
                    'status' => true,
                    'message' => 'Report deleted successfully'
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Report not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function download($id)
    {
        if (!Schema::hasTable('reports')) {
            return response()->json([
                'status' => false,
                'message' => 'Report file not found'
            ], 404);
        }

        $report = DB::table('reports')->where('id', $id)->first();

        if (!$report || !$report->file_url) {
            return response()->json([
                'status' => false,
                'message' => 'Report file not found'
            ], 404);
        }

        $filePath = storage_path('app/' . $report->file_url);

        if (!file_exists($filePath)) {
            return response()->json([
                'status' => false,
                'message' => 'Report file does not exist'
            ], 404);
        }

        return response()->download($filePath);
    }
}

