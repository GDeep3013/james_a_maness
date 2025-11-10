<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $filled = [
        'vehicle_id',
        'device_id',
        'name',
        'speed',
        'ignition',
        'odometer',
        'device_time',
        'server_time',
        'latitude',
        'longitude',
        'address'
    ];
}
