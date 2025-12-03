<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'service_task_ids',
        'primary_meter_due_soon_threshold_unit',
        'notifications_enabled',
        'watchers',
        'next_due_date',
        'next_due_meter',
        'last_completed_date',
        'last_completed_meter',
        'status',
    ];

    protected $casts = [
        'service_task_ids' => 'array',
        'notifications_enabled' => 'boolean',
        'watchers' => 'array',
        'next_due_date' => 'date',
        'last_completed_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }

}

