<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'repair_priority_class',
        'hour_meter',
        'completion_date',
        'set_start_date',
        'start_date',
        'notes',
        'discount_type',
        'discount_value',
        'tax_type',
        'tax_value',
        'labor_total',
        'parts_total',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total',
        'service_items',
        'parts',
    ];

    protected $casts = [
        'completion_date' => 'datetime',
        'start_date' => 'datetime',
        'set_start_date' => 'boolean',
        'service_items' => 'array',
        'parts' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}

