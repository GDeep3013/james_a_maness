<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('work_order_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->enum('priority', ['', 'low', 'medium', 'high', 'urgent'])->nullable();
            $table->dateTime('reported_date')->nullable();
            $table->string('summary');
            $table->text('description')->nullable();
            $table->string('labels')->nullable();
            $table->decimal('primary_meter', 10, 2)->nullable();
            $table->boolean('primary_meter_void')->default(false);
            $table->string('reported_by')->nullable();
            $table->bigInteger('assigned_to')->nullable();
            $table->date('due_date')->nullable();
            $table->decimal('primary_meter_due', 10, 2)->nullable();
            $table->enum('status', ['Open', 'Resolved', 'Closed'])->default('Open');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('issues');
    }
};

