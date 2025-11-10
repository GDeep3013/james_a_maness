<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'store_name',
        'address',
        'email',
        'phone',
        'favicon',
        'logo',
        'splash_logo',
        // 'vat_setting',
        // 'currency',
        // 'language',
        // 'date_format',
        // 'alignment',
        // 'powered_by_text',
        'footer_text'
    ];
}
