<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceReminder;
use App\Models\Vehical;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Auth;

class ServiceReminderController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('service_reminders');
        $query = ServiceReminder::with([
            'vehicle:id,vehicle_name',
            'serviceTask:id,name',
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

            $query->orWhereHas('serviceTask', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $serviceReminders = $query->paginate(20);

        return response()->json(['status' => true, 'service_reminders' => $serviceReminders]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'service_task_id' => 'required|exists:service_tasks,id',
                'time_interval_value' => 'nullable|string|max:255',
                'time_interval_unit' => 'nullable|string|max:255',
                'time_due_soon_threshold_value' => 'nullable|string|max:255',
                'time_due_soon_threshold_unit' => 'nullable|string|max:255',
                'primary_meter_interval_value' => 'nullable|string|max:255',
                'primary_meter_interval_unit' => 'nullable|string|max:255',
                'primary_meter_due_soon_threshold_value' => 'nullable|string|max:255',
                'manually_set_next_reminder' => 'nullable',
                'notifications_enabled' => 'nullable',
                'watchers' => 'nullable|array',
                'watchers.*' => 'exists:contacts,id',
                'next_due_date' => 'nullable|date',
                'next_due_meter' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive,completed',
            ]);

            DB::beginTransaction();

            $serviceReminder = new ServiceReminder;
            $serviceReminder->user_id = Auth::id();
            $serviceReminder->vehicle_id = $request->vehicle_id;
            $serviceReminder->service_task_id = $request->service_task_id;
            $serviceReminder->time_interval_value = $request->time_interval_value ?? null;
            $serviceReminder->time_interval_unit = $request->time_interval_unit ?? null;
            $serviceReminder->time_due_soon_threshold_value = $request->time_due_soon_threshold_value ?? null;
            $serviceReminder->time_due_soon_threshold_unit = $request->time_due_soon_threshold_unit ?? null;
            $serviceReminder->primary_meter_interval_value = $request->primary_meter_interval_value ?? null;
            $serviceReminder->primary_meter_interval_unit = $request->primary_meter_interval_unit ?? null;
            $serviceReminder->primary_meter_due_soon_threshold_value = $request->primary_meter_due_soon_threshold_value ?? null;
            $serviceReminder->manually_set_next_reminder = $this->convertToBoolean($request->manually_set_next_reminder, false);
            $serviceReminder->notifications_enabled = $this->convertToBoolean($request->notifications_enabled, true);
            
            if ($request->has('watchers') && is_array($request->watchers)) {
                $serviceReminder->watchers = $request->watchers;
            } else {
                $serviceReminder->watchers = null;
            }
            
            $manuallySet = $this->convertToBoolean($request->manually_set_next_reminder, false);
            
            if ($manuallySet) {

                if ($request->has('next_due_date')) {   
                $serviceReminder->next_due_date = $request->next_due_date;
                }

                if ($request->has('next_due_meter')) {
                    $serviceReminder->next_due_meter = $request->next_due_meter;
                }

            } else {
                $serviceReminder->next_due_date = $this->calculateNextDueDate(
                    $request->time_interval_value,
                    $request->time_interval_unit,
                    null
                );
                $serviceReminder->next_due_meter = $this->calculateNextDueMeter(
                    $request->vehicle_id,
                    $request->primary_meter_interval_value,
                    $request->primary_meter_interval_unit,
                    null
                );
            }
            
            $serviceReminder->status = $request->status ?? 'active';

            if ($serviceReminder->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service reminder created successfully',
                    'data' => $serviceReminder->load(['vehicle', 'serviceTask', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create service reminder'
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
            Log::error("Service reminder creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the service reminder. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder ID is required'
            ], 400);
        }

        $serviceReminder = ServiceReminder::with(['vehicle', 'serviceTask', 'user'])->where('id', $id)->first();

        if ($serviceReminder) {
            return response()->json([
                'status' => true,
                'message' => 'Service reminder retrieved successfully',
                'service_reminder' => $serviceReminder
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder ID is required'
            ], 400);
        }

        $serviceReminder = ServiceReminder::with([
            'vehicle:id,vehicle_name',
            'serviceTask:id,name',
            'user:id,name'
        ])->where('id', $id)->first();

        if ($serviceReminder) {
            return response()->json([
                'status' => true,
                'message' => 'Service reminder data',
                'data' => $serviceReminder
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder ID is required'
            ], 400);
        }

        $serviceReminder = ServiceReminder::find($id);
        if (!$serviceReminder) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder not found'
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'service_task_id' => 'nullable|exists:service_tasks,id',
                'time_interval_value' => 'nullable|string|max:255',
                'time_interval_unit' => 'nullable|string|max:255',
                'time_due_soon_threshold_value' => 'nullable|string|max:255',
                'time_due_soon_threshold_unit' => 'nullable|string|max:255',
                'primary_meter_interval_value' => 'nullable|string|max:255',
                'primary_meter_interval_unit' => 'nullable|string|max:255',
                'primary_meter_due_soon_threshold_value' => 'nullable|string|max:255',
                'manually_set_next_reminder' => 'nullable',
                'notifications_enabled' => 'nullable',
                'watchers' => 'nullable|array',
                'watchers.*' => 'exists:contacts,id',
                'next_due_date' => 'nullable|date',
                'next_due_meter' => 'nullable|string|max:255',
                'last_completed_date' => 'nullable|date',
                'last_completed_meter' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive,completed',
            ]);

            DB::beginTransaction();

            if ($request->has('vehicle_id')) {
                $serviceReminder->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('service_task_id')) {
                $serviceReminder->service_task_id = $request->service_task_id;
            }
            if ($request->has('time_interval_value')) {
                $serviceReminder->time_interval_value = $request->time_interval_value;
            }
            if ($request->has('time_interval_unit')) {
                $serviceReminder->time_interval_unit = $request->time_interval_unit;
            }
            if ($request->has('time_due_soon_threshold_value')) {
                $serviceReminder->time_due_soon_threshold_value = $request->time_due_soon_threshold_value;
            }
            if ($request->has('time_due_soon_threshold_unit')) {
                $serviceReminder->time_due_soon_threshold_unit = $request->time_due_soon_threshold_unit;
            }
            if ($request->has('primary_meter_interval_value')) {
                $serviceReminder->primary_meter_interval_value = $request->primary_meter_interval_value;
            }
            if ($request->has('primary_meter_interval_unit')) {
                $serviceReminder->primary_meter_interval_unit = $request->primary_meter_interval_unit;
            }
            if ($request->has('primary_meter_due_soon_threshold_value')) {
                $serviceReminder->primary_meter_due_soon_threshold_value = $request->primary_meter_due_soon_threshold_value;
            }
            if ($request->has('manually_set_next_reminder')) {
                $serviceReminder->manually_set_next_reminder = $this->convertToBoolean($request->manually_set_next_reminder, false);
            }
            if ($request->has('notifications_enabled')) {
                $serviceReminder->notifications_enabled = $this->convertToBoolean($request->notifications_enabled, true);
            }
            if ($request->has('watchers')) {
                if (is_array($request->watchers)) {
                    $serviceReminder->watchers = $request->watchers;
                } else {
                    $serviceReminder->watchers = null;
                }
            }
            
            if ($request->has('last_completed_date')) {
                $serviceReminder->last_completed_date = $request->last_completed_date;
            }
            if ($request->has('last_completed_meter')) {
                $serviceReminder->last_completed_meter = $request->last_completed_meter;
            }
            
            $manuallySet = $serviceReminder->manually_set_next_reminder;
            $intervalChanged = $request->has('time_interval_value') || $request->has('time_interval_unit') || 
                              $request->has('primary_meter_interval_value') || $request->has('primary_meter_interval_unit');
            $completedChanged = $request->has('last_completed_date') || $request->has('last_completed_meter');
            $manuallySetChanged = $request->has('manually_set_next_reminder');
            
            if ($manuallySet && !$manuallySetChanged && !$intervalChanged && !$completedChanged) {
                if ($request->has('next_due_date')) {
                    $serviceReminder->next_due_date = $request->next_due_date;
                }
                if ($request->has('next_due_meter')) {
                    $serviceReminder->next_due_meter = $request->next_due_meter;
                }
            } else {
                $timeIntervalValue = $request->has('time_interval_value') ? $request->time_interval_value : $serviceReminder->time_interval_value;
                $timeIntervalUnit = $request->has('time_interval_unit') ? $request->time_interval_unit : $serviceReminder->time_interval_unit;
                
                if ($timeIntervalValue && $timeIntervalUnit) {
                    $serviceReminder->next_due_date = $this->calculateNextDueDate(
                        $timeIntervalValue,
                        $timeIntervalUnit,
                        $serviceReminder->last_completed_date
                    );
                }
                
                $vehicleId = $request->has('vehicle_id') ? $request->vehicle_id : $serviceReminder->vehicle_id;
                $meterIntervalValue = $request->has('primary_meter_interval_value') ? $request->primary_meter_interval_value : $serviceReminder->primary_meter_interval_value;
                $meterIntervalUnit = $request->has('primary_meter_interval_unit') ? $request->primary_meter_interval_unit : $serviceReminder->primary_meter_interval_unit;
                
                if ($vehicleId && $meterIntervalValue && $meterIntervalUnit) {
                    $serviceReminder->next_due_meter = $this->calculateNextDueMeter(
                        $vehicleId,
                        $meterIntervalValue,
                        $meterIntervalUnit,
                        $serviceReminder->last_completed_meter
                    );
                }
            }
            if ($request->has('status')) {
                $serviceReminder->status = $request->status;
            }

            if ($serviceReminder->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service reminder updated successfully',
                    'data' => $serviceReminder->load(['vehicle', 'serviceTask', 'user'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update service reminder'
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
            Log::error("Service reminder update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the service reminder. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder ID is required'
            ], 400);
        }

        $serviceReminder = ServiceReminder::find($id);
        if (!$serviceReminder) {
            return response()->json([
                'status' => false,
                'message' => 'Service reminder not found'
            ], 404);
        }

        if ($serviceReminder->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Service reminder deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete service reminder'
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

        $hasBeenLogged = ServiceReminder::where('vehicle_id', $vehicleId)
            ->where('service_task_id', $serviceTaskId)
            ->whereNotNull('last_completed_date')
            ->exists();

        return response()->json([
            'status' => true,
            'never_logged' => !$hasBeenLogged
        ]);
    }

    private function calculateNextDueDate($intervalValue, $intervalUnit, $lastCompletedDate = null)
    {
        if (!$intervalValue || !$intervalUnit) {
            return null;
        }

        $baseDate = $lastCompletedDate ? Carbon::parse($lastCompletedDate) : Carbon::now();
        $value = (float) $intervalValue;
        $unit = strtolower(trim(preg_replace('/[()]/', '', $intervalUnit)));

        if (strpos($unit, 'day') !== false) {
            return $baseDate->copy()->addDays($value)->format('Y-m-d');
        } elseif (strpos($unit, 'week') !== false) {
            return $baseDate->copy()->addWeeks($value)->format('Y-m-d');
        } elseif (strpos($unit, 'month') !== false) {
            return $baseDate->copy()->addMonths($value)->format('Y-m-d');
        } elseif (strpos($unit, 'year') !== false) {
            return $baseDate->copy()->addYears($value)->format('Y-m-d');
        }

        return null;
    }

    private function calculateNextDueMeter($vehicleId, $intervalValue, $intervalUnit, $lastCompletedMeter = null)
    {
        if (!$vehicleId || !$intervalValue || !$intervalUnit) {
            return null;
        }

        $vehicle = Vehical::find($vehicleId);
        if (!$vehicle) {
            return null;
        }

        $baseMeter = $lastCompletedMeter 
            ? (float) $lastCompletedMeter 
            : ($vehicle->current_mileage ? (float) $vehicle->current_mileage : 0);

        if ($baseMeter <= 0) {
            return null;
        }

        $value = (float) $intervalValue;
        $nextDueMeter = $baseMeter + $value;

        return (string) $nextDueMeter;
    }
}

