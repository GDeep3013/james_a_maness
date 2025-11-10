<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
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
use App\Models\PaymentMeta;
use App\Models\Vendor;

class ReportsController extends Controller
{
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
    // public function FilterSalesReport(Request $request)
    // {
    //     dd($request->all());
    //     $input= json_decode($request->data, true);

    //     if( $input['startDate'] != null && $input['endDate'] !== null ){

    //         $date_from = $input['startDate'];
    //         $date_to = $input['endDate'];
    //         $invoice = Invoice::whereBetween('created_at', [$date_from, $date_to])
    //         ->get();
    //         if($invoice){
    //             return response()->json(
    //                 [
    //                     'status' => 'success',
    //                     'message' => 'Invoice Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }else{
    //             return response()->json(
    //                 [
    //                     'status' => 'error',
    //                     'message' => 'Invoice Not Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }
    //     }

    //     if($input['startDate'] != null && $input['endDate'] == null && !empty($input['invoice'])){
    //         $date_from = $input['startDate'];
    //         $date_to = $input['endDate'];
    //         $invoice = Invoice::whereBetween('created_at', [$date_from, $date_to])
    //         ->where('id', $input['invoice'])
    //         ->get();
    //         if($invoice){
    //             return response()->json(
    //                 [
    //                     'status' => 'success',
    //                     'message' => 'Invoice Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }else{
    //             return response()->json(
    //                 [
    //                     'status' => 'error',
    //                     'message' => 'Invoice Not Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }
    //     }

    //     if($input['startDate'] != null && $input['endDate'] != null && !empty($input['poNumber'])){
    //         $date_from = $input['startDate'];
    //         $date_to = $input['endDate'];
    //         $invoice = Invoice::whereBetween('created_at', [$date_from, $date_to])
    //         ->where('po_number', $input['poNumber'])
    //         ->get();
    //         if($invoice){
    //             return response()->json(
    //                 [
    //                     'status' => 'success',
    //                     'message' => 'Invoice Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }else{
    //             return response()->json(
    //                 [
    //                     'status' => 'error',
    //                     'message' => 'Invoice Not Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }
    //     }

    //     if($input['startDate'] != null && $input['endDate'] != null && !empty($input['vendor'])){
    //         $date_from = $input['startDate'];
    //         $date_to = $input['endDate'];
    //         $invoice = Invoice::whereBetween('created_at', [$date_from, $date_to])
    //         ->where('vendor_id', $input['vendor'])
    //         ->get();
    //         if($invoice){
    //             return response()->json(
    //                 [
    //                     'status' => 'success',
    //                     'message' => 'Invoice Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }else{
    //             return response()->json(
    //                 [
    //                     'status' => 'error',
    //                     'message' => 'Invoice Not Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }

    //     }

    //     if($input['startDate'] != null && $input['endDate'] != null && !empty($input['vendor']) && !empty($input['poNumber']) && !empty($input['invoice'])){
    //         $date_from = $input['startDate'];
    //         $date_to = $input['endDate'];
    //         $invoice = Invoice::whereBetween('created_at', [$date_from, $date_to])
    //         ->where('vendor_id', $input['vendor'])
    //         ->where('po_number', $input['poNumber'])
    //         ->where('id', $input['invoice'])
    //         ->get();

