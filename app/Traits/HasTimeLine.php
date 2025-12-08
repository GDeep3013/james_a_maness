<?php

namespace App\Traits;

use App\Models\TimeLine;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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

        if (is_null($description)) {
            $description = $this->generateDescription($action, $changed, $oldValues, $newValues);
        }

        $oldValues = $this->convertDatesToStrings($oldValues);
        $newValues = $this->convertDatesToStrings($newValues);

        TimeLine::create([
            'user_id' => Auth::id() ?? 1,
            'trackable_type' => get_class($this),
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

    /**
     * Convert Carbon/DateTime objects to strings in array
     */
    protected function convertDatesToStrings($data)
    {
        if (!is_array($data)) {
            return $data;
        }

        foreach ($data as $key => $value) {
            if ($value instanceof Carbon || $value instanceof \DateTime) {
                $data[$key] = $value->format('Y-m-d H:i:s');
            } elseif (is_array($value)) {
                $data[$key] = $this->convertDatesToStrings($value);
            }
        }

        return $data;
    }

    /**
     * Generate automatic description based on action
     */
    protected function generateDescription($action, $changed = [], $oldValues = [], $newValues = [])
    {
        $userName = Auth::check() ? Auth::user()->name : 'System';
        $modelName = $this->getReadableModelName();

        switch ($action) {
            case 'created':
                return "{$userName} created new {$modelName}";

            case 'updated':
                if (empty($changed)) {
                    return "{$userName} updated {$modelName}";
                }

                // Format changed fields with old and new values
                $changesText = $this->formatChangedFields($changed, $oldValues, $newValues);
                return "{$userName} updated {$modelName}: {$changesText}";

            case 'deleted':
                return "{$userName} deleted {$modelName}";

            default:
                return "{$userName} performed {$action} on {$modelName}";
        }
    }

    /**
     * Format changed fields for description
     */
    protected function formatChangedFields($changed, $oldValues, $newValues)
    {
        $parts = [];

        foreach ($changed as $field) {
            $fieldName = $this->getReadableFieldName($field);
            $oldValue = $this->formatValue($oldValues[$field] ?? null);
            $newValue = $this->formatValue($newValues[$field] ?? null);

            $parts[] = "{$fieldName} ({$oldValue} → {$newValue})";
        }
        if (count($parts) > 3) {
            $displayed = array_slice($parts, 0, 3);
            $remaining = count($parts) - 3;
            return implode(', ', $displayed) . " and {$remaining} more fields";
        }

        return implode(', ', $parts);
    }

    /**
     * Get readable model name
     */
    protected function getReadableModelName()
    {
        $className = class_basename($this);

        $readable = preg_replace('/(?<!^)[A-Z]/', ' $0', $className);

        return ucfirst(trim($readable));
    }

    /**
     * Get readable field name
     */
    protected function getReadableFieldName($field)
    {
        return ucwords(str_replace('_', ' ', $field));
    }

    /**
     * Format value for display in description
     */
    protected function formatValue($value)
    {
        if (is_null($value)) {
            return 'empty';
        }

        if ($value instanceof Carbon || $value instanceof \DateTime) {
            // Check if it has time component
            if ($value->format('H:i:s') === '00:00:00') {
                return $value->format('d M Y');
            }
            return $value->format('d M Y H:i');
        }

        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }
        if (is_array($value)) {
            if (empty($value)) {
                return 'empty array';
            }
            return 'Array[' . count($value) . ' items]';
        }
        if (is_object($value)) {
            return 'Object';
        }

        if (is_numeric($value)) {
            if (stripos($value, '.') !== false) {
                return number_format((float)$value, 2);
            }
            return $value;
        }

        $strValue = (string) $value;

        // Truncate long strings
        if (strlen($strValue) > 50) {
            return substr($strValue, 0, 47) . '...';
        }

        return $strValue;
    }

    /**
     * Get module name for the model
     */
    protected function getModuleName()
    {
        $class = class_basename($this);
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $class));
    }

    /**
     * Relationship to timelines
     */
    public function timelines()
    {
        return $this->morphMany(TimeLine::class, 'trackable');
    }
}
