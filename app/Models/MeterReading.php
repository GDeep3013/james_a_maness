<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeterReading extends Model
{
    use HasFactory, HasTimeLine;

    protected $table = 'meter_readings';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'vehicle_meter',
        'date',
    ];

    protected $casts = [
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
}
