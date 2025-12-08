<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'title',
        'file_path',
        'file_name',
        'file_type',
        'expires_date',
    ];

    protected $casts = [
        'expires_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function getFilePathAttribute()
    {
        return asset('vehicle-documents/' . $this->file_name);
    }
}
