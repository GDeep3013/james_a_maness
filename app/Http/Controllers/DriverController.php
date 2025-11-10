<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use App\Models\Reminder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\DriverRegistrationMail;
use Illuminate\Support\Facades\File;
use Mockery\Undefined;
use Auth;
use Illuminate\Support\Facades\Schema;
use Log;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('drivers');
        $query = Driver::with(['user:id,profile_picture'])->orderBy('id', 'desc');
        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
            $query->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$searchTerm%"]);
        });

        $driver = $query->paginate(20);

        return response()->json(['status' => true, 'driver' => $driver]);
        
        
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
                'first_name' => 'required',
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:drivers,phone',
                'email' => 'required|email|max:255|unique:drivers,email|unique:users,email',
                'password' => 'required',
                'address' => 'nullable',
                'license_no' => 'required|unique:drivers,license_no|min:10',
                'license_no_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                // 'license_class' => 'nullable',
                'license_issue_country' => 'nullable',
                'license_issue_state' => 'nullable',
                'license_issue_date' => 'nullable',
                'license_expire_date' => 'nullable',
                'status_in_canada' => 'nullable',
                'canada_doc_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'doc_expiry_date' => 'nullable',
                'job_join_date' => 'nullable',
                'offer_letter_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                // 'job_leave_date' => 'nullable',
                'emergency_contact_name' => 'nullable',
                'emergency_contact_no' => 'nullable|string|regex:/^\+?[0-9\s\-\(\)]+$/',
                'emergency_contact_address' => 'nullable',
                'profile_picture' => 'nullable|mimes:jpeg,jpg,png,webp|max:5120'
            ]);

            $existingUser = User::where('email', $validatedData['email'])->first();
            if ($existingUser) {
                return response()->json([
                    'status' => 'error',
                    'errors' => ['email' => ['A user with this email already exists.']]
                ], 422);
            }
            // dd($validatedData);
            $licenceFile = "";
            $canadaFile = "";
            $offerFile = "";
            $othersFile = "";
            $profilePicture="";

            if ($request->file('profile_picture')) {
                $file = $request->file('profile_picture');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $profilePicture = time() . '.' . $request->profile_picture->extension();
                    $request->profile_picture->move(public_path('users/profile'), $profilePicture);
                    $filePath = public_path('users/profile/' . $profilePicture);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['profile_picture' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, with a maximum file size of 2MB.']]);
                }
            }

            if ($request->file('license_no_file')) {
                $file = $request->file('license_no_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $licenceFile = time() . '.' . $request->license_no_file->extension();
                    $request->license_no_file->move(public_path('driver/licence'), $licenceFile);
                    $filePath = public_path('driver/licence/' . $licenceFile);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['licence_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }
           
            if ($request->file('offer_letter_file')) {
                $file = $request->file('offer_letter_file');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $offerFile = time() . '.' . $request->offer_letter_file->extension();
                    $request->offer_letter_file->move(public_path('driver/offer_letter'), $offerFile);
                    $filePath = public_path('driver/offer_letter/' . $offerFile);
                    chmod($filePath, 0775);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['jobjoin_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 2MB.']]);
                }
            }
           

            DB::beginTransaction();

            $user = new User;
            $user->name = $validatedData['first_name'] . ' ' . ($request->last_name ?? '');
            $user->email = $validatedData['email'];
            $user->profile_picture = $profilePicture;
            $user->password = Hash::make($validatedData['password']);
            $user->phone = $validatedData['phone'];
            $user->address = $request->address ?? null;
            $user->country = $request->country ?? null;
            $user->state = $request->state ?? null;
            $user->city = $request->city ?? null;
            $user->zip = $request->zip ?? null;
            $user->type = 'Driver';
            $user->status = $request->status === 'Active' ? 1 : 0;
            
            if (!$user->save()) {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to create user account']);
            }

            $driver = new Driver;
            $driver->user_id = $user->id;
            $driver->email = $user->email;
            $driver->phone = $user->phone;

            $driver->first_name = $validatedData['first_name'];
            $driver->last_name = $request->last_name;
   
            $driver->gender = $request->gender;
            $driver->dob = $request->dob;
            $driver->sin_no = $request->sin_no;

      
            $driver->license_no = $validatedData['license_no'];
            $driver->license_no_file = $licenceFile;
            $driver->license_class = $request->license_class;
            $driver->license_issue_country = $validatedData['license_issue_country']??null;
            $driver->license_issue_state = $validatedData['license_issue_state']??null;
            $driver->license_issue_date = $validatedData['license_issue_date']??null;
            $driver->license_expire_date = $validatedData['license_expire_date']??null;
            $driver->status_in_country = $request->status_in_country??'work';
            $driver->doc_expiry_date = $validatedData['doc_expiry_date']??null;
            $driver->job_join_date = $validatedData['job_join_date']??null;
            $driver->offer_letter_file = $offerFile;
            $driver->job_leave_date = $request->job_leave_date??null;
            $driver->emergency_contact_name = $validatedData['emergency_contact_name']??null;
            $driver->emergency_contact_no = $validatedData['emergency_contact_no']??null;
            $driver->emergency_contact_address = $validatedData['emergency_contact_address']??null;
            $driver->designation = $request->designation??null;
            $driver->immigration_status = $request->immigration_status??null;
            $driver->comment = $request->comment??null;

            if ($driver->save()) {
                DB::commit();
                $mailData = [
                    'title' => 'Mail From '.config('app.name').' - Driver Registration' ,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'password' => $validatedData['password'],
                    'email' => $user->email,
                    'logo_image' => base64_encode(file_get_contents(public_path('/images/logo.png')))
                ];

                // try {
                //     Mail::to($user->email)->send(new DriverRegistrationMail($mailData));
                // } catch (\Exception $e) {
                //     Log::error("Driver registration: Failed to send mail to {$user->email}. Error: " . $e->getMessage());
                // }

                return response()->json(['status' => true, 'message' => 'Driver saved successfully']);
                
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to save driver']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 401);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error("Driver creation error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while creating the driver. Please try again.'], 500);
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
        // dd($id);
        if (!empty($id)) {
            $data = Driver::with(['user:id,profile_picture'])->where('id', $id)->first();
            return response()->json(['status' => true, 'message' => 'Driver list', 'driver' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Driver not found']);
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
        if (!empty($id)) {
            $data = Driver::with(['user'])->where('id', $id)->first();
            return response()->json(['status' => true, 'message' => 'Driver list', 'data' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Driver not found']);
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
        if (empty($id)) {
            return response()->json(['status' => false, 'message' => 'Driver not found'], 404);
        }

        $driver = Driver::with('user')->find($id);
        if (!$driver) {
            return response()->json(['status' => false, 'message' => 'Driver not found'], 404);
        }

        try {
            $validatedData = $request->validate([
                'first_name' => 'required',
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:drivers,phone,' . $id,
                'email' => 'required|email|max:255|unique:drivers,email,' . $id . '|unique:users,email,' . $driver->user_id,
                'password' => 'nullable|min:6',
                'address' => 'nullable',
                'license_no' => 'required|unique:drivers,license_no,' . $id . '|min:10',
                'license_no_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'license_issue_country' => 'nullable',
                'license_issue_state' => 'nullable',
                'license_issue_date' => 'nullable',
                'license_expire_date' => 'nullable',
                'status_in_canada' => 'nullable',
                'canada_doc_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'doc_expiry_date' => 'nullable',
                'job_join_date' => 'nullable',
                'offer_letter_file' => 'nullable|mimes:jpeg,jpg,png,pdf,zip|max:5120',
                'job_leave_date' => 'nullable',
                'emergency_contact_name' => 'nullable',
                'emergency_contact_no' => 'nullable|string|regex:/^\+?[0-9\s\-\(\)]+$/',
                'emergency_contact_address' => 'nullable',
                'profile_picture' => 'nullable|mimes:jpeg,jpg,png,webp|max:5120',
            ]);

            $licenceFile = $driver->license_no_file;
            $offerFile = $driver->offer_letter_file;
            $profilePicture = $driver->user->profile_picture ?? "";

            if ($request->file('profile_picture')) {
                $file = $request->file('profile_picture');
                if ($file->isValid()) {
                    if ($profilePicture && File::exists(public_path('users/profile/' . $profilePicture))) {
                        File::delete(public_path('users/profile/' . $profilePicture));
                    }
                    $profilePicture = time() . '.' . $request->profile_picture->extension();
                    $request->profile_picture->move(public_path('users/profile'), $profilePicture);
                    $filePath = public_path('users/profile/' . $profilePicture);
                    chmod($filePath, 0775);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['profile_picture' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, with a maximum file size of 5MB.']], 422);
                }
            }

            if ($request->file('license_no_file')) {
                $file = $request->file('license_no_file');
                if ($file->isValid()) {
                    if ($licenceFile && File::exists(public_path('driver/licence/' . $licenceFile))) {
                        File::delete(public_path('driver/licence/' . $licenceFile));
                    }
                    $licenceFile = time() . '.' . $request->license_no_file->extension();
                    $request->license_no_file->move(public_path('driver/licence'), $licenceFile);
                    $filePath = public_path('driver/licence/' . $licenceFile);
                    chmod($filePath, 0775);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['license_no_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 5MB.']], 422);
                }
            }

            if ($request->file('offer_letter_file')) {
                $file = $request->file('offer_letter_file');
                if ($file->isValid()) {
                    if ($offerFile && File::exists(public_path('driver/offer_letter/' . $offerFile))) {
                        File::delete(public_path('driver/offer_letter/' . $offerFile));
                    }
                    $offerFile = time() . '.' . $request->offer_letter_file->extension();
                    $request->offer_letter_file->move(public_path('driver/offer_letter'), $offerFile);
                    $filePath = public_path('driver/offer_letter/' . $offerFile);
                    chmod($filePath, 0775);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['offer_letter_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 5MB.']], 422);
                }
            }

            DB::beginTransaction();

            $user = $driver->user;
            if (!$user) {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Associated user not found'], 404);
            }

            $user->name = $validatedData['first_name'] . ' ' . ($request->last_name ?? '');
            $user->email = $validatedData['email'];
            if ($profilePicture) {
                $user->profile_picture = $profilePicture;
            }
            if (!empty($validatedData['password'])) {
                $user->password = Hash::make($validatedData['password']);
            }
            $user->phone = $validatedData['phone'];
            $user->address = $request->address ?? null;
            $user->country = $request->country ?? null;
            $user->state = $request->state ?? null;
            $user->city = $request->city ?? null;
            $user->zip = $request->zip ?? null;
            $user->status = $request->status === 'Active' ? 1 : 0;

            if (!$user->save()) {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to update user account'], 500);
            }

            $driver->first_name = $validatedData['first_name'];
            $driver->last_name = $request->last_name ?? null;
            $driver->gender = $request->gender ?? null;
            $driver->dob = $request->dob ?? null;
            $driver->sin_no = $request->sin_no ?? null;
            $driver->phone = $validatedData['phone'];
            $driver->email = $validatedData['email'];

            $driver->license_no = $validatedData['license_no'];
            $driver->license_no_file = $licenceFile;
            $driver->license_class = $request->license_class ?? null;
            $driver->license_issue_country = $request->license_issue_country ?? null;
            $driver->license_issue_state = $request->license_issue_state ?? null;
            $driver->license_issue_date = $request->license_issue_date ?? null;
            $driver->license_expire_date = $request->license_expire_date ?? null;
            $driver->status_in_country = $request->status_in_country ?? null;

            $driver->doc_expiry_date = $request->doc_expiry_date ?? null;
            $driver->job_join_date = $request->job_join_date ?? null;
            $driver->offer_letter_file = $offerFile;
            $driver->job_leave_date = $request->job_leave_date ?? null;
            $driver->emergency_contact_name = $request->emergency_contact_name ?? null;
            $driver->emergency_contact_no = $request->emergency_contact_no ?? null;
            $driver->emergency_contact_address = $request->emergency_contact_address ?? null;
            $driver->designation = $request->designation ?? null;
            $driver->status = $request->status ?? 'Active';
            $driver->immigration_status = $request->immigration_status ?? null;
            $driver->comment = $request->comment ?? null;

            if ($driver->save()) {
                DB::commit();

                if (!empty($validatedData['password'])) {
                    try {
                        $mailData = [
                            'title' => 'Mail From ' . config('app.name') . ' - Password Updated',
                            'name' => $user->name,
                            'phone' => $user->phone,
                            'password' => $validatedData['password'],
                            'email' => $user->email,
                            'logo_image' => base64_encode(file_get_contents(public_path('/images/logo.png')))
                        ];
                        Mail::to($user->email)->send(new DriverRegistrationMail($mailData));
                    } catch (\Exception $e) {
                        Log::error("Driver update: Failed to send mail to {$user->email}. Error: " . $e->getMessage());
                    }
                }

                return response()->json(['status' => true, 'message' => 'Driver updated successfully']);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to update driver'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error("Driver update error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while updating the driver. Please try again.'], 500);
        }
    }

    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = substr(str_shuffle($characters), 0, $length);

        return $randomString;
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
            $Driver = Driver::find($id);
            $license_no_file = public_path('driver/licence');
            $this->removeFiles($license_no_file, $Driver->license_no_file);
            $canada_doc_file = public_path('driver/canada_status');
            $this->removeFiles($canada_doc_file, $Driver->canada_doc_file);
            $offer_letter_file = public_path('driver/offer_letter');
            $this->removeFiles($offer_letter_file, $Driver->offer_letter_file);
            $other_doc = public_path('driver/others');
            $this->removeFiles($other_doc, $Driver->other_doc);
            if ($Driver->delete()) {
                return response()->json(['status' => true, 'message' => 'Driver Delete Successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Driver not found']);
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


    // public function RequestApproval(){
    //     return view('EmployeeManagement.driver.manage-req-approval');


    // }


}
