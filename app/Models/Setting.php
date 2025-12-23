<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'logo_image',
        'address',
        'state',
        'city',
        'country',
        'post_code',
        'primary_email',
        'cc_emails',
    ];

    protected $casts = [
        'cc_emails' => 'array',
    ];
}
