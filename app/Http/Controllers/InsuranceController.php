<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Insurance;
use App\Models\Reminder;
use Illuminate\Support\Facades\File;
use Auth;
use Illuminate\Support\Facades\Schema;

class InsuranceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('insurances');
        $query = Insurance::with('vehicle');
        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });
        if (!empty($request->page) && $request->page !== "page") {
            $insurance = $query->orderBy('id', 'desc')->paginate(20);
            if (!empty($insurance)) {
                return response()->json(['status' => true, 'insurance' => $insurance]);
            } else {
                return response()->json(['status' => false, 'message' => 'Insurance not found']);
            }
        } else if ($request->page === "page") {
            $insurance = $query->orderBy('id', 'desc')->paginate(10);
            if (!empty($insurance)) {
                return response()->json(['status' => true, 'insurance' => $insurance]);
            } else {
                return response()->json(['status' => false, 'message' => 'Insurance not found']);
            }
        } else if ($request->page === null) {
            $insurance = $query->get();
            if (!empty($insurance)) {
                return response()->json(['status' => true, 'insurance' => $insurance]);
            } else {
                return response()->json(['status' => false, 'message' => 'Insurance not found']);
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
                'company_name' => 'required',
                'insured_name' => 'required',
                'vch_plate_no' => 'required',
                'contact_email' => 'required',
                // 'email_cc' => 'required',
                // 'email_bcc' => 'required',
                // 'insured_address' => 'required',
                // 'insured_address' => 'required',
                'policy_number' => 'required|unique:insurances,policy_no',
                'contact_number' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|',
                'start_date' => 'required',
                'end_date' => 'required',
                'days_before' => 'required',
                'recurring_day' => 'required',
                'recurring_date' => 'required',
                'insurance_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
            ]);
            // dd($validatedData);
            $insuranceFile = "";
            if ($request->file('insurance_file')) {
                $file = $request->file('insurance_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $insuranceFile = time() . '.' . $request->insurance_file->extension();
                    $request->insurance_file->move(public_path('insurance'), $insuranceFile);
                    $filePath = public_path('insurance/' . $insuranceFile);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['insurance_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }
            $insurance = new Insurance;
            $insurance->user_id = Auth::user()->id;
            $insurance->company_name = $validatedData['company_name'];
            $insurance->vehicle_id = $validatedData['vch_plate_no'];
            $insurance->insured_name = $validatedData['insured_name'];
            $insurance->email = $validatedData['contact_email'];
            $insurance->cc_email = $request->email_cc;
            $insurance->bcc_email = $request->email_bcc;
            $insurance->address = $request->insured_address;
            $insurance->latitude = $request->latitude;
            $insurance->longitude = $request->longitude;
            $insurance->policy_no = $validatedData['policy_number'];
            $insurance->phone_no = $validatedData['contact_number'];
            $insurance->start_date = $validatedData['start_date'];
            $insurance->end_date = $validatedData['end_date'];
            $insurance->days_before = $validatedData['days_before'];
            $insurance->recurring_day = $validatedData['recurring_day'];
            $insurance->recurring_date = $validatedData['recurring_date'];
            $insurance->ins_file = $insuranceFile;
            if ($insurance->save()) {
                return response()->json(['status' => true, 'message' => 'Insurance data save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save insurance']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 401);
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
            $data = Insurance::with('vehicle')->where('id', $id)->first();
            return response()->json(['status' => true, 'vehicle' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Insurance not found']);
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
                'company_name' => 'required',
                'insured_name' => 'required',
                'vch_plate_no' => 'required',
                'contact_email' => 'required',
                // 'email_cc' => 'required',
                // 'email_bcc' => 'required',

                // 'insured_address' => 'required',
                'policy_number' => 'required|unique:insurances,policy_no,' . $id,
                'contact_number' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|',
                'start_date' => 'required',
                'end_date' => 'required',
                'days_before' => 'required',
                'recurring_day' => 'required',
                'recurring_date' => 'required',
                'insurance_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
            ]);
            // dd($validatedData);
            $insuranceFile = "";
            if ($request->has('insurance_exist_file')) {
                $insuranceFile = $request->insurance_exist_file;
            } elseif ($request->file('insurance_file')) {
                $file = $request->file('insurance_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $insuranceFile = time() . '.' . $request->insurance_file->extension();
                    $request->insurance_file->move(public_path('insurance'), $insuranceFile);
                    $filePath = public_path('insurance/' . $insuranceFile);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['insurance_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }
            $insurance = Insurance::find($id);
            if ($insurance) {
                if ($validatedData['end_date'] > $insurance->end_date) {
                    $reminder = Reminder::where('status', 'Pending')->where('insurance_id', $insurance->id)->first();
                    $reminder->status = "Completed";
                    $reminder->save();
                }
                $insurance->user_id = Auth::user()->id;
                $insurance->company_name = $validatedData['company_name'];
                $insurance->vehicle_id = $validatedData['vch_plate_no'];
                $insurance->insured_name = $validatedData['insured_name'];
                $insurance->email = $validatedData['contact_email'];
                $insurance->cc_email = $request->email_cc;
                $insurance->bcc_email = $request->email_bcc;
                $insurance->address = $request->insured_address;
                $insurance->latitude = $request->latitude;
                $insurance->longitude = $request->longitude;
                $insurance->policy_no = $validatedData['policy_number'];
                $insurance->phone_no = $validatedData['contact_number'];
                $insurance->start_date = $validatedData['start_date'];
                $insurance->end_date = $validatedData['end_date'];
                $insurance->days_before = $validatedData['days_before'];
                $insurance->recurring_day = $validatedData['recurring_day'];
                $insurance->recurring_date = $validatedData['recurring_date'];
                $insurance->ins_file = $insuranceFile;
                if ($insurance->save()) {
                    return response()->json(['status' => true, 'message' => 'Insurance update successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to update insurance']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Insurance not found']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 401);
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
            $insurance = Insurance::find($id);
            $insurancefile = public_path('insurance');
            $this->removeFiles($insurancefile, $insurance->ins_file);
            if ($insurance->delete()) {
                return response()->json(['status' => true, 'message' => 'Insurance delete successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Insurance not found']);
            }
        }
    }
    public function removeFiles($directory, $file)
    {
        // $directory = public_path('driver/licence');
        if (File::isDirectory($directory)) {
            $filePath = $directory . '/' . $file;
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
        }
    }
}
