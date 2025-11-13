<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'status',
        'repair_priority_class',
        'issue_date',
        'issued_by',
        'scheduled_start_date',
        'send_scheduled_start_date_reminder',
        'actual_start_date',
        'expected_completion_date',
        'actual_completion_date',
        'use_start_odometer_for_completion_meter',
        'assigned_to',
        'labels',
        'vendor_id',
        'invoice_number',
        'po_number',
    ];

    protected $casts = [
        'issue_date' => 'datetime',
        'scheduled_start_date' => 'datetime',
        'actual_start_date' => 'datetime',
        'expected_completion_date' => 'datetime',
        'actual_completion_date' => 'datetime',
        'send_scheduled_start_date_reminder' => 'boolean',
        'use_start_odometer_for_completion_meter' => 'boolean',
        'labels' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class, 'vehicle_id', 'id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Contact::class, 'assigned_to', 'id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}

