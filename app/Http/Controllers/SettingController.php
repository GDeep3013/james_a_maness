<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Settings;
// use Illuminate\Support\Facades\Auth;
use Auth;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $setting = Settings::first();
        if ($setting) {
            return response()->json(['status' => true, 'setting' => $setting]);
        } else {
            return response()->json(['status' => false, 'message' => 'Setting not found']);
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
        try {
            $validatedData = $request->validate([
                'logo' => 'nullable|mimes:jpeg,jpg,png|max:2048',
                'favicon' => 'nullable|mimes:jpeg,jpg,png|max:2048',
                'splashLogo' => 'nullable|mimes:jpeg,jpg,png|max:2048',
            ]);
            $user = User::where('id', Auth::user()->id)->where('type', 'Admin')->first();
            // dd($request->all(), $user->toArray());
            $logo = "";
            $favicon = "";
            $splashLogo = "";
            if ($request->file('logo')) {
                $file = $request->file('logo');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $logo = time() . '.' . $request->logo->extension();
                    $request->logo->move(public_path('setting/logo'), $logo);
                    $filePath = public_path('setting/logo/' . $logo);
                    chmod($filePath, 0755);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['logo' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                }
            }
            if ($request->file('favicon')) {
                $file = $request->file('favicon');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $favicon = time() . '.' . $request->favicon->extension();
                    $request->favicon->move(public_path('setting/favicon'), $favicon);
                    $filePath = public_path('setting/favicon/' . $favicon);
                    chmod($filePath, 0755);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['favicon' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                }
            }
            if ($request->file('splashLogo')) {
                $file = $request->file('splashLogo');
                if ($file->isValid()) {
                    $filePath = $file->getRealPath();
                    $splashLogo = time() . '.' . $request->splashLogo->extension();
                    $request->splashLogo->move(public_path('setting/splashLogo'), $splashLogo);
                    $filePath = public_path('setting/splashLogo/' . $splashLogo);
                    chmod($filePath, 0755);   //  // Adjust the storage path as needed
                } else {
                    return response()->json(['status' => 'error', 'message' => ['splashLogo' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                }
            }
            $setting = new Settings;
            $setting->title = $request->title;
            $setting->store_name = $request->store;
            $setting->address = $request->address;
            $setting->email     = $request->email;
            $setting->phone = $request->phone;
            $setting->favicon = $favicon;
            $setting->logo = $logo;
            $setting->splash_logo = $splashLogo;
            $setting->footer_text = $request->footer_text;
            if ($setting->save()) {
                return response()->json(['status' => true, 'message' => 'Setting saved successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save setting']);
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
        try {
            $validatedData = $request->validate([
                'logo' => 'nullable|mimes:jpeg,jpg,png|max:2048',
                'favicon' => 'nullable|mimes:jpeg,jpg,png|max:2048',
                'splashLogo' => 'nullable|mimes:jpeg,jpg,png|max:2048',
            ]);
            $setting = Settings::find($id);
            if ($setting) {


                $logo = "";
                $favicon = "";
                $splashLogo = "";
                if ($request->has('exist_logo_file')) {
                    $logo = $request->exist_logo_file;
                } else if ($request->file('logo')) {
                    $file = $request->file('logo');
                    if ($file->isValid()) {
                        $filePath = $file->getRealPath();
                        $logo = time() . '.' . $request->logo->extension();
                        $request->logo->move(public_path('setting/logo'), $logo);
                        $filePath = public_path('setting/logo/' . $logo);
                        chmod($filePath, 0755);   //  // Adjust the storage path as needed
                    } else {
                        return response()->json(['status' => 'error', 'message' => ['logo' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                    }
                }
                if ($request->has('exist_favicon_file')) {
                    $favicon = $request->exist_favicon_file;
                } else if ($request->file('favicon')) {
                    $file = $request->file('favicon');
                    if ($file->isValid()) {
                        $filePath = $file->getRealPath();
                        $favicon = time() . '.' . $request->favicon->extension();
                        $request->favicon->move(public_path('setting/favicon'), $favicon);
                        $filePath = public_path('setting/favicon/' . $favicon);
                        chmod($filePath, 0755);   //  // Adjust the storage path as needed
                    } else {
                        return response()->json(['status' => 'error', 'message' => ['favicon' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                    }
                }
                if ($request->has('exist_splashLogo_file')) {
                    $splashLogo = $request->exist_splashLogo_file;
                } else if ($request->file('splashLogo')) {
                    $file = $request->file('splashLogo');
                    if ($file->isValid()) {
                        $filePath = $file->getRealPath();
                        $splashLogo = time() . '.' . $request->splashLogo->extension();
                        $request->splashLogo->move(public_path('setting/splashLogo'), $splashLogo);
                        $filePath = public_path('setting/splashLogo/' . $splashLogo);
                        chmod($filePath, 0755);   //  // Adjust the storage path as needed
                    } else {
                        return response()->json(['status' => 'error', 'message' => ['splashLogo' => 'Invalid file. Supported formats include .jpg, .png, and .jpeg  with a maximum file size of 2MB.']]);
                    }
                }
                $setting->title = $request->title;
                $setting->store_name = $request->store;
                $setting->address = $request->address;
                $setting->email     = $request->email;
                $setting->phone = $request->phone;
                $setting->favicon = $favicon;
                $setting->logo = $logo;
                $setting->splash_logo = $splashLogo;
                $setting->footer_text = $request->footer_text;
                if ($setting->save()) {
                    return response()->json(['status' => true, 'message' => 'Setting update successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to update setting']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Setting not found']);
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
        //
    }
}
