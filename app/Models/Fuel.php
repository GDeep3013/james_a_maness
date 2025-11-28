<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fuel extends Model
{
    use HasFactory;

    protected $table = 'fuels';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'fuel_type',
        'unit_type',
        'units',
        'price_per_volume_unit',
        'total_cost',
        'vehicle_meter',
        'notes',
        'date',
    ];

    protected $casts = [
        'units' => 'decimal:2',
        'price_per_volume_unit' => 'decimal:2',
        'date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
