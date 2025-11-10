<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documents extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'document_type',
        'commission',
        'vehical',
        'notification_before',
        'last_issue_date',
        'email_status',
        'email',
        'expire_date',
        'SMS_status',
        'SMS',
        'charge_paid',
        'vendor',
        'vocuments'
    ];
}
