<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{

    use HasFactory, HasTimeLine;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'expense_type_id',
        'invoice_number',
        'status',
        'issues',
        'vehicle_meter',
        'vehicle_date',
        'completion_date',
        'notes',
        'vehicle_model',
    ];

    protected $casts = [
        'vehicle_meter' => 'decimal:2',
        'vehicle_date' => 'date',
        'completion_date' => 'date',
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

    public function expense_histories()
    {
        return $this->belongsTo(ExpenseHistory::class);
    }


    // Calculate total amount from maintenance items
    public function getTotalAmountAttribute()
    {
        return $this->maintenance_items->sum('total_amount');
    }
}

