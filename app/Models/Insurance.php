<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'vehicle_id',
        'insured_name',
        'email',
        'cc_email',
        'bcc_email',
        'address',
        'latitude',
        'longitude',
        'policy_no',
        'phone_no',
        'start_date',
        'end_date',
        'days_before',
        'recurring_day',
        'recurring_date',
        'ins_file'
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }
    public function reminder()
    {
        return $this->hasMany(Reminder::class);
    }
}
