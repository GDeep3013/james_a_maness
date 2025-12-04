<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'service_task_ids',
        'time_interval_value',
        'time_interval_unit',
        'time_due_soon_threshold_value',
        'time_due_soon_threshold_unit',
        'primary_meter_interval_value',
        'primary_meter_interval_unit',
        'primary_meter_due_soon_threshold_value',
        'manually_set_next_reminder',
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
        'manually_set_next_reminder' => 'boolean',
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

