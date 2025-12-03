<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->string('service_task_ids')->nullable();
            
            $table->boolean('notifications_enabled')->default(true);
            
            $table->json('watchers')->nullable();
            
            $table->date('next_due_date')->nullable();
            $table->string('next_due_meter')->nullable();
            
            $table->date('last_completed_date')->nullable();
            $table->string('last_completed_meter')->nullable();
            
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};

