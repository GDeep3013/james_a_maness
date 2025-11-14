<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceTask;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;

class ServiceTaskController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('service_tasks');
        $query = ServiceTask::with(['subtasks'])->orderBy('id', 'desc');
        
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });
        }

        $serviceTasks = $query->paginate(20);

        return response()->json(['status' => true, 'service_tasks' => $serviceTasks]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'labor_cost' => 'nullable|numeric|min:0',
                'subtasks' => 'nullable|array',
                'subtasks.*' => 'exists:service_tasks,id',
            ]);

            DB::beginTransaction();

            $serviceTask = new ServiceTask;
            $serviceTask->name = $validatedData['name'];
            $serviceTask->description = $request->description ?? null;
            $serviceTask->labor_cost = $request->labor_cost ?? null;

            if ($serviceTask->save()) {
                // Attach subtasks if provided
                if ($request->has('subtasks') && is_array($request->subtasks)) {
                    // Validate that subtasks don't have their own subtasks
                    foreach ($request->subtasks as $subtaskId) {
                        $subtask = ServiceTask::find($subtaskId);
                        if ($subtask && $subtask->hasSubtasks()) {
                            DB::rollBack();
                            return response()->json([
                                'status' => false,
                                'message' => 'Only Service Tasks without Subtasks can be added.',
                                'errors' => ['subtasks' => ['Only Service Tasks without Subtasks can be added.']]
                            ], 422);
                        }
                    }
                    $serviceTask->subtasks()->sync($request->subtasks);
                }

                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service task created successfully',
                    'data' => $serviceTask->load('subtasks')
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create service task'
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
            Log::error("Service task creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the service task. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service task ID is required'
            ], 400);
        }

        $serviceTask = ServiceTask::with(['subtasks'])->where('id', $id)->first();

        if ($serviceTask) {
            return response()->json([
                'status' => true,
                'message' => 'Service task retrieved successfully',
                'service_task' => $serviceTask
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service task not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service task ID is required'
            ], 400);
        }

        $serviceTask = ServiceTask::with(['subtasks'])->where('id', $id)->first();

        if ($serviceTask) {
            return response()->json([
                'status' => true,
                'message' => 'Service task data',
                'data' => $serviceTask
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Service task not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service task ID is required'
            ], 400);
        }

        $serviceTask = ServiceTask::find($id);
        if (!$serviceTask) {
            return response()->json([
                'status' => false,
                'message' => 'Service task not found'
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'labor_cost' => 'nullable|numeric|min:0',
                'subtasks' => 'nullable|array',
                'subtasks.*' => 'exists:service_tasks,id',
            ]);

            DB::beginTransaction();

            if ($request->has('name')) {
                $serviceTask->name = $request->name;
            }
            if ($request->has('description')) {
                $serviceTask->description = $request->description;
            }
            if ($request->has('labor_cost')) {
                $serviceTask->labor_cost = $request->labor_cost;
            }

            if ($serviceTask->save()) {
                // Update subtasks if provided
                if ($request->has('subtasks')) {
                    // Validate that subtasks don't have their own subtasks
                    if (is_array($request->subtasks)) {
                        foreach ($request->subtasks as $subtaskId) {
                            if ($subtaskId == $id) {
                                DB::rollBack();
                                return response()->json([
                                    'status' => false,
                                    'message' => 'A service task cannot be its own subtask.',
                                    'errors' => ['subtasks' => ['A service task cannot be its own subtask.']]
                                ], 422);
                            }
                            $subtask = ServiceTask::find($subtaskId);
                            if ($subtask && $subtask->hasSubtasks()) {
                                DB::rollBack();
                                return response()->json([
                                    'status' => false,
                                    'message' => 'Only Service Tasks without Subtasks can be added.',
                                    'errors' => ['subtasks' => ['Only Service Tasks without Subtasks can be added.']]
                                ], 422);
                            }
                        }
                        $serviceTask->subtasks()->sync($request->subtasks);
                    } else {
                        $serviceTask->subtasks()->detach();
                    }
                }

                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Service task updated successfully',
                    'data' => $serviceTask->load('subtasks')
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update service task'
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
            Log::error("Service task update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the service task. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Service task ID is required'
            ], 400);
        }

        $serviceTask = ServiceTask::find($id);
        if (!$serviceTask) {
            return response()->json([
                'status' => false,
                'message' => 'Service task not found'
            ], 404);
        }

        if ($serviceTask->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Service task deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete service task'
            ], 500);
        }
    }

    public function getAvailableSubtasks(Request $request)
    {
        $query = ServiceTask::whereDoesntHave('subtasks');

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        if ($request->has('exclude_id') && !empty($request->exclude_id)) {
            $query->where('id', '!=', $request->exclude_id);
        }

        $serviceTasks = $query->get(['id', 'name']);

        return response()->json([
            'status' => true,
            'service_tasks' => $serviceTasks
        ]);
    }
}

