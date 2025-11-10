<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trips extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'trip_date',
        'vendor_id',
        'vendor_name',
        'vendor_phone',
        'vendor_email',
        'vendor_address',

        'driver_id',
        'driver_first_name',
        'driver_last_name',
        'driver_phone',
        'driver_license_no',
        'driver_address',


        'vehicle_id',
        'vehicle_number_plate',
        'vehicle_model',
        'vehicle_unit_no',

        'route_id',
        'pickup_company_name',
        'pickup_add1',
        'pickup_city',
        'pickup_state',
        'pickup_country',
        'pickup_zip',
        'pickup_lat',
        'pickup_long',
        'pickup_load_time',
        'pickup_departure_time',

        'ship_company_name',
        'ship_first_name',
        'ship_last_name',
        'ship_email',
        'ship_phone',
        'ship_add1',
        'ship_add2',
        'ship_city',
        'ship_state',
        'ship_country',
        'ship_zip',
        'ship_lat',
        'ship_long',
        'ship_unload_time',
        'load_type',
        'load_quantity',
        'load_unit',
        'freight_amt',
        'tax_type',
        'longitude',
        'latitude',
        'pickup_date',
        'pickup_time',
        'ship_date',
        'ship_time',
        'info',
        'status',
        'route_stops_date',
        'route_stops_time',
        'route_stops_desc',
        'completed_reason',
        'completed_date',
    ];
    protected $hidden = [
        'one_time_pin',
        'verify_otp',
        'verify_status',
        'route_stops_date',
        'route_stops_time',
        'route_stops_desc',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function RoutesTo()
    {
        return $this->belongsTo(Routes::class, 'route_id');
    }
    public function route_stops()
    {
        return $this->hasMany(RouteStops::class, 'trip_id', 'id');
    }
    public function time_line()
    {
        return $this->hasMany(Timeline::class, 'trip_id', 'id');
    }
}
