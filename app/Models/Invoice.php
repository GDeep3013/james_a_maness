<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'vendor_id',
        'vendor_address',
        'vendor_phone',
        'routes_id',
        'start_date',
        'end_date',
        'invoice_route',
        'fuel_exp',
        'invoice_tax',
        'payment',
        'invoice_date',
        'due_date',
        'enable',
        'po_number',
        'invoice_note',
        'type'

    ];
    public function invoice_vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
    public function tax_type()
    {
        // return $this->hasMany(TaxType::class);
        // return $this->belongsToMany(TaxType::class, 'tax_id');
        $taxIds = explode(',', $this->tax_id);
        return TaxType::whereIn('id', $taxIds)->get();
    }
}
