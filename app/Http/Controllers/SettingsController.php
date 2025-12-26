<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Auth;

class SettingsController extends Controller
{
    public function index()
    {
        try {
            $setting = Setting::first();
            
            if ($setting) {
                if ($setting->logo_image) {
                    $setting->logo_image = asset('settings-images/logo/' . $setting->logo_image);
                }
                return $this->success('Settings retrieved successfully', $setting);
            } else {
                return $this->success('Settings retrieved successfully', null);
            }
        } catch (\Exception $e) {
            Log::error("Settings retrieval error: " . $e->getMessage());
            return $this->error('Failed to retrieve settings', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {

           

            $validatedData = $request->validate([
                'logo_image' => 'nullable|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'company_name' => 'nullable|string|max:255',
                'phone_number' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:500',
                'state' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'post_code' => 'nullable|string|max:50',
                'primary_email' => 'nullable|email|max:255',
                'cc_emails' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $setting = Setting::first();

            if (!$setting) {
                $setting = new Setting();
            }



            if ($request->hasFile('logo_image')) {
                $file = $request->file('logo_image');
             
                if ($file && $file->isValid()) {
                    if ($setting->logo_image && File::exists(public_path('settings-images/logo/' . $setting->logo_image))) {
                        File::delete(public_path('settings-images/logo/' . $setting->logo_image));
                    }

                    if (!File::exists(public_path('settings-images/logo'))) {
                        File::makeDirectory(public_path('settings-images/logo'), 0755, true);
                    }

                    $logoFileName = time() . '_' . uniqid() . '.' . $file->extension();
                    $file->move(public_path('settings-images/logo'), $logoFileName);
                    chmod(public_path('settings-images/logo/' . $logoFileName), 0644);
                    $setting->logo_image = $logoFileName;
                }
            }

            if ($request->has('company_name')) {
                $setting->company_name = $request->company_name ?: null;
            }

            if ($request->has('phone_number')) {
                $setting->phone_number = $request->phone_number ?: null;
            }

            if ($request->has('address')) {
                $setting->address = $request->address ?: null;
            }

            if ($request->has('state')) {
                $setting->state = $request->state ?: null;
            }

            if ($request->has('city')) {
                $setting->city = $request->city ?: null;
            }

            if ($request->has('country')) {
                $setting->country = $request->country ?: null;
            }

            if ($request->has('post_code')) {
                $setting->post_code = $request->post_code ?: null;
            }

            if ($request->has('primary_email')) {
                $setting->primary_email = $request->primary_email ?: null;
            }

            if ($request->has('cc_emails')) {
                $ccEmailsValue = $request->cc_emails;
                if (is_string($ccEmailsValue) && !empty($ccEmailsValue)) {
                    $ccEmailsArray = json_decode($ccEmailsValue, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($ccEmailsArray) && !empty($ccEmailsArray)) {
                        $setting->cc_emails = $ccEmailsArray;
                    } else {
                        $setting->cc_emails = null;
                    }
                } elseif (is_array($ccEmailsValue) && !empty($ccEmailsValue)) {
                    $setting->cc_emails = $ccEmailsValue;
                } else {
                    $setting->cc_emails = null;
                }
            }

            if ($setting->save()) {
                DB::commit();
                
                if ($setting->logo_image) {
                    $setting->logo_image = asset('settings-images/logo/' . $setting->logo_image);
                }

                return $this->success('Settings saved successfully', $setting);
            } else {
                DB::rollBack();
                return $this->error('Failed to save settings', null, 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return $this->error('Validation failed', $e->validator->errors(), 422);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error("Settings save error: " . $e->getMessage());
            return $this->error('An error occurred while saving settings', $e->getMessage(), 500);
        }
    }
}

