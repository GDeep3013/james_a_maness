<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        // 'trackable_type',
        'trackable_id',
        'action',
        'module',
        'old_values',
        'new_values',
        'changed_fields',
        'description',
        'ip_address',
        'user_agent',
        'vehicle_id',
        'vendor_id',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'changed_fields' => 'array',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trackable()
    {
        return $this->morphTo();
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehical::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    // Helper method to format description
    public function getFormattedDescriptionAttribute()
    {
        $userName = $this->user->name ?? 'System';
        $module = ucfirst(str_replace('_', ' ', $this->module));

        switch ($this->action) {
            case 'created':
                return "{$userName} created a new {$module}";
            case 'updated':
                return "{$userName} updated {$module}";
            case 'deleted':
                return "{$userName} deleted {$module}";
            case 'restored':
                return "{$userName} restored {$module}";
            default:
                return $this->description;
        }
    }

    public function getChangesAttribute()
    {
        if (empty($this->changed_fields)) {
            return [];
        }

        $changes = [];
        foreach ($this->changed_fields as $field) {
            $changes[] = [
                'field' => $this->formatFieldName($field),
                'old' => $this->old_values[$field] ?? null,
                'new' => $this->new_values[$field] ?? null,
            ];
        }

        return $changes;
    }

    private function formatFieldName($field)
    {
        return ucwords(str_replace('_', ' ', $field));
    }
}
