<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Routes extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "name",
        "code",
        "route_type",
        "route_ref_id"
    ];
    public function trips()
    {
        return $this->hasMany(Trips::class);
    }
    public function expense()
    {
        return $this->hasMany(Expense::class);
    }

    public function mainRoute()
    {
        return $this->hasOne(MainRoute::class, 'route_id', 'id');
    }

    public function mainRouteStops()
    {
        return $this->hasMany(MainRouteStop::class, 'route_id', 'id');
    }

    public function additional_routes()
    {
        return $this->hasMany(Routes::class, 'route_ref_id', 'id');
    }
    
}
