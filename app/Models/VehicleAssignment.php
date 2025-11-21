<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'contact_id',
        'vehicle_id',
        'event_title',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'full_day',
        'flag',
    ];

    protected $casts = [
        // 'start_date' => 'date',
        // 'end_date' => 'date',
        'full_day' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }
}

