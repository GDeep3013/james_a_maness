<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Auth;
use Mail;
use App\Mail\CreatePassword;
use Illuminate\Support\Facades\Schema;
class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request)
    {
        $loggedInUser = Auth::user();

        // $users = User::where('type', '!=', 'admin')->where('id', '!=', $loggedInUser->id)
        //     ->where('type', '!=', 'admin')->where('user_id', Auth::user()->id)->paginate(20);
        $tableColumns = Schema::getColumnListing('users');
        $searchTerm = $request->search;
        $query = User::orderBy('id', 'desc');
        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });
        // $users = User::where('type', '!=', 'admin')->get();
        if(!empty($request->page)) {
            $users = $query->where('id','!=', Auth::user()->id)->paginate(20);
            if (!empty($users)) {
                return response()->json(['status' => true, 'user' => $users]);
            } else {
                return response()->json(['status' => false, 'message' => 'User not found']);
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
                'first_name' => 'required',
                'email' => 'required|email|max:255|unique:users,email',
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:users,phone',
                'staff_type' => 'required'
            ]);

            // If validation is successful, proceed to store the data
            $user = new User;
            $user->name = $validatedData['first_name'] . " " . $request->last_name;
            $user->email = $validatedData['email'];
            $user->password = "";
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->country = $request->country;
            $user->state = $request->state;
            $user->city = $request->city;
            $user->zip = $request->zip;
            $user->type = $validatedData['staff_type'];
            $user->dashboard = $request->dashboard ? 1 : 0;
            $user->main_routes = $request->main_routes ? 1 : 0;
            $user->routes = $request->routes ? 1 : 0;
            $user->vendors = $request->vendors ? 1 : 0;
            $user->drivers = $request->drivers ? 1 : 0;
            $user->location = $request->location ? 1 : 0;
            $user->expense = $request->expense ? 1 : 0;
            $user->invoice = $request->invoice ? 1 : 0;
            // $user->vehicle_mgmt = 1;
            $user->vehicle_mgmt = $request->vehicle_mgmt ? 1 : 0;
            $user->vehicle = $request->vehicle ? 1 : 0;
            $user->maintenance = $request->maintenance ? 1 : 0;
            $user->insurance = $request->insurance ? 1 : 0;
            $user->reminder = $request->reminder ? 1 : 0;
            $user->settings = $request->settings ? 1 : 0;
            $user->staff = $request->staff ? 1 : 0;
            $user->reports = $request->reports ? 1 : 0;
            $user->company = $request->company ? 1 : 0;
            $user->status = $request->enable_status ? 1 : 0;

            if ($user->save()) {
                $mailData = [
                    'title' => 'Mail From Shiva Transport',
                    'body' => url('/create-password/' . encrypt($user->id)),
                    'name' => $user->name,
                    'email' => $user->email,
                    'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png')))
                ];
                Mail::to($user->email)->send(new CreatePassword($mailData));
                return response()->json(['status' => true, 'message' => 'The staff account created successfully.']);
            } else {
                return response()->json(['status' => false, 'message' => 'Faild to save staff']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
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
            $data = User::where('id', $id)->first();
            return response()->json(['status' => true, 'data' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'User not found']);
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
                'first_name' => 'required',
                'email' => 'required|email|max:255|unique:users,email,' . $id,
                'phone' => 'required|string|min:10|regex:/^\+?[\d\s().-]{10,}$/|unique:users,phone,' . $id,
                'staff_type' => 'required'
            ]);
            $user = User::where('id', $id)->first();
            if ($user) {
                $user->name = $validatedData['first_name'] . " " . $request->last_name;
                $user->email = $validatedData['email'];
                $user->phone = $request->phone;;
                $user->address = $request->address;
                $user->country = $request->country;
                $user->state = $request->state;
                $user->city = $request->city;
                $user->zip = $request->zip;
                $user->type = $validatedData['staff_type'];
                $user->dashboard = $request->dashboard ? 1 : 0;
                $user->main_routes = $request->main_routes ? 1 : 0;
                $user->routes = $request->routes ? 1 : 0;
                $user->vendors = $request->vendors ? 1 : 0;
                $user->drivers = $request->drivers ? 1 : 0;
                $user->location = $request->location ? 1 : 0;
                $user->expense = $request->expense ? 1 : 0;
                $user->invoice = $request->invoice ? 1 : 0;
                $user->vehicle_mgmt = $request->vehicle_mgmt ? 1 : 0;
                $user->vehicle = $request->vehicle ? 1 : 0;
                $user->maintenance = $request->maintenance ? 1 : 0;
                $user->insurance = $request->insurance ? 1 : 0;
                $user->reminder = $request->reminder ? 1 : 0;
                $user->settings = $request->settings ? 1 : 0;
                $user->staff = $request->staff ? 1 : 0;
                $user->reports = $request->reports ? 1 : 0;
                $user->company = $request->company ? 1 : 0;
                $user->status = $request->enable_status ? 1 : 0;
                if ($user->save()) {
                    return response()->json(['status' => true, 'message' => 'Staff account update successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Faild to update staff']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Staff not found']);
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
            $user = User::find($id);
            if ($user->delete()) {
                return response()->json(['status' => true, 'message' => 'Staff delete successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Staff not found']);
            }
        }
    }


    public function getStaff($id)
    {
        $data['id'] = $id;
        return view('auth.passwords.createPassword', $data);
    }

    public function confirmPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }
        $id = decrypt($request->val);
        $user = User::where('id', $id)->first();
        $user->password = Hash::make($request->password);
        if ($user->save()) {
            return redirect('/login');
        }
    }
}
