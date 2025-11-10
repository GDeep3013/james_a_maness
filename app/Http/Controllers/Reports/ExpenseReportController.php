<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseReportController extends Controller
{

    public function filter(Request $request)
    {

        $query = Expense::with('expense_items','expense_items.taxType', 'expense_items.expenseType',  'expense_routes', 'vehicle', 'expense_vendor')->orderBy('exp_date', 'asc');

        // Date Filters
        if (!empty($request->start_date) && !empty($request->end_date)) {
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $request->start_date)->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $request->end_date)->endOfDay();
            $query->whereBetween('exp_date', [$startDate, $endDate]);
        } else {
            if (!empty($request->start_date)) {
                $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $request->start_date)->startOfDay();
                $query->where('exp_date', '>=', $startDate);
            }
        
            if (!empty($request->end_date)) {
                $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $request->end_date)->endOfDay();
                $query->where('exp_date', '<=', $endDate);
            }
        }
        
        // Other Filters
        if ($request->type_of_expense) {
            $query->where('type_of_exp', $request->type_of_expense);
        }
        
        if ($request->routes_id) {
            $query->where('route_id', $request->routes_id);
        }
        
        if ($request->exp_vendor_id) {
            $query->where('exp_vendor_id', $request->exp_vendor_id);
        }
        
        if ($request->vehical_id) {
            $query->where('vehicle_id', $request->vehical_id);
        }
        
        // Fetching Data
        $expenses = ($request->page === "expense") ? $query->get() : $query->paginate($request->numRow);
        
        // Response Handling
        if ($expenses->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Expense not found']);
        }
        
        return response()->json(['status' => true, 'expense' => $expenses]);
        
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
