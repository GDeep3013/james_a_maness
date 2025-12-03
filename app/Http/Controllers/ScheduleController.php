<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\Vehical;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Auth;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('schedules');
        $query = Schedule::with([
            'vehicle:id,vehicle_name',
            'user:id,name'
        ])->orderBy('id', 'desc');
        
        $searchTerm = $request->search;

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'watchers') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) use ($searchTerm) {
                $q->where('vehicle_name', 'LIKE', '%' . $searchTerm . '%');
            });

        }

        $schedules = $query->paginate(20);

        $schedules->getCollection()->transform(function ($schedule) {
            if ($schedule->service_task_ids && is_array($schedule->service_task_ids)) {
                $schedule->service_tasks = \App\Models\ServiceTask::whereIn('id', $schedule->service_task_ids)
                    ->get(['id', 'name']);
            } else {
                $schedule->service_tasks = collect([]);
            }
            return $schedule;
        });

        return response()->json(['status' => true, 'schedules' => $schedules]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'service_task_ids' => 'required|array',
                'service_task_ids.*' => 'exists:service_tasks,id',
                'notifications_enabled' => 'nullable',
                'watchers' => 'nullable|array',
                'watchers.*' => 'exists:contacts,id',
                'next_due_date' => 'required|date',
                'next_due_meter' => 'required|string|max:255',
                'status' => 'nullable|in:active,inactive,completed',
            ]);

            DB::beginTransaction();

            $schedule = new Schedule;
            $schedule->user_id = Auth::id();
            $schedule->vehicle_id = $request->vehicle_id;
            
            if ($request->has('service_task_ids') && is_array($request->service_task_ids)) {
                $schedule->service_task_ids = array_map('intval', $request->service_task_ids);
            }
            
            $schedule->notifications_enabled = $this->convertToBoolean($request->notifications_enabled, true);
            
            if ($request->has('watchers') && is_array($request->watchers)) {
                $schedule->watchers = $request->watchers;
            } else {
                $schedule->watchers = null;
            }
            
            if ($request->has('next_due_date')) {
                $schedule->next_due_date = $request->next_due_date;
            }

            if ($request->has('next_due_meter')) {
                $schedule->next_due_meter = $request->next_due_meter;
            }
            
            $schedule->status = $request->status ?? 'active';

            if ($schedule->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Schedule created successfully',
                    'data' => $schedule->load(['vehicle', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create schedule'
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
            Log::error("Schedule creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the schedule. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule ID is required'
            ], 400);
        }

        $schedule = Schedule::with(['vehicle', 'user'])->where('id', $id)->first();

        if ($schedule) {
            return response()->json([
                'status' => true,
                'message' => 'Schedule retrieved successfully',
                'schedule' => $schedule
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Schedule not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule ID is required'
            ], 400);
        }

        $schedule = Schedule::with([
            'vehicle:id,vehicle_name',
            'serviceTask:id,name',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($schedule) {
            return response()->json([
                'status' => true,
                'message' => 'Schedule data',
                'data' => $schedule
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Schedule not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule ID is required'
            ], 400);
        }

        $schedule = Schedule::find($id);
        if (!$schedule) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'service_task_ids' => 'nullable|array',
                'service_task_ids.*' => 'exists:service_tasks,id',
                'notifications_enabled' => 'nullable',
                'watchers' => 'nullable|array',
                'watchers.*' => 'exists:contacts,id',
                'next_due_date' => 'required|date',
                'next_due_meter' => 'required|string|max:255',
                'last_completed_date' => 'nullable|date',
                'last_completed_meter' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive,completed',
            ]);

            DB::beginTransaction();

            if ($request->has('vehicle_id')) {
                $schedule->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('service_task_ids') && is_array($request->service_task_ids)) {
                $schedule->service_task_ids = array_map('intval', $request->service_task_ids);
            }
            if ($request->has('notifications_enabled')) {
                $schedule->notifications_enabled = $this->convertToBoolean($request->notifications_enabled, true);
            }
            if ($request->has('watchers')) {
                if (is_array($request->watchers)) {
                    $schedule->watchers = $request->watchers;
                } else {
                    $schedule->watchers = null;
                }
            }
            
            if ($request->has('last_completed_date')) {
                $schedule->last_completed_date = $request->last_completed_date;
            }
            if ($request->has('last_completed_meter')) {
                $schedule->last_completed_meter = $request->last_completed_meter;
            }
            
            if ($request->has('next_due_date')) {
                $schedule->next_due_date = $request->next_due_date;
            }
            
            if ($request->has('next_due_meter')) {
                $schedule->next_due_meter = $request->next_due_meter;
            }
            if ($request->has('status')) {
                $schedule->status = $request->status;
            }

            if ($schedule->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Schedule updated successfully',
                    'data' => $schedule->load(['vehicle', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update schedule'
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
            Log::error("Schedule update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the schedule. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule ID is required'
            ], 400);
        }

        $schedule = Schedule::find($id);
        if (!$schedule) {
            return response()->json([
                'status' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        if ($schedule->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Schedule deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete schedule'
            ], 500);
        }
    }

    public function checkServiceTaskLogged(Request $request)
    {
        $vehicleId = $request->vehicle_id;
        $serviceTaskId = $request->service_task_id;

        if (empty($vehicleId) || empty($serviceTaskId)) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle ID and Service Task ID are required'
            ], 400);
        }

        $hasBeenLogged = Schedule::where('vehicle_id', $vehicleId)
            ->whereJsonContains('service_task_ids', (int)$serviceTaskId)
            ->whereNotNull('last_completed_date')
            ->exists();

        return response()->json([
            'status' => true,
            'never_logged' => !$hasBeenLogged
        ]);
    }

}

