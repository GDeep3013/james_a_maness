<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exp_type_id',
        'vehicle_id',
        'vehicle_year',
        'vehicle_model',
        'vehicle_date'
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function expense_type(){
        return $this->belongsTo(ExpenseType::class, 'id');
    }

    public function maintenance_items()
    {
        return $this->hasMany(MaintenanceItem::class);
    }
}
