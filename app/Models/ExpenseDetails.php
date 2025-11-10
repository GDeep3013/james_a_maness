<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        "expense_id",
        "exp_type_id",
        "tax_type_id",
        "particular",
        "gross_amount",
        "tax_amount",
        "total_amount",
    ];
    public function expense()
    {
        return $this->hasMany(Expense::class);
    }
    public function expense_type()
    {
        return $this->belongsTo(ExpenseType::class, 'exp_type_id');
    }
    public function tax_type()
    {
        return $this->belongsTo(ExpenseType::class, 'tax_type_id');
    }
}
