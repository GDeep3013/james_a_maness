<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseType extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',
        'exp_type'
    ];
    public function expense_details()
    {
        return $this->hasMany(ExpenseDetails::class);
    }
    public function maintenance()
    {
        return $this->hasMany(Maintenance::class, 'exp_type_id');
    }
    public function expense_type()
    {
        return $this->hasMany(Expense::class, 'exp_type_id');
    }
}