    //         if($invoice){
    //             return response()->json(
    //                 [
    //                     'status' => 'success',
    //                     'message' => 'Invoice Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }else{
    //             return response()->json(
    //                 [
    //                     'status' => 'error',
    //                     'message' => 'Invoice Not Found',
    //                     'data' => $invoice
    //                 ]
    //             );
    //         }
    //     }
    // }
    public function getInvoiceSalesReport(Request $request)
    {
        // dd($request->all());
        $tableColumns = Schema::getColumnListing('payments');

        // Start building the query
        $query = Payment::with('meta')->where(function ($query) {
            $query->whereNull('status')
                  ->orWhere('status', '');
        });

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

        // Handle pagination logic based on the 'page' query parameter
        if (!empty($request->page) && $request->page !== "page" && $request->page !== "invoice") {
            $invoices = $query->orderBy('id', 'desc')->paginate(20);
        } elseif ($request->page === "page") {
            $invoices = $query->orderBy('id', 'desc')->paginate(10);
        } elseif ($request->page === "invoice") {
            $invoices = $query->get();
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
                'data' => $invoices->items(),  // Return the items (current page records)
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }
    public function FilterSalesReport(Request $request)
    {
        $input = $request->all();
        $query = Payment::with('meta')->where(function ($query) {
            $query->whereNull('status')
                  ->orWhere('status', '');
        })->orderBy('invoice_date', 'asc'); // Ensure 'meta' is a valid relationship.

        // Apply Filters
        if (!empty($input['startDate'])) {
            $startDate = Carbon::createFromFormat('Y-m-d', $input['startDate'])->startOfDay();
            $endDate = !empty($input['endDate'])
                ? Carbon::createFromFormat('Y-m-d', $input['endDate'])->endOfDay()
                : now();
            $query->whereBetween('invoice_date', [$startDate, $endDate]);
        }

        if (!empty($input['poNumber'])) {
            $query->where('po_number', $input['poNumber']);
        }

        if (!empty($input['vendor'])) {
            $query->where('vendor_id', $input['vendor']);
        }

        if (!empty($input['invoice'])) {
            $query->where('custom_invoice_id', $input['invoice']);
        }

        if (!empty($input['payment'])) {
            // Ensure `payment` is either a valid relation or column.
            $query->where('payment', $input['payment']);
        }

        // Paginate Results
        $invoices = $query->paginate($request->numRow);

        // Process Meta Data
        $invoices->each(function ($payment) {
            $metaData = [];

            if (is_array($payment->meta)) { // If meta is JSON column
                foreach ($payment->meta as $key => $value) {
                    $metaData[$key] = $value;
                }
            } elseif ($payment->meta && $payment->meta->isNotEmpty()) { // If meta is a relationship
                foreach ($payment->meta as $meta) {
                    if ($meta->meta_key && $meta->meta_value) {
                        $metaData[$meta->meta_key] = $meta->meta_value;
                    }
                }
            }

            $payment->transformed_meta = $metaData;
        });

        // Return Response
        if ($invoices->isNotEmpty()) {
            return response()->json([
                'status' => true,
                'invoice' => [
                    'data' => $invoices->items(),
                    'current_page' => $invoices->currentPage(),
                    'last_page' => $invoices->lastPage(),
                    'per_page' => $invoices->perPage(),
                    'total' => $invoices->total(),
                ],
            ]);
        } else {
            return response()->json(['status' => false, 'message' => 'Invoices Not Found', 'invoice' => []]);
        }


        // $input = $request->all();
        // $query = Payment::with('meta'); // Initialize query with 'meta' relationship.

        // // Apply Filters
        // if (!empty($input['startDate'])) {
        //     $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $input['startDate'])->startOfDay();
        //     $endDate = !empty($input['endDate']) 
        //         ? \Carbon\Carbon::createFromFormat('Y-m-d', $input['endDate'])->endOfDay()
        //         : now();
        //     $query->whereBetween('created_at', [$startDate, $endDate]);
        // }

        // if (!empty($input['poNumber'])) {
        //     $query->where('po_number', $input['poNumber']);
        // }

        // if (!empty($input['vendor'])) {
        //     $query->where('vendor_id', $input['vendor']);
        // }

        // if (!empty($input['invoice'])) {
        //     $query->where('id', $input['invoice']);
        // }

        // if (!empty($input['payment'])) {
        //     $query->whereHas('payment', $input['payment']);
        // }

        // // Paginate Results
        // $invoices = $query->paginate(20);

        // $invoices->each(function ($payment) {
        //     // Initialize an empty array to store transformed meta data
        //     $metaData = [];

        //     // Ensure 'meta' is not null and is a valid collection
        //     if ($payment->meta && $payment->meta->isNotEmpty()) {
        //         // Process 'meta' collection into a key-value pair
        //         foreach ($payment->meta as $meta) {
        //             // If meta_key and meta_value are available, add them as key-value pairs
        //             if ($meta->meta_key && $meta->meta_value) {
        //                 $metaData[$meta->meta_key] = $meta->meta_value;
        //             }
        //         }
        //     }

        //     // Now we assign it back to a custom field (transformed meta)
        //     $payment->transformed_meta = $metaData;  // This is a new custom field
        // });

        // if($invoices->isNotEmpty()) {
        //     return response()->json([
        //         'status' => true,
        //         'invoice' => [
        //             'data' => $invoices->items(),  // Return the items (current page records)
        //             'current_page' => $invoices->currentPage(),
        //             'last_page' => $invoices->lastPage(),
        //             'per_page' => $invoices->perPage(),
        //             'total' => $invoices->total(),
        //         ],
        //     ]);
        // }else {
        //     return response()->json(['status' => false, 'message' => 'Invoices Not Found', 'invoice' => []]);
        // }




        // // dd($request->all());
        // $input = $request->all();

        // $query = Payment::with('meta');


        // if ($input['startDate']) {
        //     $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $input['startDate'])->startOfDay();
        //     $query->whereBetween('created_at', [$startDate, $input['endDate'] ? \Carbon\Carbon::createFromFormat('Y-m-d', $input['endDate'])->endOfDay() : now()]);
        // }

        // if ($input['poNumber']) {
        //     $query->where('po_number', '=', $input['poNumber']);
        // }

        // if ($input['vendor']) {
        //     $query->where('vendor_id', '=', $input['vendor']);
        // }

        // if ($input['invoice']) {
        //     $query->where('id', '=', $input['invoice']);
        // }
        // if($input['payment']) {
        //     $query->where('payment', '=', $input['payment']);
        // }

        // $pageSize = 20;

        // $invoices = $query->paginate($pageSize);

        // if ($invoices->count() > 0) {
        //     return response()->json(['status' => 'success', 'message' => 'Invoices Found', 'data' => $invoices]);
        // } else {
        //     return response()->json(['status' => 'error', 'message' => 'Invoices Not Found', 'data' => []]);
        // }
    }
}
