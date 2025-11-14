<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('service_task_subtasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_task_id');
            $table->unsignedBigInteger('subtask_id');
            $table->timestamps();

            $table->foreign('service_task_id')->references('id')->on('service_tasks')->onDelete('cascade');
            $table->foreign('subtask_id')->references('id')->on('service_tasks')->onDelete('cascade');
            $table->unique(['service_task_id', 'subtask_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_task_subtasks');
    }
};

