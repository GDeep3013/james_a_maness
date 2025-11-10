<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'maintenance_id',
        'maintenance_date',
        'maintenance_note',
        'performed_by',
        'validate_by',
        'total_amount'
    ];

    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class);
    }
}
