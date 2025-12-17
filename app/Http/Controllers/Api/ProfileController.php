<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{

    public function getProfile(Request $request)
    {
        $user = Auth::user();
        return $this->success('Profile retrieved successfully', [
            'user' => $user,
        ]);
    }


    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return $this->error('User not authenticated', null, 401);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'email|max:255',
            'password' => 'nullable|string|min:6',
            'confirm_password' => 'nullable|string|min:6|same:password',
            'address' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', $validator->errors(), 422);
        }

        if ($request->has('password') && !$request->has('confirm_password')) {
            return $this->error('Confirm password is required when password is provided', ['confirm_password' => ['Confirm password is required']], 422);
        }

        if ($request->has('confirm_password') && !$request->has('password')) {
            return $this->error('Password is required when confirm password is provided', ['password' => ['Password is required']], 422);
        }

        try {
            DB::beginTransaction();

            $userData = [];
            $contactData = [];

            if (isset($request->first_name) || isset($request->last_name)) {
                $firstName = $request->first_name ?? '';
                $lastName = $request->last_name ?? '';
                $userData['name'] = trim($firstName . ' ' . $lastName);
            }

            if (isset($request->phone)) {
                $userData['phone'] = $request->phone;
                $contactData['phone'] = $request->phone;
            }

            if (isset($request->address)) {
                $userData['address'] = $request->address;
                $contactData['address'] = $request->address;
            }

            if (isset($request->country)) {
                $userData['country'] = $request->country;
                $contactData['country'] = $request->country;
            }

            if (isset($request->state)) {
                $userData['state'] = $request->state;
                $contactData['state'] = $request->state;
            }

            if (isset($request->city)) {
                $userData['city'] = $request->city;
                $contactData['city'] = $request->city;
            }

            if (isset($request->zip)) {
                $userData['zip'] = $request->zip;
                $contactData['zip'] = $request->zip;
            }

            if (isset($request->password) && isset($request->confirm_password)) {
                $userData['password'] = Hash::make($request->password);
            }

            if (!empty($userData)) {
                $user->fill($userData);
                if (!$user->save()) {
                    DB::rollBack();
                    return $this->error('Failed to update user profile', null, 500);
                }
            }

            $contact = Contact::where('user_id', $user->id)->first();
            
            if ($contact) {
                if (isset($request->first_name)) {
                    $contactData['first_name'] = $request->first_name;
                }

                if (isset($request->last_name)) {
                    $contactData['last_name'] = $request->last_name;
                }

                if (!empty($contactData)) {
                    $contact->fill($contactData);
                    if (!$contact->save()) {
                        DB::rollBack();
                        return $this->error('Failed to update contact profile', null, 500);
                    }
                }
            }

            DB::commit();

            $user->refresh();
            $contact = $contact ? $contact->fresh() : null;

            return $this->success('Profile updated successfully', [
                'user' => $user,
                'contact' => $contact
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Profile update error: " . $e->getMessage());
            return $this->error('An error occurred while updating the profile', null, 500);
        }
    }
}
