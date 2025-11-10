<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'route_id',
        'vehicle_id',
        'exp_vendor_id',
        'exp_vendor_phone',
        'exp_vendor_email',
        'type_of_exp',
        'exp_date',
        'invoice_no'
        // 'exp_type_id',
        // 'tax_type_id',
        // 'particular',
        // 'gross_amount',
        // 'tax_amount',
        // 'total_amount',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }
    public function expense_routes()
    {
        return $this->belongsTo(Routes::class, 'route_id');
    }
    public function expense_vendor()
    {
        return $this->belongsTo(ExpenseVendor::class, 'exp_vendor_id');
    }
    public function expense_details()
    {
        return $this->hasMany(ExpenseDetails::class);
    }

    public function expense_items()
    {
        return $this->hasMany(ExpenseItem::class);
    }
    
}
