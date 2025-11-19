<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_reminders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->unsignedBigInteger('service_task_id')->nullable();
            
            $table->string('time_interval_value')->nullable();
            $table->string('time_interval_unit')->nullable();
            $table->string('time_due_soon_threshold_value')->nullable();
            $table->string('time_due_soon_threshold_unit')->nullable();
            
            $table->string('primary_meter_interval_value')->nullable();
            $table->string('primary_meter_interval_unit')->nullable();
            $table->string('primary_meter_due_soon_threshold_value')->nullable();
            $table->string('primary_meter_due_soon_threshold_unit')->nullable();
            
            $table->boolean('manually_set_next_reminder')->default(false);
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
            $table->foreign('service_task_id')->references('id')->on('service_tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_reminders');
    }
};
