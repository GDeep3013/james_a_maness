<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Vehical;
use App\Models\Driver;

class Refuel extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'vehicle_id',
        'vendor_name',
        'driver_id',
        'fuel_type',
        'driver_phone_no',
        'refueled_date',
        'station_name',
        'max_unit',
        'budget_given',
        'consumption_percent',
        'place',
        'km_after_day_end',
        'km_per_unit',
        'odometer_at_refueling',
        'last_reading',
        'unit_taken',
        'last_unit',
        'fuel_slip_copy',
        'strict_cons_apply',

    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class,'vehicle_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class,'driver_id');
    }


}
