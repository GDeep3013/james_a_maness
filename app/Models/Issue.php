<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    use HasFactory, HasTimeLine;

    protected $fillable = [
        'work_order_id',
        'vehicle_id',
        'priority',
        'reported_date',
        'summary',
        'description',
        'labels',
        'primary_meter',
        'primary_meter_void',
        'reported_by',
        'assigned_to',
        'due_date',
        'primary_meter_due',
        'status',
    ];

    protected $casts = [
        'reported_date' => 'datetime',
        'due_date' => 'date',
        'primary_meter_void' => 'boolean',
        'primary_meter' => 'decimal:2',
        'primary_meter_due' => 'decimal:2',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Contact::class, 'assigned_to', 'id');
    }
}

