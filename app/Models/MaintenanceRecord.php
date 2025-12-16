<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory, HasTimeLine;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'actual_start_date',
        'actual_completion_date',
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
        'total_value' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'sales_tax' => 'decimal:2',
        'actual_start_date' => 'datetime',
        'actual_completion_date' => 'datetime',
        'date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
