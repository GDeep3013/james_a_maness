<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MMRReport extends Model
{
    use HasFactory;

    protected $table = 'mmr_reports';

    protected $fillable = [
        'user_id',
        'date',
        'domicile_station',
        'provider_company_name',
        'current_mileage',
        'vehicle_id',
        'preventative_maintenance',
        'out_of_service',
        'signature',
        'completed_date',
        'maintenance_records',
    ];

    protected $casts = [
        'date' => 'date',
        'completed_date' => 'date',
        'preventative_maintenance' => 'boolean',
        'out_of_service' => 'boolean',
        'maintenance_records' => 'array',
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

