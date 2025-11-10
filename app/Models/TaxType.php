<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxType extends Model
{
    use HasFactory;
    protected $fillable = [
        'tax_type',
        'name'
    ];
    public function expense_details()
    {
        return $this->hasMany(ExpenseDetails::class);
    }

    public function invoice_details(){
        return $this->hasMany(Invoice::class);
    }
}
