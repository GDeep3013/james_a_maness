<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'company_contact',
        'email',
        'address',
        'city',
        'state',
        'country',
        'zip',
        'gst_no',
        'nsc_code',
        'document',
        'longitude',
        'latitude',
        'vendor_no',
    ];
    public function routes()
    {
        return $this->hasMany(Trips::class, 'vendor_id', 'id');
    }
    public function invoice()
    {
        return $this->hasMany(Invoice::class);
    }
}
