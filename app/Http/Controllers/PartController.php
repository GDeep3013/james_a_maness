<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Part;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Auth;

class PartController extends Controller
{
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('parts');
        $query = Part::with(['vendor'])->orderBy('id', 'desc');
        
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at' && $column !== 'vehical_types') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });

            $query->orWhereHas('vendor', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $parts = $query->paginate(20);

        return response()->json(['status' => true, 'parts' => $parts]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'part_name' => 'required|string|max:255',
                'part_code' => 'required|string|max:255|unique:parts,part_code',
                'description' => 'nullable|string',
                'vehical_types' => 'nullable|array',
                'manufacturer_name' => 'nullable|string|max:255',
                'unit_price' => 'required|numeric|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'vendor_id' => 'nullable|exists:vendors,id',
                'warranty_period_months' => 'nullable|string',
                'status' => 'nullable|in:Active,Inactive',
            ]);

            DB::beginTransaction();

            $part = new Part;
            $part->part_name = $validatedData['part_name'];
            $part->part_code = $validatedData['part_code'];
            $part->description = $request->description ?? null;
            $part->vehical_types = $request->vehical_types ?? null;
            $part->manufacturer_name = $request->manufacturer_name ?? null;
            $part->unit_price = $validatedData['unit_price'];
            $part->purchase_price = $validatedData['purchase_price'];
            $part->vendor_id = $request->vendor_id ?? null;
            $part->warranty_period_months = $request->warranty_period_months ?? null;
            $part->status = $request->status ?? 'Active';

            if ($part->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Part created successfully',
                    'data' => $part->load('vendor')
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to create part'
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
            Log::error("Part creation error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the part. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Part ID is required'
            ], 400);
        }

        $part = Part::with(['vendor'])->where('id', $id)->first();

        if ($part) {
            return response()->json([
                'status' => true,
                'message' => 'Part retrieved successfully',
                'part' => $part
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Part not found'
            ], 404);
        }
    }

    public function edit($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Part ID is required'
            ], 400);
        }

        $part = Part::with(['vendor'])->where('id', $id)->first();

        if ($part) {
            return response()->json([
                'status' => true,
                'message' => 'Part data',
                'data' => $part
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Part not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Part ID is required'
            ], 400);
        }

        $part = Part::find($id);
        if (!$part) {
            return response()->json([
                'status' => false,
                'message' => 'Part not found'
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'part_name' => 'nullable|string|max:255',
                'part_code' => 'nullable|string|max:255|unique:parts,part_code,' . $id,
                'description' => 'nullable|string',
                'vehical_types' => 'nullable|array',
                'manufacturer_name' => 'nullable|string|max:255',
                'unit_price' => 'nullable|numeric|min:0',
                'purchase_price' => 'nullable|numeric|min:0',
                'vendor_id' => 'nullable|exists:vendors,id',
                'warranty_period_months' => 'nullable|string',
                'status' => 'nullable|in:Active,Inactive',
            ]);

            DB::beginTransaction();

            if ($request->has('part_name')) {
                $part->part_name = $request->part_name;
            }
            if ($request->has('part_code')) {
                $part->part_code = $request->part_code;
            }
            if ($request->has('description')) {
                $part->description = $request->description;
            }
            if ($request->has('vehical_types')) {
                $part->vehical_types = $request->vehical_types;
            }
            if ($request->has('manufacturer_name')) {
                $part->manufacturer_name = $request->manufacturer_name;
            }
            if ($request->has('unit_price')) {
                $part->unit_price = $request->unit_price;
            }
            if ($request->has('purchase_price')) {
                $part->purchase_price = $request->purchase_price;
            }
            if ($request->has('vendor_id')) {
                $part->vendor_id = $request->vendor_id;
            }
            if ($request->has('warranty_period_months')) {
                $part->warranty_period_months = $request->warranty_period_months;
            }
            if ($request->has('status')) {
                $part->status = $request->status;
            }

            if ($part->save()) {
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => 'Part updated successfully',
                    'data' => $part->load('vendor')
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to update part'
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
            Log::error("Part update error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the part. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        if (empty($id)) {
            return response()->json([
                'status' => false,
                'message' => 'Part ID is required'
            ], 400);
        }

        $part = Part::find($id);
        if (!$part) {
            return response()->json([
                'status' => false,
                'message' => 'Part not found'
            ], 404);
        }

        if ($part->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Part deleted successfully'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete part'
            ], 500);
        }
    }
}
