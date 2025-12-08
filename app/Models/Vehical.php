<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehical extends Model
{
    use HasFactory, HasTimeLine;

    protected $fillable = [
        'vehicle_name',
        'type',
        'make',
        'model',
        'year',
        'vin',
        'license_plate',
        'color',
        'fuel_type',
        'transmission',
        'purchase_date',
        'engine_size',
        'current_mileage',
        'purchase_price',
        'initial_status',
        'vendor_id',
        'primary_location',
        'notes',
        'assigned_driver',
        'department',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'assigned_driver', 'id')->select('id', 'first_name', 'last_name');
    }

    public function driver()
    {
        return $this->belongsTo(Contact::class, 'assigned_driver', 'id')->select('id', 'first_name', 'last_name');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id')->select('id', 'name');
    }

    public function getNameAttribute()
    {
        return $this->vehicle_name;
    }

}
