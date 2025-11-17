<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Issue;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;

class IssueController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthenticated'
            ], 401);
        }

        $tableColumns = Schema::getColumnListing('issues');
        $query = Issue::with([
            'vehicle:id,vehicle_name',
            'assignedTo:id,first_name,last_name',
            'workOrder:id,status'
        ])->orderBy('id', 'desc');
        
        // Filter issues: user can only see issues they reported or are assigned to them
        $userContact = \App\Models\Contact::where('user_id', $user->id)->first();
        $query->where(function ($q) use ($user, $userContact) {
            // Issues reported by the user (reported_by matches user's name)
            $q->where('reported_by', $user->id);
            
            // Issues assigned to the user (if user has a contact record)
            if ($userContact) {
                $q->orWhere('assigned_to', $userContact->id);
            }
        });
        
        $searchTerm = $request->search;

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'labels') {
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
        }

        $issues = $query->paginate(20);

        return response()->json(['status' => true, 'issues' => $issues]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'work_order_id' => 'nullable|exists:work_orders,id',
                'vehicle_id' => 'required|exists:vehicals,id',
                'priority' => 'nullable|in:,low,medium,high,urgent',
                'reported_date' => 'required|date',
                'reported_time' => 'nullable',
                'summary' => 'required|string|max:255',
                'description' => 'nullable|string',
                'labels' => 'nullable|string',
                'primary_meter' => 'nullable|numeric',
                'primary_meter_void' => 'nullable',
                'reported_by' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:contacts,id',
                'due_date' => 'nullable|date',
                'primary_meter_due' => 'nullable|numeric',
                'status' => 'nullable|in:Open,Overdue,Resolved,Closed',
            ]);

            DB::beginTransaction();

            $reportedDateTime = $validatedData['reported_date'];
            if (!empty($request->reported_time)) {
                $reportedDateTime = $validatedData['reported_date'] . ' ' . $request->reported_time . ':00';
            }

            $issue = new Issue;
            $issue->work_order_id = $request->work_order_id ?? null;
            $issue->vehicle_id = $validatedData['vehicle_id'];
            $issue->priority = $request->priority ?? null;
            $issue->reported_date = $reportedDateTime;
            $issue->summary = $validatedData['summary'];
            $issue->description = $request->description ?? null;
            $issue->labels = $request->labels ?? null;
            $issue->primary_meter = $request->primary_meter ?? null;
            $issue->primary_meter_void = $this->convertToBoolean($request->primary_meter_void, false);
            $issue->reported_by = $request->reported_by ?? null;
            $issue->assigned_to = $request->assigned_to ?? null;
            $issue->due_date = $request->due_date ?? null;
            $issue->primary_meter_due = $request->primary_meter_due ?? null;
            $issue->status = $request->status ?? 'Open';

            if ($issue->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,  
                    'message' => 'Issue created successfully',
                    'data' => $issue->load(['vehicle', 'assignedTo', 'workOrder'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false, 
                    'message' => 'Failed to create issue'
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
            Log::error("Issue creation error: " . $e->getMessage());
            return response()->json([
                'status' => false, 
                'message' => 'An error occurred while creating the issue. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthenticated'
            ], 401);
        }

        if (empty($id)) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue ID is required'
            ], 400);
        }

        $issue = Issue::with([
            'vehicle:id,vehicle_name',
            'assignedTo:id,first_name,last_name',
            'workOrder:id,status'
        ])->where('id', $id)->first();

        if (!$issue) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue not found'
            ], 404);
        }

        // Check if user has permission to view this issue
        $userContact = \App\Models\Contact::where('user_id', $user->id)->first();
        $canView = false;
        
        // User can view if they reported it
        if ($issue->reported_by == $user->id) {
            $canView = true;
        }
        
        // User can view if it's assigned to them
        if ($userContact && $issue->assigned_to == $userContact->id) {
            $canView = true;
        }

        if (!$canView) {
            return response()->json([
                'status' => false, 
                'message' => 'You do not have permission to view this issue'
            ], 403);
        }

        return response()->json([
            'status' => true, 
            'message' => 'Issue retrieved successfully',
            'issue' => $issue
        ]);
    }

    public function edit($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthenticated'
            ], 401);
        }

        if (empty($id)) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue ID is required'
            ], 400);
        }

        $issue = Issue::with([
            'vehicle:id,vehicle_name',
            'assignedTo:id,first_name,last_name',
            'workOrder:id,status'
        ])->where('id', $id)->first();

        if (!$issue) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue not found'
            ], 404);
        }

        // Check if user has permission to edit this issue
        $userContact = \App\Models\Contact::where('user_id', $user->id)->first();
        $canEdit = false;
        
        // User can edit if they reported it
        if ($issue->reported_by == $user->id) {
            $canEdit = true;
        }
        
        // User can edit if it's assigned to them
        if ($userContact && $issue->assigned_to == $userContact->id) {
            $canEdit = true;
        }

        if (!$canEdit) {
            return response()->json([
                'status' => false, 
                'message' => 'You do not have permission to edit this issue'
            ], 403);
        }

        return response()->json([
            'status' => true, 
            'message' => 'Issue data',
            'data' => $issue
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthenticated'
            ], 401);
        }

        if (empty($id)) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue ID is required'
            ], 400);
        }

        $issue = Issue::find($id);
        if (!$issue) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue not found'
            ], 404);
        }

        // Check if user has permission to update this issue
        $userContact = \App\Models\Contact::where('user_id', $user->id)->first();
        $canUpdate = false;
        
        // User can update if they reported it
        if ($issue->reported_by == $user->id) {
            $canUpdate = true;
        }
        
        // User can update if it's assigned to them
        if ($userContact && $issue->assigned_to == $userContact->id) {
            $canUpdate = true;
        }

        if (!$canUpdate) {
            return response()->json([
                'status' => false, 
                'message' => 'You do not have permission to update this issue'
            ], 403);
        }

        try {
            $validatedData = $request->validate([
                'work_order_id' => 'nullable|exists:work_orders,id',
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'priority' => 'nullable|in:,low,medium,high,urgent',
                'reported_date' => 'nullable|date',
                'reported_time' => 'nullable',
                'summary' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'labels' => 'nullable|string',
                'primary_meter' => 'nullable|numeric',
                'primary_meter_void' => 'nullable',
                'reported_by' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:contacts,id',
                'due_date' => 'nullable|date',
                'primary_meter_due' => 'nullable|numeric',
                'status' => 'nullable|in:Open,Overdue,Resolved,Closed',
            ]);

            DB::beginTransaction();

            if ($request->has('work_order_id')) {
                $issue->work_order_id = $request->work_order_id;
            }
            if ($request->has('vehicle_id')) {
                $issue->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('priority')) {
                $issue->priority = $request->priority;
            }
            if ($request->has('reported_date')) {
                $reportedDateTime = $request->reported_date;
                if (!empty($request->reported_time)) {
                    $reportedDateTime = $request->reported_date . ' ' . $request->reported_time . ':00';
                }
                $issue->reported_date = $reportedDateTime;
            }
            if ($request->has('summary')) {
                $issue->summary = $request->summary;
            }
            if ($request->has('description')) {
                $issue->description = $request->description;
            }
            if ($request->has('labels')) {
                $issue->labels = $request->labels;
            }
            if ($request->has('primary_meter')) {
                $issue->primary_meter = $request->primary_meter;
            }
            if ($request->has('primary_meter_void')) {
                $issue->primary_meter_void = $this->convertToBoolean($request->primary_meter_void, false);
            }
            if ($request->has('reported_by')) {
                $issue->reported_by = $request->reported_by;
            }
            if ($request->has('assigned_to')) {
                $issue->assigned_to = $request->assigned_to;
            }
            if ($request->has('due_date')) {
                $issue->due_date = $request->due_date;
            }
            if ($request->has('primary_meter_due')) {
                $issue->primary_meter_due = $request->primary_meter_due;
            }
            if ($request->has('status')) {
                $issue->status = $request->status;
            }

            if ($issue->save()) {
                DB::commit();
                return response()->json([
                    'status' => true, 
                    'message' => 'Issue updated successfully',
                    'data' => $issue->load(['vehicle', 'assignedTo', 'workOrder'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false, 
                    'message' => 'Failed to update issue'
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
            Log::error("Issue update error: " . $e->getMessage());
            return response()->json([
                'status' => false, 
                'message' => 'An error occurred while updating the issue. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthenticated'
            ], 401);
        }

        if (empty($id)) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue ID is required'
            ], 400);
        }

        $issue = Issue::find($id);
        if (!$issue) {
            return response()->json([
                'status' => false, 
                'message' => 'Issue not found'
            ], 404);
        }

        // Check if user has permission to delete this issue
        $userContact = \App\Models\Contact::where('user_id', $user->id)->first();
        $canDelete = false;
        
        // User can delete if they reported it
        if ($issue->reported_by == $user->id) {
            $canDelete = true;
        }
        
        // // User can delete if it's assigned to them
        // if ($userContact && $issue->assigned_to == $userContact->id) {
        //     $canDelete = true;
        // }

        if (!$canDelete) {
            return response()->json([
                'status' => false, 
                'message' => 'You do not have permission to delete this issue'
            ], 403);
        }

        if ($issue->delete()) {
            return response()->json([
                'status' => true, 
                'message' => 'Issue deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false, 
                'message' => 'Failed to delete issue'
            ], 500);
        }
    }

}

