<?php

namespace App\Traits;

use App\Models\TimeLine;
use Illuminate\Support\Facades\Auth;

trait HasTimeLine
{
    protected static function bootHasTimeLine()
    {

        static::created(function ($model) {
            $model->logActivity('created');
        });


        static::updated(function ($model) {
            if ($model->wasChanged() && !$model->wasRecentlyCreated) {
                $model->logActivity('updated');
            }
        });


        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    public function logActivity($action = 'created', $description = null)
    {
        $changed = [];
        $oldValues = [];
        $newValues = [];

        if ($action === 'updated') {
            $changed = array_keys($this->getChanges());

            foreach ($changed as $field) {
                $oldValues[$field] = $this->getOriginal($field);
                $newValues[$field] = $this->getAttribute($field);
            }
        }

        TimeLine::create([
            'user_id' => Auth::id() ?? 1,
            // 'trackable_type' => get_class($this),
            'trackable_id' => $this->id,
            'action' => $action,
            'module' => $this->getModuleName(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'changed_fields' => $changed,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'vehicle_id' => $this->vehicle_id ?? null,
            'vendor_id' => $this->vendor_id ?? null,
        ]);
    }

    protected function getModuleName()
    {
        $class = class_basename($this);
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $class));
    }

    // Relationship
    public function timelines()
    {
        return $this->morphMany(TimeLine::class, 'trackable');
    }
}
