<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\TaxType;
use App\Models\Routes;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;
use Auth;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use App\Traits\InvoiceHandlerTrait;
use App\Models\Payment;
use App\Models\Company;
use App\Models\PaymentMeta;
use App\Models\Vendor;

class InvoiceController extends Controller
{
    use InvoiceHandlerTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     * @return \Illuminate\Http\JsonResponse
     */
    // public function index(Request $request)
    // {
    //     $tableColumns = Schema::getColumnListing('payments');
    //     $query = Payment::with(['meta' => function($query) {
    //         $query->select('meta_key', 'meta_value');  // Specify columns to fetch
    //     }]);
    //     $payments = $query->get();
    //     $payments->each(function($payment) {
    //         $payment->meta = $payment->meta->pluck('meta_value', 'meta_key')->toArray();

    //         // Decode JSON for keys that have JSON data (like 'routes', 'fuelExp', 'invoiceTax')
    //         foreach ($payment->meta as $key => $value) {
    //             if ($this->isJson($value)) {
    //                 $payment->meta[$key] = json_decode($value, true); // Decode JSON
    //             }
    //         }
    //     });
    //     $searchTerm = $request->search;
    //     $query->where(function ($query) use ($tableColumns, $searchTerm) {
    //         foreach ($tableColumns as $column) {
    //             if ($column !== 'created_at' && $column !== 'updated_at') {
    //                 $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
    //             }
    //         }
    //     });

    //     // Apply vendor_id filter
    //     // if ($request->has('vendor_id')) {
    //     //     $query->whereHas('meta', function ($q) use ($request) {
    //     //         $q->where('meta_key', 'vendor_id')
    //     //             ->where('meta_value', $request->input('vendor_id'));
    //     //     });
    //     // }

    //     // Apply search filter
    //     // if ($request->has('search') && !empty($request->search)) {
    //     //     $searchTerm = $request->search;

    //     //     $query->where(function ($q) use ($searchTerm) {
    //     //         // Search in `type` column
    //     //         $q->where('type', 'LIKE', "%{$searchTerm}%");

    //     //         // Search in `meta_value` in the related `meta` table
    //     //         $q->orWhereHas('meta', function ($subQuery) use ($searchTerm) {
    //     //             $subQuery->where('meta_value', 'LIKE', "%{$searchTerm}%");
    //     //         });
    //     //     });
    //     // }

    //     // Handle pagination and fetching logic
    //     if (!empty($request->page) && $request->page !== "page" && $request->page !== "invoice") {
    //         $invoices = $query->orderBy('id', 'desc')->paginate(20);
    //     } elseif ($request->page === "page") {
    //         $invoices = $query->orderBy('id', 'desc')->paginate(10);
    //     } elseif ($request->page === "invoice") {
    //         $invoices = $query->get();
    //     } else {
    //         // Default fallback for unexpected page types
    //         return response()->json(['status' => false, 'message' => 'Invalid page parameter']);
    //     }
    //     if (!empty($invoices)) {
    //         return response()->json(['status' => true, 'invoice' => $invoices]);
    //     } else {
    //         return response()->json(['status' => false, 'message' => 'Driver not found']);
    //     }
    //     // // Transform invoices
    //     // $invoicesData = $invoices instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator
    //     //     ? $invoices->getCollection()
    //     //     : $invoices;
    //     // $transformedInvoices = $invoicesData->map(function ($invoice) use ($request) {
    //     //     $metaData = $invoice->meta->pluck('meta_value', 'meta_key')->toArray();

    //     //     // Add vendor_name to metaData if vendor_id exists
    //     //     if (isset($metaData['vendor_id'])) {
    //     //         $vendorId = $metaData['vendor_id'];
    //     //         $vendor = Vendor::find($vendorId);
    //     //         if ($vendor) {
    //     //             $metaData['vendor_name'] = $vendor->first_name;
    //     //         }
    //     //     }

