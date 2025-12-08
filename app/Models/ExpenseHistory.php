<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseHistory extends Model
{
    use HasFactory, HasTimeLine;
    protected $table = 'expense_histories';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vendor_id',
        'expense_type',
        'amount',
        'date',
        'notes',
        'reference_id',
        'reference_type',
        'frequency',
        'recurrence_period',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

}
