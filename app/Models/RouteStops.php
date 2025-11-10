<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class RouteStops extends Model
{
    use HasFactory;
    protected $fillable = [
        'trip_id',
        'route_id',
        'route_stops_date',
        'route_stops_stime',
        'route_stops_etime',
        'departure_time',
        'route_stops_desc',
        'latitude',
        'longitude'
    ];
    public $timestamps = true;

    protected static function booted()
    {
        static::addGlobalScope('order', function (Builder $query) {
            $query->orderBy('route_stops_date')->orderBy('route_stops_stime');
        });
    }

    public function routes()
    {
        return $this->hasMany(Trips::class);
    }
}
