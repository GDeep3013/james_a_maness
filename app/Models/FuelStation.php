<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelStation extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_name',
        'phone',
        'station_name',
        'station_code',
        'authorize_person',
        'is_authorize'
    ];
}
