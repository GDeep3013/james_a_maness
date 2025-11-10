<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehical extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'truck',
        'number_plate',
        'truck_type',
        'vin_no',
        'make',
        'model',
        'year',
        'fuel_type',
        'reg_country',
        'reg_state',
        'odometer',
        'unit',
        'track_device_id',
        'fuel_card',
        'purchase_value',
        'purchase_date',
        'vehicle_reg_file',
        'tax_doc_file',
        'vehicle_ins_file',
        'vehicle_mnl_file',
        'other_doc',
        'vehicle_status',
        'comment'
    ];


    public function mainRoute()
    {
        return $this->hasOne(MainRoute::class, 'vehicle_id', 'id');
    }

    public function routes()
    {
        return $this->hasMany(Trips::class);
    }
    public function expense()
    {
        return $this->hasMany(Expense::class);
    }
    public function maintenance()
    {
        return $this->hasMany(Maintenance::class);
    }
    public function insurance()
    {
        return $this->hasMany(Insurance::class);
    }

    public function reminder()
    {
        return $this->hasMany(Reminder::class);
    }
}
