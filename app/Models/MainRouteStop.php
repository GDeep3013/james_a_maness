<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainRouteStop extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'route_stops_date',
        'route_stops_stime',
        'route_stops_etime',
        'departure_time',
        'route_stops_desc',
        'latitude',
        'longitude',
        'active'
    ];


    public function route()
    {
        return $this->belongsTo(Routes::class, 'route_id', 'id');
    }

}
