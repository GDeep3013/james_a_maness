<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehical extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_name',
        'license_plate',
        'number_plate',
        'type',
        'vin_sn',
        'fuel_type',
        'year',
        'make',
        'model',
        'trim',
        'registration_state',
        'labels',
        'photo'
    ];

}
