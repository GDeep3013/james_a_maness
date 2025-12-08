<?php

namespace App\Models;

use App\Traits\HasTimeLine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTask extends Model
{
    use HasFactory, HasTimeLine;

    protected $fillable = [
        'name',
        'description',
        'labor_cost',
    ];

    protected $casts = [
        'labor_cost' => 'decimal:2',
    ];
}

