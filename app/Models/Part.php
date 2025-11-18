<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    use HasFactory;

    protected $table = 'parts';

    protected $fillable = [
        'part_name',
        'part_code',
        'description',
        'vehical_types',
        'manufacturer_name',
        'unit_price',
        'purchase_price',
        'vendor_id',
        'warranty_period_months',
        'status',
    ];

    protected $casts = [
        'vehical_types' => 'array',
        'unit_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'warranty_period_months' => 'integer',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}
