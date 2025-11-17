<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehical extends Model
{
    use HasFactory;

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
        'primary_location',
        'notes',
        'assigned_driver',
        'department',
    ];



    public function driver()
    {
        return $this->belongsTo(Contact::class, 'assigned_driver', 'id');
    }

}
