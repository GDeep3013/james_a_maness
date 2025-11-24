<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleReplacement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'estimated_vehicle_life',
        'estimated_annual_usage',
        'estimated_fuel_efficiency',
        'purchase_price',
        'estimated_disposal_cost',
        'estimated_salvage_value',
        'method_of_depreciation',
        'service_cost_estimates',
        'fuel_cost_estimates',
    ];

    protected $casts = [
        'estimated_vehicle_life' => 'integer',
        'estimated_annual_usage' => 'integer',
        'estimated_fuel_efficiency' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'estimated_disposal_cost' => 'decimal:2',
        'estimated_salvage_value' => 'decimal:2',
        'service_cost_estimates' => 'array',
        'fuel_cost_estimates' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }
}

