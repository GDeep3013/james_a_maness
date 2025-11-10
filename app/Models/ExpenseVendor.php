<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseVendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'corporation',
        'first_name',
        'last_name',
        'phone',
        'email',
        'address',
        'country',
        'state',
        'city',
        'zip',
        'latitude',
        'longitude',
    ];

    public function expense()
    {
        return $this->hasMany(Expense::class);
    }
}
