<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $table = 'vendors';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'website',
        'address',
        'latitude',
        'longitude',
        'city',
        'state',
        'country',
        'zip',
        'notes',
        'contact_name',
        'contact_phone',
        'contact_email',
        'charging',
        'fuel',
        'service',
        'vehicle',
    ];

    protected $casts = [
        'charging' => 'boolean',
        'fuel' => 'boolean',
        'service' => 'boolean',
        'vehicle' => 'boolean',
    ];

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class, 'vendor_id', 'id');
    }
}

