<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ExpenseVendor;
use Auth;
use Illuminate\Support\Facades\Schema;

class ExpenseVendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('expense_vendors');
        $query = ExpenseVendor::orderBy('id', 'desc');
        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });
        if (!empty($request->page)) {
            $expVendors = $query->paginate(20);
            if (!empty($expVendors)) {
                return response()->json(['status' => true, 'expVendor' => $expVendors]);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense vendors not found']);
            }
        } else {

            $expVendors = $query->get();
            if (!empty($expVendors)) {
                return response()->json(['status' => true, 'expVendor' => $expVendors]);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense vendors not found']);
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
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                'corporation' => 'required|string|max:255',
                'first_name' => 'nullable|string|max:255',
                'email' => 'nullable|email:rfc,dns|max:255|unique:expense_vendors,email',
                'phone' => [
                    'nullable',
                    'string',
                    'min:10',
                    'max:20', // Added max length for phone number
                    'regex:/^\+?[0-9\s()-]{10,15}$/',
                    'unique:expense_vendors,phone'
                ],
            ]);
            $expenseVendor = new ExpenseVendor;
            $expenseVendor->user_id = Auth::user()->id;
            $expenseVendor->corporation = $validatedData['corporation'];
            $expenseVendor->first_name = $validatedData['first_name'];
            $expenseVendor->phone =  $validatedData['phone'];
            $expenseVendor->email = $validatedData['email'];
            $expenseVendor->address = $request->address;
            $expenseVendor->country = $request->country;
            $expenseVendor->state = $request->state;
            $expenseVendor->city = $request->city;
            $expenseVendor->zip = $request->zip;
            if ($expenseVendor->save()) {
                return response()->json(['status' => true, 'message' => 'Expense vendor saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save expense vendor'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()], 401);
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
        if ($id) {
            $data = ExpenseVendor::where('id', $id)->first();
            return response()->json(['status' => true, 'expVendor' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Expense vendors not found']);
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
                'corporation' => 'required|string|max:255',
                'first_name' => 'sometimes|nullable|string|max:255',
                'email' => 'sometimes|nullable|email:rfc,dns|max:255|unique:expense_vendors,email,' . $id . ',id',
                'phone' => [
                    'sometimes',
                    'nullable',
                    'string',
                    'min:10',
                    'max:20',
                    'regex:/^\+?[0-9\s()-]{10,15}$/',
                    'unique:expense_vendors,phone,' . $id . ',id'
                ],
            ]);
            $expenseVendor = ExpenseVendor::find($id);
            $expenseVendor->user_id = Auth::user()->id;
            $expenseVendor->corporation = $validatedData['corporation'];
            $expenseVendor->first_name = $validatedData['first_name'];
            $expenseVendor->phone = $validatedData['phone'];
            $expenseVendor->email = $validatedData['email'];
            $expenseVendor->address = $request->address;
            $expenseVendor->country = $request->country;
            $expenseVendor->state = $request->state;
            $expenseVendor->city = $request->city;
            $expenseVendor->zip = $request->zip;
            if ($expenseVendor->save()) {
                return response()->json(['status' => true, 'message' => 'Expense vendor update successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update expense vendor'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()], 401);
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
            $expVendor = ExpenseVendor::find($id);

            if ($expVendor->delete()) {
                return response()->json(['status' => true, 'message' => 'Expense vendors Delete Successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense vendors not found']);
            }
        }
    }
}
