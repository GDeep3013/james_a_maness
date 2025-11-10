<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class TripRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set to true if you don't have specific authorization logic
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            "load_time" => "required|date_format:H:i:s",
            "vendor_id" => "required",
            "driver_id" => "required",
            "vehicle_id" => "required",
            "pickup_add1" => "required",
            "ship_first_name" => "required",
            "ship_email" => "required|email",
            "ship_phone" => "required",
            "ship_add1" => "required",
            "load_type" => "required",
            "load_quantity" => "required|numeric",
            "pickup_date" => "required|date",
            "ship_date" => "required|date|after_or_equal:pickup_date",
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
    */
    protected function failedValidation(Validator $validator)
    {

        if ($this->expectsJson()) {
            // Return validation errors as a JSON response
            throw new HttpResponseException(
                response()->json([
                    'status' => false,
                    'message' => 'Validation error occurred.',
                    'errors' => $validator->errors(),
                ], 422)  // Unprocessable Entity
            );
        }

        parent::failedValidation($validator);
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            "vendor_id.required" => "Vendor is required.",
            "ship_email.email" => "Please provide a valid email address.",
            "delivered_date.after_or_equal" => "Delivered date must be after or equal to the pickup date.",
            "ship_add1.required" => "Please provide ship address."
            // Add other custom messages as needed
        ];
    }
}