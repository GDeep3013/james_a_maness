<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'driver_id',
        'insurance_id',
        'driver_reminder',
        'vehicle_vin_no',
        'truck',
        'tires',
        'brakes',
        'lights',
        'windshield',
        'wipers',
        'mirrors',
        'seatbelts',
        'steering',
        'suspension',
        'expire_date',
        'days_before',
        'notify_day',
        'document_type',
        'email_status',
        'email',
        'cc_email',
        'bcc_email',
        'sms_status',
        'phone',
        'status',
        'comments'
    ];
    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }
}
