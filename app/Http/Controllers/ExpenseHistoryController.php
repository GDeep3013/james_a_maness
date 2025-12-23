<?php

namespace App\Http\Controllers;

use App\Models\ExpenseHistory;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Exports\ExpenseHistoryExport;
use Maatwebsite\Excel\Facades\Excel;

class ExpenseHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('expense_histories');
        $query = ExpenseHistory::with(['vehicle', 'vendor']);
        $searchTerm = $request->search;

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at'])) {
                        $q->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });
        }

        $query->orderBy('date', 'desc');

        if (!empty($request->page)) {
            $expenses = $query->paginate(20);
            return response()->json(['status' => true, 'expense' => $expenses]);
        } else {
            $expenses = $query->get();
            return response()->json(['status' => true, 'expense' => $expenses]);
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
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'expense_type' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'notes' => 'nullable|string',
                'reference_id' => 'nullable|integer',
                'reference_type' => 'nullable|string|max:255',
                'frequency' => 'required|in:single,recurring',
                'recurrence_period' => 'nullable|in:monthly,annual',
            ]);

            $expense = new ExpenseHistory;
            $expense->user_id = Auth::user()->id;
            $expense->vehicle_id = $validatedData['vehicle_id'];
            $expense->vendor_id = $validatedData['vendor_id'] ?? null;
            $expense->expense_type = $validatedData['expense_type'];
            $expense->amount = $validatedData['amount'];
            $expense->date = $validatedData['date'];
            $expense->notes = $validatedData['notes'] ?? null;
            $expense->reference_id = $validatedData['reference_id'] ?? null;
            $expense->reference_type = $validatedData['reference_type'] ?? null;
            $expense->frequency = $validatedData['frequency'];
            $expense->recurrence_period = $validatedData['recurrence_period'] ?? null;

            if ($expense->save()) {
                return response()->json(['status' => true, 'message' => 'Expense entry saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save expense entry'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
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
        try {
            if ($id) {
                $data = ExpenseHistory::with(['vehicle', 'vendor'])->where('id', $id)->first();
                if ($data) {
                    return response()->json(['status' => true, 'expense' => $data, 'data' => $data]);
                } else {
                    return response()->json(['status' => false, 'message' => 'Expense entry not found']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Expense ID is required']);
            }
        } catch (\Exception $e) {
            \Log::error('Expense show error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error loading expense entry: ' . $e->getMessage()], 500);
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
        if ($id) {
            $data = ExpenseHistory::with(['vehicle', 'vendor'])->where('id', $id)->first();
            if ($data) {
                return response()->json(['status' => true, 'data' => $data]);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense entry not found']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Expense ID is required']);
        }
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
                'vehicle_id' => 'required|exists:vehicals,id',
                'vendor_id' => 'nullable|exists:vendors,id',
                'expense_type' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'notes' => 'nullable|string',
                'reference_id' => 'nullable|integer',
                'reference_type' => 'nullable|string|max:255',
                'frequency' => 'required|in:single,recurring',
                'recurrence_period' => 'nullable|in:monthly,annual',
            ]);

            $expense = ExpenseHistory::find($id);
            if (!$expense) {
                return response()->json(['status' => false, 'message' => 'Expense entry not found']);
            }

            $expense->user_id = Auth::user()->id;
            $expense->vehicle_id = $validatedData['vehicle_id'];
            $expense->vendor_id = $validatedData['vendor_id'] ?? null;
            $expense->expense_type = $validatedData['expense_type'];
            $expense->amount = $validatedData['amount'];
            $expense->date = $validatedData['date'];
            $expense->notes = $validatedData['notes'] ?? null;
            $expense->reference_id = $validatedData['reference_id'] ?? null;
            $expense->reference_type = $validatedData['reference_type'] ?? null;
            $expense->frequency = $validatedData['frequency'];
            $expense->recurrence_period = $validatedData['recurrence_period'] ?? null;

            if ($expense->save()) {
                return response()->json(['status' => true, 'message' => 'Expense entry updated successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update expense entry']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
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
        if ($id) {
            $expense = ExpenseHistory::find($id);
            if ($expense && $expense->delete()) {
                return response()->json(['status' => true, 'message' => 'Expense entry deleted successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense entry not found']);
            }
        }
    }

    public function export(Request $request)
    {
        try {
            $search = $request->input('search', '');

            $export = new ExpenseHistoryExport($search);

            $fileName = 'expense_history_export_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while exporting expense history.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
