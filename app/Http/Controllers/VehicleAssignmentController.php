<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VehicleAssignment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;

class VehicleAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('vehicle_assignments');
        $query = VehicleAssignment::with([
            'user:id,name',
            'contact:id,first_name,last_name',
            'vehicle:id,vehicle_name'
        ])->orderBy('id', 'desc');
        
        $searchTerm = $request->search;

        if ($request->has('vehicle_id') && !empty($request->vehicle_id)) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('contact_id') && !empty($request->contact_id)) {
            $query->where('contact_id', $request->contact_id);
        }

        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->where('start_date', $request->start_date);
        }

        // Filter by month and year
        if ($request->has('month') && $request->has('year')) {
            $month = $request->month;
            $year = $request->year;
            $query->whereYear('start_date', $year)
                  ->whereMonth('start_date', $month);
        }

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) use ($searchTerm) {
                $q->where('vehicle_name', 'LIKE', '%' . $searchTerm . '%');
            });

            $query->orWhereHas('contact', function ($q) use ($searchTerm) {
                $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$searchTerm%"]);
            });

            $query->orWhereHas('user', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if (!empty($request->page)) {
            $vehicleAssignments = $query->paginate(20);
        } else {
            $vehicleAssignments = $query->get();
        }

        return response()->json(['status' => true, 'vehicle_assignments' => $vehicleAssignments]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'contact_id' => 'nullable|exists:contacts,id',
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'event_title' => 'required|string|max:255',
                'start_date' => 'required|date',
                'start_time' => 'nullable|date_format:H:i',
                'end_date' => 'nullable|date',
                'end_time' => 'nullable|date_format:H:i',
                'full_day' => 'nullable',
                'flag' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            $vehicleAssignment = new VehicleAssignment;
            $vehicleAssignment->user_id = Auth::id();
            $vehicleAssignment->contact_id = $request->contact_id;
            $vehicleAssignment->vehicle_id = $request->vehicle_id;
            $vehicleAssignment->event_title = $request->event_title;
            $vehicleAssignment->start_date = $request->start_date;
            $vehicleAssignment->start_time = $request->start_time ?? null;
            $vehicleAssignment->end_date = $request->end_date ?? null;
            $vehicleAssignment->end_time = $request->end_time ?? null;
            $vehicleAssignment->full_day = $this->convertToBoolean($request->full_day, false);
            $vehicleAssignment->flag = $request->flag ?? null;

            if ($vehicleAssignment->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Vehicle assignment created successfully',
                    'data' => $vehicleAssignment->load(['user', 'contact', 'vehicle'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create vehicle assignment'
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
            Log::error("Vehicle assignment creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the vehicle assignment. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment ID is required'
            ], 400);
        }

        $vehicleAssignment = VehicleAssignment::with(['user', 'contact', 'vehicle'])->where('id', $id)->first();

        if ($vehicleAssignment) {
            return response()->json([
                'status' => true,
                'message' => 'Vehicle assignment retrieved successfully',
                'vehicle_assignment' => $vehicleAssignment
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment ID is required'
            ], 400);
        }

        $vehicleAssignment = VehicleAssignment::with([
            'user:id,name',
            'contact:id,first_name,last_name',
            'vehicle:id,vehicle_name'
        ])->where('id', $id)->first();

        if ($vehicleAssignment) {
            return response()->json([
                'status' => true,
                'message' => 'Vehicle assignment data',
                'data' => $vehicleAssignment
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment ID is required'
            ], 400);
        }

        $vehicleAssignment = VehicleAssignment::find($id);
        if (!$vehicleAssignment) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment not found'
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'contact_id' => 'nullable|exists:contacts,id',
                'vehicle_id' => 'nullable|exists:vehicals,id',
                'event_title' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'start_time' => 'nullable|date_format:H:i:s',
                'end_date' => 'nullable|date',
                'end_time' => 'nullable|date_format:H:i:s',
                'full_day' => 'nullable',
                'flag' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            if ($request->has('contact_id')) {
                $vehicleAssignment->contact_id = $request->contact_id;
            }
            if ($request->has('vehicle_id')) {
                $vehicleAssignment->vehicle_id = $request->vehicle_id;
            }
            if ($request->has('event_title')) {
                $vehicleAssignment->event_title = $request->event_title;
            }
            if ($request->has('start_date')) {
                $vehicleAssignment->start_date = $request->start_date;
            }
            if ($request->has('start_time')) {
                $vehicleAssignment->start_time = $request->start_time;
            }
            if ($request->has('end_date')) {
                $vehicleAssignment->end_date = $request->end_date;
            }
            if ($request->has('end_time')) {
                $vehicleAssignment->end_time = $request->end_time;
            }
            if ($request->has('full_day')) {
                $vehicleAssignment->full_day = $this->convertToBoolean($request->full_day, false);
            }
            if ($request->has('flag')) {
                $vehicleAssignment->flag = $request->flag;
            }

            if ($vehicleAssignment->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Vehicle assignment updated successfully',
                    'data' => $vehicleAssignment->load(['user', 'contact', 'vehicle'])
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update vehicle assignment'
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
            Log::error("Vehicle assignment update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the vehicle assignment. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment ID is required'
            ], 400);
        }

        $vehicleAssignment = VehicleAssignment::find($id);
        if (!$vehicleAssignment) {
            return response()->json([
                'status' => false,
                'message' => 'Vehicle assignment not found'
            ], 404);
        }

        if ($vehicleAssignment->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Vehicle assignment deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete vehicle assignment'
            ], 500);
        }
    }
}

