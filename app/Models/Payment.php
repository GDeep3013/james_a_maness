<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',
        'company_id',
        'vendor_id',
        'vendor_name',
        'vendor_address',
        'vendor_email',
        'vendor_phone',
        'vendor_no',
        'routes_id',
        'routes_name',
        'start_date',
        'end_date',
        'due_date',
        'payment',
        'invoice_date',
        'note',
        'po_number',
        'enable',
        'custom_invoice_id',
        'gst_no',
        'route_type_name',
        'routes_type',
        'is_term_condition',
        'payment_note',
        'payment_mode',
        'status'
    ];

    public function meta()
    {
        return $this->hasMany(PaymentMeta::class);
    }

    public function getTransformedMetaAttribute()
    {
        $metaData = [];

        if ($this->meta && $this->meta->isNotEmpty()) {
            foreach ($this->meta as $meta) {
                if ($meta->meta_key && $meta->meta_value) {
                    $metaData[$meta->meta_key] = $meta->meta_value;
                }
            }
        }

        return $metaData;
    }
    public function company() {
        return $this->hasOne(Company::class, 'id', 'company_id');
    }
    protected $appends = ['transformed_meta'];
}