    //     //     if (isset($metaData['routes_id'])) {
    //     //         $route = Routes::find($metaData['routes_id']);
    //     //         if ($route) {
    //     //             $metaData['route_name'] = $route->name;
    //     //         }
    //     //     }

    //     //     // Apply search filter if search term exists


    //     //     return [
    //     //         'id' => $invoice->id,
    //     //         'type' => $invoice->type,
    //     //         'meta' => $metaData,
    //     //     ];
    //     // });
    //     // // Prepare response
    //     // $response = [
    //     //     'status' => true,
    //     //     'invoice' => [
    //     //         'data' => $transformedInvoices->values(),
    //     //     ],
    //     // ];

    //     // // Add pagination details only for paginated queries
    //     // if ($invoices instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
    //     //     $response['invoice'] = array_merge($response['invoice'], [
    //     //         'current_page' => $invoices->currentPage(),
    //     //         'last_page' => $invoices->lastPage(),
    //     //         'per_page' => $invoices->perPage(),
    //     //         'total' => $invoices->total(),
    //     //     ]);
    //     // }

    //     // return response()->json($response);
    // }


    public function index(Request $request)
    {
        // Get all columns from the 'payments' table
        $tableColumns = Schema::getColumnListing('payments');

        // Start buildingdd the query
        $query = Payment::with('meta', 'company');
        // dd($query);

        // Apply search filter across all columns except 'created_at' and 'updated_at'
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($query) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            });
        }

        // Apply company filter
        if ($request->has('company') && !empty($request->company)) {
           $query->where('company_id', $request->company);
        }

        // Handle pagination logic based on the 'page' query parameter
        if (!empty($request->page) && $request->page !== "page" && $request->page !== "invoice") {
            $invoices = $query->orderBy('id', 'desc')->paginate(20);
        } elseif ($request->page === "page") {
            $invoices = $query->where(function ($query) {
                $query->whereNull('status')
                      ->orWhere('status', '');
            })->orderBy('id', 'desc')->paginate(10);
        } elseif ($request->page === "invoice") {
            $invoices = $query->where(function ($query) {
                $query->whereNull('status')
                      ->orWhere('status', '');
            })->get();
        } else {
            // Default fallback for unexpected page types
            return response()->json(['status' => false, 'message' => 'Invalid page parameter']);
        }

        // Process each payment to convert 'meta' to an associative array and decode JSON
        $invoices->each(function ($payment) {
            // Initialize an empty array to store transformed meta data
            $metaData = [];

            // Ensure 'meta' is not null and is a valid collection
            if ($payment->meta && $payment->meta->isNotEmpty()) {
                // Process 'meta' collection into a key-value pair
                foreach ($payment->meta as $meta) {
                    // If meta_key and meta_value are available, add them as key-value pairs
                    if ($meta->meta_key && $meta->meta_value) {
                        $metaData[$meta->meta_key] = $meta->meta_value;
                    }
                }
            }

            // Now we assign it back to a custom field (transformed meta)
            $payment->transformed_meta = $metaData;  // This is a new custom field
        });

        // Return the response with the paginated or full invoice data
        if ($invoices->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No invoices found']);
        }
        if ($request->page === "invoice") {
            // Return full data without pagination metadata
            return response()->json([
                'status' => true,
                'invoice' => $invoices, // Full collection
                
                
            ]);
        }
        return response()->json([
            'status' => true,
            'invoice' => [
                'data' => $invoices->items(), // Return the items (current page records)
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }


    public function isJson($string)
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function getInvoiceData(Request $request)
    {
        $input = $request->all();
        $data = json_decode($input['data'], true);
        $startDate = $data['startDate'];
        $parsedDate = Carbon::parse($startDate);
        $currentMonth = $parsedDate->format('m');
        $currentYear = $parsedDate->format('Y');
        $paymentTypes = ['routes', 'parking', 'ups', 'order', 'custom'];

        // Process metadata based on payment type
        $processMetaData = function ($meta, $paymentType) {
            $metaKeyValuePairs = [];
            $metaValue = json_decode($meta->meta_value, true);

            switch ($paymentType) {
                case 'routes':
                    if ($meta->meta_key === 'routes') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'total_amount'));
                    }
                    if ($meta->meta_key === 'fuelExp') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'fuel_total_amt'));
                    }
                    if ($meta->meta_key === 'invoiceTax') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'tax_amount'));
                    }
                    break;
                case 'parking':
                    if ($meta->meta_key === 'parking') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'parking_amount'));
                    }
                    if ($meta->meta_key === 'invoiceTax') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'tax_amount'));
                    }
                    break;
                case 'ups':
                    if ($meta->meta_key === 'ups') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'total_amount'));
                    }
                    break;
                case 'order':
                    if ($meta->meta_key === 'addOrder') {
                        $orderDetails = array_column($metaValue, 'orderDetails');
                        $orderAmounts = array_column($orderDetails, 'order_amount');
                        $metaKeyValuePairs[] = array_sum($orderAmounts);
                    }
                    if ($meta->meta_key === 'invoiceTax') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'tax_amount'));
                    }
                    break;
                case 'custom':
                    if ($meta->meta_key === 'custom') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'total_amount'));
                    }
                    if ($meta->meta_key === 'invoiceTax') {
                        $metaKeyValuePairs[] = array_sum(array_column($metaValue, 'tax_amount'));
                    }
                    break;
            }

            return array_sum($metaKeyValuePairs) ?? 0;
        };

        // Fetch payments and process them
        $fetchPayments = function ($year, $month = null) use ($paymentTypes, $processMetaData) {
            $query = Payment::whereYear('created_at', $year);
            if ($month) {
                $query->whereMonth('created_at', $month);
            }

            $payments = $query->get();
            $paymentIds = $payments->pluck('id');
            $metaData = PaymentMeta::whereIn('payment_id', $paymentIds)->get();

            return $payments->map(function ($payment) use ($metaData, $paymentTypes, $processMetaData) {
                $paymentMeta = $metaData->where('payment_id', $payment->id);
                $totalAmount = 0;
                $paymentType = $payment->type;

                foreach ($paymentMeta as $meta) {
                    if (in_array($paymentType, $paymentTypes)) {
                        $totalAmount += $processMetaData($meta, $paymentType);
                    }
                }

                return [
                    'date' => Carbon::parse($payment->created_at)->format('Y-m-d'),
                    'month' => Carbon::parse($payment->created_at)->format('m'),
                    'total_amount' => $totalAmount,
                ];
            });
        };

        // Determine if the request is for the year or month
        if ($input['page'] === "year") {
            $processedData = $fetchPayments($currentYear);
            $finalArray = $processedData->groupBy('month')->map(function ($group) {
                return [
                    'month' => (int)$group->first()['month'],
                    'total_amount' => $group->sum('total_amount'),
                ];
            })->values()->toArray();
        } else {
            $processedData = $fetchPayments($currentYear, $currentMonth);
            $finalArray = $processedData->groupBy('date')->map(function ($group) {
                return [
                    'date' => date('d', strtotime($group->first()['date'])),
                    'total_amount' => $group->sum('total_amount'),
                ];
            })->values()->toArray();
        }

        // Return response
        return !empty($finalArray)
            ? response()->json(['status' => true, 'invoice' => $finalArray])
            : response()->json(['status' => false, 'message' => 'Invoice not found']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:routes,parking,ups,order,custom',
                'custom_invoice_id' => 'required|unique:payments,custom_invoice_id', // Unique validation for custom_invoice_id
            ]);
            $requestData = $request->all();
            $metaData = [];
            foreach ($requestData as $key => $value) {
                if (isset($requestData[$key]) && is_array($requestData[$key])) {
                    $metaData[] = [
                        'meta_key' => $key,
                        'meta_value' => json_encode($requestData[$key])
                    ];
                }
            }
            $INVOICE_TYPE = [
                "routes" => "Routes Invoice",
                "parking" => "Parking Yards",
                "ups" => "UPS Invoice",
                "order" => "Add On Invoice",
                "custom" => "Custom Invoice"
            ];
            $invoice = Payment::create([
                'type' => $validated['type'],
                'company_id' => $request->company_id ?? null,
                'vendor_id' => $request->vendor_id ?? null,
                'vendor_name' => $request->vendor_name ?? "",
                'vendor_address' => $request->vendor_address ?? "",
                'vendor_email' => $request->vendor_email ?? "",
                'vendor_phone' => $request->vendor_phone ?? "",
                'vendor_no' => $request->vendor_no ?? "",
                'routes_id' => $request->routes_id ?? null,
                'routes_name' => $request->routes_name ?? "",
                'start_date' => $request->start_date ?? null,
                'end_date' => $request->end_date ?? null,
                'due_date' => $request->due_date ?? null,
                'payment' => $request->payment ?? "",
                'invoice_date' => $request->invoice_date ?? null,
                'note' => $request->note ?? "",
                'po_number' => $request->po_number ?? "",
                'enable' => $request->isChecked ? 1 : 0 ?? false,
                'custom_invoice_id' => $validated['custom_invoice_id'],
                'gst_no' => $request->gst_no ?? "",
                'route_type_name' => $INVOICE_TYPE[$validated['type']],
                'routes_type' => $request->routes_type ?? null,
                'is_term_condition' => $request->isCheckedTermCond ? 1 : 0 ?? false,
                'payment_note' => ""
            ]);

            $this->handleMetaData($invoice, $metaData, $validated['type']);
            $invoiceData = Payment::with('meta')->where('id', $invoice->id)->first();
            if (isset($invoiceData->meta) && count($invoiceData->meta) > 0) {
                return response()->json(['status' => true, 'message' => 'Invoice created successfully', 'invoice' => $invoice]);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to create invoice']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'error' => $e->validator->errors(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id, Request $request)
    {
        if (!empty($id)) {
            // Query the Payment model with the provided ID and type
            $invoices = Payment::with(['meta', 'company'])
                ->where('id', $id)
                ->where('type', $request->type)
                ->get();

            // Check if invoices were found
            if ($invoices->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Invoice not found']);
            }

            // Process each invoice to transform the 'meta' data
            $invoices->each(function ($payment) {
                // Initialize an empty array to store transformed meta data
                $metaData = [];

                // Ensure 'meta' is not null and is a valid collection
                if ($payment->meta && $payment->meta->isNotEmpty()) {
                    // Process 'meta' collection into key-value pairs
                    foreach ($payment->meta as $meta) {
                        // If meta_key and meta_value are available, add them as key-value pairs
                        if ($meta->meta_key && $meta->meta_value) {
                            $metaData[$meta->meta_key] = $meta->meta_value;
                        }
                    }
                }

                // Now we assign it back to a custom field (transformed meta)
                $payment->transformed_meta = $metaData;  // This is a new custom field
            });

            // Return the transformed invoice data
            return response()->json(['status' => true, 'data' => $invoices]);
        } else {
            // Return error if no ID was provided
            return response()->json(['status' => false, 'message' => 'Invoice details not found']);
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
            // Find the invoice by ID
            $invoice = Payment::find($id);

            if (!$invoice) {
                return response()->json(['status' => false, 'message' => 'Invoice not found.'], 404);
            }

            // Validate the request data
            $validated = $request->validate([
                'type' => 'required|in:routes,parking,ups,order,custom',
                'custom_invoice_id' => 'required|unique:payments,custom_invoice_id,' . $id, // Unique validation excluding the current ID
            ]);

            // Prepare the data for update
            $requestData = $request->all();
            $metaData = [];

            // Process meta-data for arrays
            foreach ($requestData as $key => $value) {
                if (is_array($value)) {
                    $metaData[] = [
                        'meta_key' => $key,
                        'meta_value' => json_encode($value)
                    ];
                }
            }

            // Define invoice types
            $INVOICE_TYPE = [
                "routes" => "Routes Invoice",
                "parking" => "Parking Yards",
                "ups" => "UPS Invoice",
                "order" => "Add On Invoice",
                "custom" => "Custom Invoice"
            ];

            // Update the invoice record
            $invoice->update([
                'type' => $validated['type'],
                'company_id' => $request->company_id ?? null,
                'vendor_id' => $request->vendor_id ?? $invoice->vendor_id,
                'vendor_name' => $request->vendor_name ?? $invoice->vendor_name,
                'vendor_address' => $request->vendor_address ?? $invoice->vendor_address,
                'vendor_email' => $request->vendor_email ?? $invoice->vendor_email,
                'vendor_phone' => $request->vendor_phone ?? $invoice->vendor_phone,
                'vendor_no' => $request->vendor_no ?? $invoice->vendor_no,
                'routes_id' => $request->routes_id ?? $invoice->routes_id,
                'routes_name' => $request->routes_name ?? $invoice->routes_name,
                'start_date' => $request->start_date ?? $invoice->start_date ?? null,
                'end_date' => $request->end_date ?? $invoice->end_date ?? null,
                'due_date' => $request->due_date ?? $invoice->due_date ?? null,
                'payment' => $request->payment ?? $invoice->payment,
                'invoice_date' => $request->invoice_date ?? $invoice->invoice_date ?? null,
                'note' => $request->note ?? $invoice->note,
                'po_number' => $request->po_number ?? $invoice->po_number,
                'enable' => $request->isChecked ? 1 : 0,
                'custom_invoice_id' => $validated['custom_invoice_id'],
                'gst_no' => $request->gst_no ?? "",
                'route_type_name' => $INVOICE_TYPE[$validated['type']],
                'routes_type' => $request->routes_type ?? null,
                'is_term_condition' => $request->isCheckedTermCond ? 1 : 0 ?? false,
            ]);
            // Update metadata
            $this->handleMetaData($invoice, $metaData, $validated['type']);

            // Fetch the updated invoice data with metadata
            $invoiceData = Payment::with('meta')->where('id', $invoice->id)->first();
            if (isset($invoiceData->meta) && count($invoiceData->meta) > 0) {
                return response()->json(['status' => true, 'message' => 'Invoice updated successfully', 'invoice' => $invoice]);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update invoice']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'error' => $e->validator->errors(),
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (!empty($id)) {
            $invoice = Payment::with('meta')->where('id', $id)->first();
            
            if ($invoice) {
                // Delete the associated meta data
                $invoice->meta()->delete();

                // Delete the invoice itself
                $invoice->delete();

                return response()->json(['status' => true, 'message' => 'Invoice data deleted successfully.']);
            } else {
                return response()->json(['status' => false, 'message' => 'Invoice not found.']);
            }
        }
    }
    public function updatePaymentStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:routes,parking,ups,order,custom',
            ]);
            $invoice = Payment::with('meta')->where('id', $request->invoiceId)->where('type', $validated['type'])->first();

            if ($invoice) {
                $invoice->payment = $request->payment;
                $invoice->payment_note = $request->paymentNote;
                $invoice->payment_mode = $request->paymentMode;
                if ($invoice->save()) {
                    return response()->json(['status' => true, 'message' => "Payment status update successfully"]);
                } else {
                    return response()->json(['status' => false, 'message' => "Failed to update payment status"]);
                }
            } else {
                return response()->json(['status' => false, 'message' => "Invoice not found"]);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update payment status, please try again.',
                'error' => $e->validator->errors(),
            ], 500);
            // return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    public function updateDeleteStatus($id, Request $request)
    {
        // dd($request->all(), $id);
        try {
            $validated = $request->validate([
                'status' => 'nullable|in:Cancel,Void',
                'type' => 'required|in:routes,parking,ups,order,custom',
            ]);
            $invoice = Payment::where('id', $id)->where('type', $validated['type'])->first();

            if ($invoice) {
                $invoice->status = $validated['status'];
                if ($invoice->save()) {
                    return response()->json(['status' => true, 'message' => "Status update successfully"]);
                } else {
                    return response()->json(['status' => false, 'message' => "Failed to update status"]);
                }
            } else {
                return response()->json(['status' => false, 'message' => "Invoice not found"]);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update payment status, please try again.',
                'error' => $e->validator->errors(),
            ], 500);
            // return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }
    public function downloadPDFInvoice(Request $request, $id)
    {
        if (!empty($id)) {
            $invoiceData = Payment::with(['meta', 'company'])->where('id', $id)->where('type', $request->type)->first();
            // dd($invoiceData->to, $id);
            
            $invoiceData->each(function ($payment) {
                // Initialize an empty array to store transformed meta data
                $metaData = [];

                // Ensure 'meta' is not null and is a valid collection
                if ($payment->meta && $payment->meta->isNotEmpty()) {
                    // Process 'meta' collection into a key-value pair
                    foreach ($payment->meta as $meta) {
                        // If meta_key and meta_value are available, add them as key-value pairs
                        if ($meta->meta_key && $meta->meta_value) {
                            $metaData[$meta->meta_key] = $meta->meta_value;
                        }
                    }
                }

                // Now we assign it back to a custom field (transformed meta)
                $payment->transformed_meta = $metaData;  // This is a new custom field
            });
            // $invoiceData = Invoice::with('invoice_vendor')->find($request->id);
            // $taxData = TaxType::whereIn('id', explode(',', $invoiceData->tax_id))->pluck('tax_type');
            // $routeData = Routes::where('id', $invoiceData->routes_id)->pluck('name');
            // $invoiceData->tax_type = implode(', ', $taxData->toArray());
            // $invoiceData->route_name = $routeData[0];
            // $invoiceData->logo_image = base64_encode(file_get_contents(public_path('/assets/img/logo_new.png')));
            // $pdf = PDF::loadView('invoice.invoicePdf', compact('invoiceData'));

            // $filename = 'invoice.pdf';
            // $date = date("Y-m-d");
            // $pdf->save(public_path('/invoice/invoice_' . $request->id . '_' . $date . '.pdf'));
            // return $pdf->download(public_path('/invoice/invoice_' . $request->id . '_' . $date . '.pdf'));

            // $invoiceData = Invoice::with('invoice_vendor')->find($request->id);
            // $taxData = TaxType::whereIn('id', explode(',', $invoiceData->tax_id))->pluck('tax_type');
            // $routeData = Routes::where('id', $invoiceData->routes_id)->pluck('name');

            // // Prepare data for the view
            // $invoiceData->tax_type = implode(', ', $taxData->toArray());
            // $invoiceData->route_name = $routeData[0];
            // dd($invoiceData->company['logo']);
            if (!empty($invoiceData->company['logo']) && file_exists(public_path("company/{$invoiceData->company['logo']}"))) {
                $filePath = public_path("company/{$invoiceData->company['logo']}");
                $invoiceData->logo_image = base64_encode(file_get_contents(public_path("/company/{$invoiceData->company['logo']}")));
                // $invoiceData->logo_image = 'data:image/' . pathinfo($filePath, PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($filePath));
            } else {
                $invoiceData->logo_image = null; // or a default image
            }
            // $invoiceData->logo_image = base64_encode(file_get_contents(public_path("/company/{$invoiceData->logo}")));
            // dd($invoiceData->toArray());
            // Generate the PDF
            // dd($invoiceData->toArray());
            if ($request->type === "routes") {
                // return view('invoice.invoicePdf', compact('invoiceData'));

                $pdf = PDF::loadView('invoice.invoicePdf', compact('invoiceData'));
            } else if ($request->type === "parking") {
                // return view('invoice.parkingPdf', compact('invoiceData'));
                $pdf = PDF::loadView('invoice.parkingPdf', compact('invoiceData'));
            } else if ($request->type === "ups") {
                // return view('invoice.upsInvoicePdf', compact('invoiceData'));
                $pdf = PDF::loadView('invoice.upsInvoicePdf', compact('invoiceData'));
            } else if ($request->type === "order") {
                // return view('invoice.addOnInvoicePdf', compact('invoiceData'));
                $pdf = PDF::loadView('invoice.addOnInvoicePdf', compact('invoiceData'));
            } else {
                // return view('invoice.customInvoicePdf', compact('invoiceData'));
                $pdf = PDF::loadView('invoice.customInvoicePdf', compact('invoiceData'));
            }
            $formattedVendorName = strtolower(str_replace(' ', '_', $invoiceData->vendor_name));
            $result = $formattedVendorName . '_' . $invoiceData->custom_invoice_id . '.pdf';
            return $pdf->stream($result);
        } else {
            return response()->json(['status' => false, 'message' => 'Invoice details not found']);
        }
    }

    public function viewdownloadPDFInvoice()
    {
        $id = 1;
        if (!empty($id)) {
            $invoiceData = Invoice::with('invoice_vendor')->find($id);
            $taxData = TaxType::whereIn('id', explode(',', $invoiceData->tax_id))->pluck('tax_type');
            $routeData = Routes::where('id', $invoiceData->routes_id)->pluck('name');
            $invoiceData->tax_type = implode(', ', $taxData->toArray());
            $invoiceData->route_name = $routeData[0];
            $invoiceData->logo_image = base64_encode(file_get_contents(public_path('/assets/img/logo_new.png')));
            // dd($invoiceData->toArray(), $routeData[0]);
            // dd($invoiceData->toArray());
            return view('invoice.invoicePdf', compact('invoiceData'));
            // $pdf = PDF::loadView('invoice.invoicePdf', compact('invoiceData'));
            // return $pdf->download('invoice.pdf');
        } else {
            return response()->json(['status' => false, 'message' => 'Invoice details not found']);
        }
    }

    public function getInvoiceWithRoutesVendors(Request $request)
    {
        if ($request->filled(['vendor_id', 'routes_id'])) {
            $query = Payment::where('vendor_id', $request->vendor_id)
                ->where('routes_id', $request->routes_id)
                ->where('type', $request->type);

            if ($request->filled('routes_type') && $request->type === "routes") {
                $query->where('routes_type', $request->routes_type);
            }

            $invoice = $query->latest('id')->first();

            return response()->json(['status' => true, 'data' => $invoice]);
        }

        return response()->json(['status' => false, 'message' => 'Invalid input data.']);
        // if (!empty($request->vendor_id) && !empty($request->routes_id)) {
        //     if (isset($request->routes_type) && !empty($request->routes_type)) {
        //         dd("if");
        //         $invoice = Payment::where('vendor_id', $request->vendor_id)
        //             ->where('routes_id', $request->routes_id)
        //             ->where('type', $request->type)
        //             ->where('routes_type', $request->routes_type)
        //             ->latest('id') // Replace 'id' with 'created_at' if needed
        //             ->first();
        //         return response()->json(['status' => true, "data" => $invoice]);
        //     } else {
        //         dd("else");
        //         $invoice = Payment::where('vendor_id', $request->vendor_id)
        //             ->where('routes_id', $request->routes_id)
        //             ->where('type', $request->type)
        //             ->latest('id') // Replace 'id' with 'created_at' if needed
        //             ->first();
        //         return response()->json(['status' => true, "data" => $invoice]);
        //     }
        // }
    }
}
