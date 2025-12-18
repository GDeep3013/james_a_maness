<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'start_date',
        'end_date',
        'total_value',
        'invoice_number',
        'po_number',
        'counter_number',
        'customer_account',
        'ordered_by',
        'special_instructions',
        'sale_type',
        'date',
        'ship_via',
        'line_items',
        'sub_total',
        'sales_tax',
        'payment_method',
        'payment_reference',
    ];

    protected $casts = [
        'line_items' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'date' => 'date',
        'total_value' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'sales_tax' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
