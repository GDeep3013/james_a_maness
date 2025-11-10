<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMainRouteRequest extends FormRequest
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

        $routeId = $this->get('id'); // Assuming the route has a parameter named 'route'

        return [
            "route_name" => "required|unique:routes,name" . ($routeId ? ','.$routeId :  ''),
            "route_code" => "required|unique:routes,code" . ($routeId ? ','.$routeId : ''),
            "vendor_id" => "required",
            "driver_id" => "required",
            "vehicle_id" => "required",
            "pickup_add1" => "required",

            "load_time" => "required|date_format:H:i:s",

            // "pickup_load_time" => "nullable|date_format:H:i:s",

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
            "route_name.required" => "The route name is required.",
            "vendor_id.required" => "Vendor is required.",
            "ship_email.email" => "Please provide a valid email address.",
            "delivered_date.after_or_equal" => "Delivered date must be after or equal to the pickup date.",
            "ship_add1.required" => "Please provide ship address.",
            'load_time.required' => "Please enter a valid time",
            'load_time.date_format' => "Please enter a valid time",
            // Add other custom messages as needed
        ];
    }
}