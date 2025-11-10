<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timeline extends Model
{
    use HasFactory;
    protected $fillable = [
        'trip_id',
        'user_id',
        'type',
        'desc',
        'date',
        'time'
    ];

    public function trips()
    {
        return $this->belongsTo(Trips::class, 'trip_id');
    }
}
