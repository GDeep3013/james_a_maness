<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExpenseType;
use App\Models\TaxType;
use App\Models\ExpenseDetails;
use App\Models\Expense;
use App\Models\ExpenseItem;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Auth;
use Illuminate\Support\Facades\Schema;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('expenses');
        $query = Expense::with('expense_items', 'expense_items.taxType', 'expense_items.expenseType',  'expense_routes', 'vehicle', 'expense_vendor');
        $searchTerm = trim($request->search);

        $replacements = [
            'Route Expense'         => 'Route',
            'Company Expense'       => 'Company',
            'Vehicle Expense'       => 'Vehicle',
            'Miscellaneous Expense' => 'Miscellaneous',
        ];

        // Replace only if a match is found; otherwise keep original
        $searchTerm = $replacements[$searchTerm] ?? $searchTerm;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
            $query->orWhereHas('expense_routes', function ($subQuery) use ($searchTerm) {
                $subQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
            })
                ->orWhereHas('vehicle', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('truck', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('expense_vendor', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('expense_vendor', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('corporation', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('corporation', 'LIKE', '%' . $searchTerm . '%');
                });
        });

        if ($request->page !== "expense") {
            $expense = $query->orderBy('id', 'desc')->paginate(20);
            if (!empty($expense)) {
                return response()->json(['status' => true, 'expense' => $expense]);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense not found']);
            }
        } else if ($request->page === "expense") {
            $expense = Expense::with('expense_items')->get();
            if (!empty($expense)) {
                return response()->json(['status' => true, 'expense' => $expense]);
            } else {
                return response()->json(['status' => false, 'message' => 'Expense not found']);
            }
        }
    }
    
    public function getExpenseData(Request $request)
    {
        $input = $request->all();
        $data = json_decode($input['data'], true);
        $startDate = $data['startDate'];
        $parsedDate = Carbon::parse($startDate);
        $currentMonth = $parsedDate->format('m');
        $currentYear = $parsedDate->format('Y');

        if ($input['page'] === "year") {
            $expense = Expense::with('expense_items') // Eager load the relationship
                ->whereYear('created_at', $currentYear)
                ->get();

            $processedData = $expense->map(function ($item) {
                $totalAmount = $item->expense_items->sum('total_amount'); // Calculate the sum of related items
                return [
                    'month' => Carbon::parse($item->created_at)->format('m'),
                    'total_amount' => $totalAmount,
                ];
            });

            $finalArray = $processedData->groupBy('month')->map(function ($group) {
                return [
                    'month' => (int)$group->first()['month'],
                    'total_amount' => $group->sum('total_amount'),
                ];
            })->values()->toArray();

            return !empty($finalArray)
                ? response()->json(['status' => true, 'expense' => $finalArray])
                : response()->json(['status' => false, 'message' => 'Expense not found']);
        } else {

            $expense = Expense::with('expense_items')
                ->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth)
                ->get();

            $processedData = $expense->map(function ($item) {
                $totalAmount = $item->expense_items->sum('total_amount');
                return [
                    'date' => Carbon::parse($item->created_at)->format('Y-m-d'),
                    'total_amount' => $totalAmount,
                ];
            });

            $finalArray = $processedData->groupBy('date')->map(function ($group) {
                return [
                    'date' => date('d', strtotime($group->first()['date'])),
                    'total_amount' => $group->sum('total_amount'),
                ];
            })->values()->toArray();

            return !empty($finalArray)
                ? response()->json(['status' => true, 'expense' => $finalArray])
                : response()->json(['status' => false, 'message' => 'Expense not found']);
        }
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
            // Debugging the request data for troubleshooting
            // dd($request->all());

            // Validate incoming data
            $validatedData = $request->validate([
                "exp_vendor_id" => "required",
                "exp_vendor_email" => "nullable",
                "exp_vendor_phone" => "nullable",
                "type_of_expense" => "required",
                "expense_date" => "required",
                "invoice_no" => 'required|unique:expenses,invoice_no'
            ]);

            // Create new expense record
            $expense = new Expense;
            $expense->user_id = Auth::user()->id;
            $expense->route_id = $request->routes_id;  // Ensure 'routes_id' is passed correctly in the request
            $expense->vehicle_id = $request->vehicle_id;  // Ensure 'vehicle_id' is passed correctly in the request
            $expense->exp_vendor_id = $validatedData['exp_vendor_id'];
            $expense->type_of_exp = $validatedData['type_of_expense'];
            $expense->exp_vendor_phone = $validatedData['exp_vendor_phone'];
            $expense->exp_vendor_email = $validatedData['exp_vendor_email'];
            $expense->exp_date = $validatedData['expense_date'];
            $expense->invoice_no = $request->invoice_no;

            // Save expense record
            if ($expense->save()) {
                // Initialize array for expense items
                $dataToInsert = [];

                // Loop through the expense items and prepare data for bulk insert
                foreach ($request->expense_items as $item) {
                    $dataToInsert[] = [
                        "expense_id" => $expense->id,
                        "exp_type_id" => $item['exp_type_id'],
                        "tax_type_id" => $item['tax_type_id'],
                        "particular" => $item['particular'],
                        "gross_amount" => $item['gross_amount'],
                        "tax_amount" => $item['tax_amount'],
                        "total_amount" => $item['total_amount']
                    ];
                }

                // Insert all expense details at once
                ExpenseItem::insert($dataToInsert);

                // Return success response
                return response()->json(['status' => true, 'message' => 'Expense data saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save expense']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors and return them
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        } catch (\Exception $e) {
            // Handle any unexpected exceptions
            return response()->json(['status' => 'error', 'message' => 'An error occurred', 'error' => $e->getMessage()]);
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
            $expense = Expense::with([
                'expense_items' => function ($query) {
                    $query->select('id', 'expense_id', 'exp_type_id', 'tax_type_id', 'particular', 'gross_amount',    'tax_amount', 'total_amount'); // Specify the columns you need
                },
                'expense_routes',
                'vehicle',
                'expense_vendor',
                'expense_details.expense_type',
                'expense_details.tax_type'
            ])->where('id', $id)->first();
            return response()->json(['status' => true, 'data' => $expense]);
        } else {
            return response()->json(['status' => false, 'message' => 'Expense details not found']);
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
                // "vehicle_id" => "required",
                "exp_vendor_id" => "required",
                "exp_vendor_email" => "nullable",
                "exp_vendor_phone" => "nullable",
                "type_of_expense" => "required",
                "expense_date" => "required",
                "invoice_no" => 'required|unique:expenses,invoice_no,' . $id,
                // "routes_id" => "required",
                // "type_of_expense" => "required",
                // "grand_total_amount" => "required",
                // "grand_expense_tax" => "required",
                // "grand_total_price" => "required",
                // "expense_type_id" => "required",
                // "particular_name" => "required",
                // "gross_amount" => "required",
                // "exp_tax_id" => "required",
                // "tax_amount" => "required",
                // "total_amount" => "required",
            ]);
            $expense = Expense::find($id);
            if ($expense) {
                $expense->user_id = Auth::user()->id;
                $expense->route_id = $request->routes_id;  // Ensure 'routes_id' is passed correctly in the request
                $expense->vehicle_id = $request->vehicle_id;  // Ensure 'vehicle_id' is passed correctly in the request
                $expense->exp_vendor_id = $validatedData['exp_vendor_id'];
                $expense->type_of_exp = $validatedData['type_of_expense'];
                $expense->exp_vendor_phone = $validatedData['exp_vendor_phone'];
                $expense->exp_vendor_email = $validatedData['exp_vendor_email'];
                $expense->exp_date = $validatedData['expense_date'];
                $expense->invoice_no = $request->invoice_no;
                if ($expense->save()) {
                    foreach ($request->expense_items as $item) {
                        ExpenseItem::updateOrCreate(
                            [
                                'id' => $item['id'] ?? null,
                                "expense_id" => $expense->id,
                            ],
                            [
                                "exp_type_id" => $item['exp_type_id'],
                                "tax_type_id" => $item['tax_type_id'],
                                "particular" => $item['particular'],
                                "gross_amount" => $item['gross_amount'],
                                "tax_amount" => $item['tax_amount'],
                                "total_amount" => $item['total_amount']
                            ]
                        );
                    }
                    return response()->json(['status' => true, 'message' => 'Expense data save successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to save expense']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Expense not found']);
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
            $expense = Expense::where('id', $id)->first();
            if ($expense) {
                ExpenseDetails::where('expense_id', $expense->id)->delete();
                if ($expense->delete()) {
                    return response()->json(['status' => true, 'message' => 'Expense delete successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Expense not found']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Expense not found']);
            }
        }
    }

    public function createExpenseType(Request $request)
    {
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                "type" => "required|unique:expense_types,exp_type",
            ]);
            $expType = new ExpenseType;
            $expType->type = $request->method;
            $expType->exp_type = $validatedData['type'];
            if ($expType->save()) {
                return response()->json(['status' => true, 'message' => 'Expense type save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save expense type']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    public function getExpenseType(Request $request)
    {
        $expenseType = ExpenseType::where('type', $request->type)->get();
        if ($expenseType) {
            return response()->json(['status' => true, 'expenseType' => $expenseType]);
        } else {
            return response()->json(['status' => false, 'message' => 'Expense type not found']);
        }
    }

    public function createTaxType(Request $request)
    {
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                "method" => 'required|in:Invoice,Tax,invoice,tax',
                "type" => [
                    'required',
                    Rule::unique('tax_types', 'tax_type')->where(function ($query) use ($request) {
                        $query->where('name', $request->method)
                            ->where('tax_type', $request->type);
                    }),
                ],
            ]);
            $expType = new TaxType;
            $expType->tax_type = $validatedData['type'];
            $expType->name = $validatedData['method'];
            if ($expType->save()) {
                $getTax = TaxType::where('name', $request->expense_method)->get();
                return response()->json(['status' => true, 'taxType' => $getTax, 'message' => 'Tax type save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save tax type']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    public function getTaxType(Request $request)
    {
        if ($request->name === 'Tax') {
            $taxType = TaxType::where('name', $request->name)->get();
            if ($taxType) {
                return response()->json(['status' => true, 'taxType' => $taxType, 'message' => 'Tax save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Tax type not found']);
            }
        } else {
            $taxType = TaxType::where('name', $request->name)->get();
            if ($taxType) {
                return response()->json(['status' => true, 'taxType' => $taxType, 'message' => 'Tax save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Tax type not found']);
            }
        }
    }

    public function deleteExpenseOption($id)
    {
        ExpenseItem::where('id', $id)->delete();
        return response()->json(['status' => true, 'message' => 'Expense item delete successfully']);
    }
}
