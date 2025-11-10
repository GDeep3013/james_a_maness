<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\DriverOtpSendMail;

class LoginController extends Controller
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
    /**
     * @OA\Post(
     *    path="/login",
     *    operationId="login",
     *    tags={"Login"},
     *    summary="Driver login",
     *    description="Driver login",
     *    @OA\Parameter(name="username", in="query", description="Phone Number/Email", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *    @OA\Parameter(name="password", in="query", description="Password", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'exists:drivers,phone'],
            'password' => ['required'],
           // 'token' => ['required']
        ]);
        // if ($validator->fails()) {
        //     $validator = Validator::make($request->all(), [
        //         'username' => ['required', 'exists:drivers,email'],
        //         'password' => ['required']
        //     ]);
            if ($validator->fails()) {
                return $this->error('The given data was invalid', $validator->errors());
            }
        // }
        $driver = Driver::where('phone', $request->username)->orWhere('email', $request->username)->first();
        if (!Hash::check($request->password, $driver->password)) {
            return $this->error('These credentials do not match our records.', [
                'password' => ["Please attemp a valid password"]
            ]);
        }
        // $driver->tokens->delete();
        if($driver->driver_status == 'Inactive'){
            return $this->error('Your account is inactive. Please contact the administrator.',null, 401);
        }
        $token = $driver->createToken($driver->email)->plainTextToken;
        $driver->tokens = $token;
        $driver->fcm_token = @$request->token;
        $driver->save();
        $data = [
            'token' => $token,
            'fcm_token' => $driver->fcm_token,
        ];
        return $this->success('Logged in successfully', $data);
    }
    /**
     * @OA\Post(
     *    path="/password/reset",
     *    operationId="forgotPassword",
     *    tags={"Login"},
     *    summary="Forgot password",
     *    description="Forgot password",
     *    @OA\Parameter(name="username", in="query", description="Phone Number/Email", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function forgotPassword(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'exists:drivers,phone']
        ]);
        if ($validator->fails()) {
            $validator = Validator::make($request->all(), [
                'username' => ['required', 'exists:drivers,email']
            ]);
            if ($validator->fails()) {
                return $this->error('The given data was invalid', $validator->errors());
            }
        }
        $driver = Driver::where('phone', $request->username)->orWhere('email', $request->username)->first();
        if (!$driver) {
            return $this->error('Unauthorized token', null, 401);
        }
        $token = substr(str_shuffle("0123456789"), 0, 4);
        $driver->one_time_pin = $token;
        $driver->verify_otp = 0;
        if ($driver->save()) {
            $mailData = [
                'title' => 'Mail From Shiva Transport',
                'name' => $driver->first_name . ' ' . $driver->last_name,
                'phone' => $driver->phone,
                'otp' => $driver->one_time_pin,
                'email' => $driver->email,
                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png')))
            ];
            Mail::to($driver->email)->send(new DriverOtpSendMail($mailData));
            return $this->success('OTP has been sent successfully');
        }
    }
    /**
     * @OA\Post(
     *    path="/password/verify",
     *    operationId="verifyPassword",
     *    tags={"Login"},
     *    summary="Verify password",
     *    description="Verify password",
     *    @OA\Parameter(name="username", in="query", description="Phone Number/Email", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *  @OA\Parameter(name="one_time_pin", in="query", description="OTP", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function verifyPassword(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'exists:drivers,phone'],
            'one_time_pin' => ['required']
        ]);
        if ($validator->fails()) {
            $validator = Validator::make($request->all(), [
                'username' => ['required', 'exists:drivers,email'],
                'one_time_pin' => ['required']
            ]);
            if ($validator->fails()) {
                return $this->error('The given data was invalid', $validator->errors());
            }
        }
        $driver = Driver::where('phone', $request->username)->orWhere('email', $request->username)->first();
        if (!$driver) {
            return $this->error('Unauthorized token', null, 401);
        }

        if ($driver->one_time_pin !== $request->one_time_pin) {
            $driver->verify_otp = 0;
            $driver->save();
            return $this->error('Incorrect OTP');
        }
        // $driver->one_time_pin = null;
        $driver->verify_otp = 1;
        if ($driver->save()) {
            return $this->success('OTP verification successful');
        }
    }
    /**
     * @OA\Post(
     *    path="/password/new",
     *    operationId="updatePassword",
     *    tags={"Login"},
     *    summary="Update password",
     *    description="Update password",
     *    @OA\Parameter(name="username", in="query", description="Phone Number/Email", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *  @OA\Parameter(name="password", in="query", description="New Password", required=true,
     *        @OA\Schema(type="integer")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function updatePassword(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'exists:drivers,phone'],
            'password' => ['required']
        ]);
        if ($validator->fails()) {
            $validator = Validator::make($request->all(), [
                'username' => ['required', 'exists:drivers,email'],
                'password' => ['required']
            ]);
            if ($validator->fails()) {
                return $this->error('The given data was invalid', $validator->errors());
            }
        }
        $driver = Driver::where('phone', $request->username)->orWhere('email', $request->username)->first();
        if (!$driver) {
            return $this->error('Unauthorized token', null, 401);
        }
        if ($driver->verify_otp === 1) {
            $driver->password = Hash::make($request->password);
            $driver->one_time_pin = null;
            $driver->verify_otp = 0;
            $driver->save();
            return $this->success('Password update successfully');
        } else {
            return $this->error('OTP has expired');
        }
    }
    /**
     * @OA\Get(
     *    path="/logout",
     *    operationId="logout",
     *    tags={"Login"},
     *    summary="Driver logout",
     *    description="Driver logout",
     *    @OA\Parameter(name="authorization", in="query", description="Autorization token", required=true,
     *        @OA\Schema(type="string")
     *    ),
     *     @OA\Response(
     *          response=200, description="Success",
     *          @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example="200"),
     *             @OA\Property(property="data",type="object")
     *          )
     *       )
     *  )
     */
    public function logout(Request $request)
    {
        $tokenWithoutBearer = str_replace('Bearer ', '', $request->headers->get('authorization'));
        $driver = Driver::where('tokens', $tokenWithoutBearer)->first();
        if (!empty($driver)) {
            $driver->tokens = null;
            $driver->fcm_token = null;
            if ($driver->save()) {
                return $this->success('Logged out successfully');
            }
        } else {
            return $this->error('Access denied due to an incorrect token');
        }
    }
}
