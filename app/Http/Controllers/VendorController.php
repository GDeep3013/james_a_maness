<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vendor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Auth;
use Exception;
use Illuminate\Support\Facades\Schema;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $tableColumns = Schema::getColumnListing('vendors');
        $query = Vendor::orderBy('id', 'desc');
        $searchTerm = $request->search;

        // $query->where(function ($query) use ($tableColumns, $searchTerm) {
        //     foreach ($tableColumns as $column) {
        //         if ($column !== 'created_at' && $column !== 'updated_at') {
        //             $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
        //         }
        //     }
        // });
        $query = Vendor::query();

        // Apply search filtering only if search term is provided
        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($tableColumns, $searchTerm) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at'])) {
                        $q->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                    
                }
            });
        }

        // Sort alphabetically by first_name
        $query->orderBy('first_name', 'asc');

        if (!empty($request->page)) {
            
            $vendors = $query->paginate(20);
            if (!empty($vendors)) {
                return response()->json(['status' => true, 'vendor' => $vendors]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vendor not found']);
            }
        } else {
            $vendors = Vendor::get();
            if (!empty($vendors)) {
                return response()->json(['status' => true, 'vendor' => $vendors]);
            } else {
                return response()->json(['status' => false, 'message' => 'Vendor not found']);
            }
        }
        // if (!empty($request->page)) {
        //     $vendors = Vendor::where('user_id', Auth::user()->id)->paginate(20);
        //     if (!empty($vendors)) {
        //         return response()->json(['status' => true, 'vendor' => $vendors]);
        //     } else {
        //         return response()->json(['status' => false, 'message' => 'Vendor not found']);
        //     }
        // } else {

        //     $vendors = Vendor::all();
        //     if (!empty($vendors)) {
        //         return response()->json(['status' => true, 'vendor' => $vendors]);
        //     } else {
        //         return response()->json(['status' => false, 'message' => 'Vendor not found']);
        //     }
        // }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // return response()->json(['status' => 'error', 'message' => ['email' =>'Data saved successfully']]);
        try {
            $validatedData = $request->validate([
                'first_name' => 'required',
                'address' => 'nullable',
                'longitude' => 'nullable',
                'latitude' => 'nullable',
                'city' => 'nullable',
                'state' => 'nullable',
                'country' => 'nullable',
                'zip' => 'nullable',
                'email' => 'required|email|max:255|unique:vendors,email',
                'company_contact' => 'required|unique:vendors',
                'website' => 'nullable|url|max:255',
                'labels' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'contact_name' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'contact_email' => 'nullable|email|max:255',
                'charging' => 'nullable|boolean',
                'fuel' => 'nullable|boolean',
                'service' => 'nullable|boolean',
                'vehicle' => 'nullable|boolean',
            ]);
            $vendor = new Vendor;
            $vendor->user_id = Auth::user()->id;
            $vendor->first_name = $validatedData['first_name'] ? $validatedData['first_name'] : '';
            $vendor->company_contact = $validatedData['company_contact'] ? $validatedData['company_contact'] : '';
            $vendor->email = $validatedData['email'] ? $validatedData['email'] : '';
            $vendor->website = $validatedData['website'] ?? null;
            $vendor->labels = $validatedData['labels'] ?? null;
            $vendor->address = $validatedData['address'] ? $validatedData['address'] : '';
            $vendor->latitude = $validatedData['latitude'] ? $validatedData['latitude'] : "";
            $vendor->longitude = $validatedData['longitude'] ? $validatedData['longitude'] : "";
            $vendor->city = $validatedData['city'] ? $validatedData['city'] : '';
            $vendor->state = $validatedData['state'] ? $validatedData['state'] : '';
            $vendor->country = $validatedData['country'] ? $validatedData['country'] : '';
            $vendor->zip = $validatedData['zip'] ? $validatedData['zip'] : '';
            $vendor->notes = $validatedData['notes'] ?? null;
            $vendor->contact_name = $validatedData['contact_name'] ?? null;
            $vendor->contact_phone = $validatedData['contact_phone'] ?? null;
            $vendor->contact_email = $validatedData['contact_email'] ?? null;
            $vendor->charging = $validatedData['charging'] ?? false;
            $vendor->fuel = $validatedData['fuel'] ?? false;
            $vendor->service = $validatedData['service'] ?? false;
            $vendor->vehicle = $validatedData['vehicle'] ?? false;

            if ($vendor->save()) {
                return response()->json(['status' => true, 'message' => 'Vendor saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save vendor'], 500);
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        if ($id) {
            $data = Vendor::where('id', $id)->first();
            return response()->json(['status' => true, 'data' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Vendor not found']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {}

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                'first_name' => 'required',
                'address' => 'nullable',
                'longitude' => 'nullable',
                'latitude' => 'nullable',
                'city' => 'nullable',
                'state' => 'nullable',
                'country' => 'nullable',
                'zip' => 'nullable',
                'email' => 'required|email|max:255|unique:vendors,email,' . $id,
                'company_contact' => 'required|unique:vendors,company_contact,' . $id,
                'website' => 'nullable|url|max:255',
                'labels' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'contact_name' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'contact_email' => 'nullable|email|max:255',
                'charging' => 'nullable|boolean',
                'fuel' => 'nullable|boolean',
                'service' => 'nullable|boolean',
                'vehicle' => 'nullable|boolean',
            ]);

            $vendor = Vendor::find($id);
            if (!$vendor) {
                return response()->json(['status' => false, 'message' => 'Vendor not found']);
            }
            $vendor->user_id = Auth::user()->id;
            $vendor->first_name = $validatedData['first_name'] ? $validatedData['first_name'] : '';
            $vendor->company_contact = $validatedData['company_contact'] ? $validatedData['company_contact'] : '';
            $vendor->email = $validatedData['email'] ? $validatedData['email'] : '';
            $vendor->website = $validatedData['website'] ?? null;
            $vendor->labels = $validatedData['labels'] ?? null;
            $vendor->address = $validatedData['address'] ? $validatedData['address'] : '';
            $vendor->latitude = $validatedData['latitude'] ? $validatedData['latitude'] : "";
            $vendor->longitude = $validatedData['longitude'] ? $validatedData['longitude'] : "";
            $vendor->city = $validatedData['city'] ? $validatedData['city'] : '';
            $vendor->state = $validatedData['state'] ? $validatedData['state'] : '';
            $vendor->country = $validatedData['country'] ? $validatedData['country'] : '';
            $vendor->zip = $validatedData['zip'] ? $validatedData['zip'] : '';
            $vendor->notes = $validatedData['notes'] ?? null;
            $vendor->contact_name = $validatedData['contact_name'] ?? null;
            $vendor->contact_phone = $validatedData['contact_phone'] ?? null;
            $vendor->contact_email = $validatedData['contact_email'] ?? null;
            $vendor->charging = $validatedData['charging'] ?? false;
            $vendor->fuel = $validatedData['fuel'] ?? false;
            $vendor->service = $validatedData['service'] ?? false;
            $vendor->vehicle = $validatedData['vehicle'] ?? false;
            if ($vendor->save()) {
                return response()->json(['status' => true, 'message' => 'Vendor update successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update vendor']);
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

        if ($id) {
            $vendor = Vendor::find($id);

            if ($vendor->delete()) {
                return response()->json(['status' => true, 'message' => 'Vendor delete successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Vendor not found']);
            }
        }
    }
}
