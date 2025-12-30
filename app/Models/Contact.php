<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Contact extends Model
{
    use HasApiTokens, HasFactory;
    protected $table = 'contacts';

    protected $fillable = [
        'user_id',
        'profile_picture',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'sin_no',
        'phone',
        'email',
        'classification',
        'mobile_number',
        'home_mobile_number',
        'work_mobile_number',
        'other_mobile_number',
        'job_title',
        'date_of_birth',
        'employee_number',
        'start_date',
        'end_date',
        'hourly_labor_rate',
        'address',
        'country',
        'state',
        'city',
        'zip',
        'zip_code',
        'license_no',
        'license_number',
        'license_no_file',
        'license_class',
        'license_issue_country',
        'license_issue_state',
        'license_issue_date',
        'license_expire_date',
        'status_in_country',
        'doc_expiry_date',
        'job_join_date',
        'offer_letter_file',
        'job_leave_date',
        'emergency_contact_name',
        'emergency_contact_no',
        'emergency_contact_address',
        'password',
        'designation',
        'status',
        'immigration_status',
        'comment'
    ];
    protected $hidden = [
        'password',
        'tokens',
        'one_time_pin',
        'verify_otp'
    ];

    protected $casts = [
        'dob' => 'date',
        'date_of_birth' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'license_issue_date' => 'date',
        'license_expire_date' => 'date',
        'doc_expiry_date' => 'date',
        'job_join_date' => 'date',
        'job_leave_date' => 'date',
        'hourly_labor_rate' => 'decimal:2',
        'verify_otp' => 'boolean',
        'one_time_pin' => 'integer'
    ];



    function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


    function vehicles(){
        return $this->hasMany(Vehical::class, 'assigned_driver', 'id');
    }

}
