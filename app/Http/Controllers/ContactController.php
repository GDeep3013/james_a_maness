<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\User;
use App\Models\Reminder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactRegistrationMail;
use Illuminate\Support\Facades\File;
use Mockery\Undefined;
use Auth;
use Illuminate\Support\Facades\Schema;
use Log;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('contacts');
        $query = Contact::with(['user:id,profile_picture'])->orderBy('id', 'desc');
        $searchTerm = $request->search;

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
            $query->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$searchTerm%"]);
        });

        $contact = $query->paginate(20);

        return response()->json(['status' => true, 'contact' => $contact]);
        
        
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
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:contacts,phone',
                'email' => 'required|email|max:255|unique:contacts,email|unique:users,email',
                'password' => 'required',
                'address' => 'nullable',
                'license_no' => 'required|unique:contacts,license_no|min:10',
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
                    $request->license_no_file->move(public_path('contact/licence'), $licenceFile);
                    $filePath = public_path('contact/licence/' . $licenceFile);
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
                    $request->offer_letter_file->move(public_path('contact/offer_letter'), $offerFile);
                    $filePath = public_path('contact/offer_letter/' . $offerFile);
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
            $user->type = 'Contact';
            $user->status = $request->status === 'Active' ? 1 : 0;
            
            if (!$user->save()) {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to create user account']);
            }

            $contact = new Contact;
            $contact->user_id = $user->id;
            $contact->email = $user->email;
            $contact->phone = $user->phone;

            $contact->first_name = $validatedData['first_name'];
            $contact->last_name = $request->last_name;
   
            $contact->gender = $request->gender;
            $contact->dob = $request->dob;
            $contact->sin_no = $request->sin_no;
      
            $contact->license_no = $validatedData['license_no'];
            $contact->license_no_file = $licenceFile;
            $contact->license_class = $request->license_class;
            $contact->license_issue_country = $validatedData['license_issue_country']??null;
            $contact->license_issue_state = $validatedData['license_issue_state']??null;
            $contact->license_issue_date = $validatedData['license_issue_date']??null;
            $contact->license_expire_date = $validatedData['license_expire_date']??null;
            $contact->status_in_country = $request->status_in_country??'work';
            $contact->doc_expiry_date = $validatedData['doc_expiry_date']??null;
            $contact->job_join_date = $validatedData['job_join_date']??null;
            $contact->offer_letter_file = $offerFile;
            $contact->job_leave_date = $request->job_leave_date??null;
            $contact->emergency_contact_name = $validatedData['emergency_contact_name']??null;
            $contact->emergency_contact_no = $validatedData['emergency_contact_no']??null;
            $contact->emergency_contact_address = $validatedData['emergency_contact_address']??null;
            $contact->designation = $request->designation??null;
            $contact->immigration_status = $request->immigration_status??null;
            $contact->comment = $request->comment??null;

            if ($contact->save()) {
                DB::commit();
                $mailData = [
                    'title' => 'Mail From '.config('app.name').' - Contact Registration' ,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'password' => $validatedData['password'],
                    'email' => $user->email,
                    'logo_image' => base64_encode(file_get_contents(public_path('/images/logo.png')))
                ];

                // try {
                //     Mail::to($user->email)->send(new ContactRegistrationMail($mailData));
                // } catch (\Exception $e) {
                //     Log::error("Contact registration: Failed to send mail to {$user->email}. Error: " . $e->getMessage());
                // }

                return response()->json(['status' => true, 'message' => 'Contact saved successfully']);
                
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to save contact']);
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
            Log::error("Contact creation error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while creating the contact. Please try again.'], 500);
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
            $data = Contact::with(['user:id,profile_picture'])->where('id', $id)->first();
            return response()->json(['status' => true, 'message' => 'Contact list', 'contact' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Contact not found']);
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
                $data = Contact::with(['user'])->where('id', $id)->first();
            return response()->json(['status' => true, 'message' => 'Contact list', 'data' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'Contact not found']);
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
            return response()->json(['status' => false, 'message' => 'Contact not found'], 404);
        }

        $contact = Contact::with('user')->find($id);
        if (!$contact) {
            return response()->json(['status' => false, 'message' => 'Contact not found'], 404);
        }

        try {
            $validatedData = $request->validate([
                'first_name' => 'required',
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:contacts,phone,' . $id,
                'email' => 'required|email|max:255|unique:contacts,email,' . $id . '|unique:users,email,' . $contact->user_id,
                'password' => 'nullable|min:6',
                'address' => 'nullable',
                'license_no' => 'required|unique:contacts,license_no,' . $id . '|min:10',
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

            $licenceFile = $contact->license_no_file;
            $offerFile = $contact->offer_letter_file;
            $profilePicture = $contact->user->profile_picture ?? "";

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
                    if ($licenceFile && File::exists(public_path('contact/licence/' . $licenceFile))) {
                        File::delete(public_path('contact/licence/' . $licenceFile));
                    }
                    $licenceFile = time() . '.' . $request->license_no_file->extension();
                    $request->license_no_file->move(public_path('contact/licence'), $licenceFile);
                    $filePath = public_path('contact/licence/' . $licenceFile);
                    chmod($filePath, 0775);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['license_no_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 5MB.']], 422);
                }
            }

            if ($request->file('offer_letter_file')) {
                $file = $request->file('offer_letter_file');
                if ($file->isValid()) {
                    if ($offerFile && File::exists(public_path('contact/offer_letter/' . $offerFile))) {
                        File::delete(public_path('contact/offer_letter/' . $offerFile));
                    }
                    $offerFile = time() . '.' . $request->offer_letter_file->extension();
                    $request->offer_letter_file->move(public_path('contact/offer_letter'), $offerFile);
                    $filePath = public_path('contact/offer_letter/' . $offerFile);
                    chmod($filePath, 0775);
                } else {
                    return response()->json(['status' => 'error', 'message' => ['offer_letter_file' => 'Invalid file. Supported formats include .jpg, .png, .jpeg, .pdf, and .zip, with a maximum file size of 5MB.']], 422);
                }
            }

            DB::beginTransaction();

            $user = $contact->user;
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

            $contact->first_name = $validatedData['first_name'];
            $contact->last_name = $request->last_name ?? null;
            $contact->gender = $request->gender ?? null;
            $contact->dob = $request->dob ?? null;
            $contact->sin_no = $request->sin_no ?? null;
            $contact->phone = $validatedData['phone'];
            $contact->email = $validatedData['email'];

            $contact->license_no = $validatedData['license_no'];
            $contact->license_no_file = $licenceFile;
            $contact->license_class = $request->license_class ?? null;
            $contact->license_issue_country = $request->license_issue_country ?? null;
            $contact->license_issue_state = $request->license_issue_state ?? null;
            $contact->license_issue_date = $request->license_issue_date ?? null;
            $contact->license_expire_date = $request->license_expire_date ?? null;
            $contact->status_in_country = $request->status_in_country ?? null;

            $contact->doc_expiry_date = $request->doc_expiry_date ?? null;
            $contact->job_join_date = $request->job_join_date ?? null;
            $contact->offer_letter_file = $offerFile;
            $contact->job_leave_date = $request->job_leave_date ?? null;
            $contact->emergency_contact_name = $request->emergency_contact_name ?? null;
            $contact->emergency_contact_no = $request->emergency_contact_no ?? null;
            $contact->emergency_contact_address = $request->emergency_contact_address ?? null;
            $contact->designation = $request->designation ?? null;
            $contact->status = $request->status ?? 'Active';
            $contact->immigration_status = $request->immigration_status ?? null;
            $contact->comment = $request->comment ?? null;

            if ($contact->save()) {
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
                        Mail::to($user->email)->send(new ContactRegistrationMail($mailData));
                    } catch (\Exception $e) {
                        Log::error("Contact update: Failed to send mail to {$user->email}. Error: " . $e->getMessage());
                    }
                }

                return response()->json(['status' => true, 'message' => 'Contact updated successfully']);
            } else {
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'Failed to update contact'], 500);
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
            Log::error("Contact update error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'An error occurred while updating the contact. Please try again.'], 500);
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
            $Contact = Contact::find($id);
            $license_no_file = public_path('contact/licence');
            $this->removeFiles($license_no_file, $Contact->license_no_file);
            $offer_letter_file = public_path('contact/offer_letter');
            $this->removeFiles($offer_letter_file, $Contact->offer_letter_file);
            if ($Contact->delete()) {
                return response()->json(['status' => true, 'message' => 'Contact Delete Successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Contact not found']);
            }
        }
    }


    public function removeFiles($directory, $file)
    {
                // $directory = public_path('contact/licence');
        if (File::isDirectory($directory)) {
            $filePath = $directory . '/' . $file;
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
        }
    }


    // public function RequestApproval(){
    //     return view('EmployeeManagement.contact.manage-req-approval');


    // }


}
