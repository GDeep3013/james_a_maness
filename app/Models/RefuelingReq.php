<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefuelingReq extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'fuel_id',
        'quantity',
        'current_odometer',
        'fuel_station',
    ];
}
