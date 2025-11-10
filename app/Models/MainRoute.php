<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vendor_id',
        'driver_id',
        'vehicle_id',
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
        'load_time',
        'load_type',
        'load_quantity',
        'load_unit',
        'freight_amt', 
        'tax_type',
        'pickup_date',
        'pickup_time', 
        'ship_date',
        'ship_time', 
        'info',
        'status',
        'route_stops_date',
        'route_stops_time',
        'route_stops_desc',
        'trip_start_date',
        'trip_end_date',
        'latitude',
        'longitude'
    ];

    public function route()
    {
        return $this->belongsTo(Routes::class, 'route_id', 'id');
    }
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

}
