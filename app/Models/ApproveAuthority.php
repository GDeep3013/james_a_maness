<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApproveAuthority extends Model
{
    use HasFactory;

    protected $fillable = [
        'Req_type_id',
        'req_type',
        'req_phase'
    ];
}
