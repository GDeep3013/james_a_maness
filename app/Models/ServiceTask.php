<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'labor_cost',
    ];

    protected $casts = [
        'labor_cost' => 'decimal:2',
    ];

    public function subtasks()
    {
        return $this->belongsToMany(ServiceTask::class, 'service_task_subtasks', 'service_task_id', 'subtask_id')
            ->withTimestamps();
    }

    public function parentTasks()
    {
        return $this->belongsToMany(ServiceTask::class, 'service_task_subtasks', 'subtask_id', 'service_task_id')
            ->withTimestamps();
    }

    public function hasSubtasks()
    {
        return $this->subtasks()->count() > 0;
    }
}

