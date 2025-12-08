<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use App\Models\Maintenance;
use App\Models\MaintenanceItem;
use Auth;
use Illuminate\Support\Facades\Schema;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('maintenances');
        $query = Maintenance::with('maintenance_items', 'vehicle', 'expense_type');
        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });
        if (!empty($request->page) && $request->page !== "page") {
            $maintenance = $query->orderBy('id', 'desc')->paginate(20);
            if (!empty($maintenance)) {
                return response()->json(['status' => true, 'maintenance' => $maintenance]);
            } else {
                return response()->json(['status' => false, 'message' => 'Maintenance not found']);
            }
        } else if ($request->page === "page") {
            $maintenance = Maintenance::with('maintenance_items', 'vehicle', 'expense_type')->orderBy('id', 'desc')->paginate(10);
            if (!empty($maintenance)) {
                return response()->json(['status' => true, 'maintenance' => $maintenance]);
            } else {
                return response()->json(['status' => false, 'message' => 'Maintenance not found']);
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                "expense_type_id" => "required",
                "vehicle_id" => "required"
            ]);
            $maintenance = new Maintenance;
            $maintenance->user_id = Auth::user()->id;
            $maintenance->exp_type_id = $validatedData['expense_type_id'];
            $maintenance->vehicle_id = $validatedData['vehicle_id'];
            $maintenance->vehicle_year = $request->vehicle_year;
            $maintenance->vehicle_model = $request->vehicle_model;
            $maintenance->vehicle_date = $request->vehicle_date;
            // $maintenance->maintenance_date = implode(', ', $validatedData['maintenance_date']);
            // $maintenance->maintenance_note = implode(', ', $validatedData['maintenance_note']);
            // $maintenance->performed_by = implode(', ', $validatedData['performed_by']);
            // $maintenance->valicate_By = implode(', ', $validatedData['validate_by']);
            // $maintenance->total_amount = implode(', ', $validatedData['total_amount']);
            if ($maintenance->save()) {
                $dataToInsert = [];
                foreach ($request->maintenance_items as $item) {
                    $dataToInsert[] = [
                        'maintenance_id' => $maintenance->id,
                        'maintenance_date' => $item['maintenance_date'],
                        'maintenance_note' => $item['maintenance_note'],
                        'performed_by' => $item['performed_by'],
                        'validate_by' => $item['validate_by'],
                        'total_amount' => $item['total_amount'],
                    ];
                }
                MaintenanceItem::insert($dataToInsert);
                return response()->json(['status' => true, 'message' => 'Maintenance data save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save maintenance']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (!empty($id)) {
            $maintenance = Maintenance::with('maintenance_items', 'vehicle')->first();
            return response()->json(['status' => true, 'data' => $maintenance]);
        } else {
            return response()->json(['status' => false, 'message' => 'Maintenance details not found']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                "expense_type_id" => "required",
                "vehicle_id" => "required"
            ]);
            $maintenance = Maintenance::find($id);
            $maintenance->user_id = Auth::user()->id;
            $maintenance->exp_type_id = $validatedData['expense_type_id'];
            $maintenance->vehicle_id = $validatedData['vehicle_id'];
            $maintenance->vehicle_year = $request->vehicle_year;
            $maintenance->vehicle_model = $request->vehicle_model;
            $maintenance->vehicle_date = $request->vehicle_date;
            // $maintenance->maintenance_date = implode(', ', $validatedData['maintenance_date']);
            // $maintenance->maintenance_note = implode(', ', $validatedData['maintenance_note']);
            // $maintenance->performed_by = implode(', ', $validatedData['performed_by']);
            // $maintenance->valicate_By = implode(', ', $validatedData['validate_by']);
            // $maintenance->total_amount = implode(', ', $validatedData['total_amount']);
            if ($maintenance->save()) {
                foreach ($request->maintenance_items as $item) {
                    MaintenanceItem::updateOrCreate(
                        [
                            'id' => $item['id'] ?? null,
                            "maintenance_id" => $id,
                        ],
                        [
                            'maintenance_date' => $item['maintenance_date'],
                            'maintenance_note' => $item['maintenance_note'],
                            'performed_by' => $item['performed_by'],
                            'validate_by' => $item['validate_by'],
                            'total_amount' => $item['total_amount'],
                        ]
                    );
                }
                return response()->json(['status' => true, 'message' => 'Maintenance data update successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update maintenance']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!empty($id)) {
            $maintenance = Maintenance::where('id', $id)->first();
            if ($maintenance->delete()) {
                return response()->json(['status' => true, 'message' => 'Maintenance delete successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Maintenance not found']);
            }
        }
    }

    public function deleteMaintenanceOption($id) {
        MaintenanceItem::where('id', $id)->delete();
        return response()->json(['status' => true, 'message' => 'Maintenance item delete successfully']);
    }
}
