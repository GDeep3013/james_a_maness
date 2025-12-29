<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->string('status')->nullable();
            $table->string('repair_priority_class')->nullable();
            $table->dateTime('issue_date')->nullable();
            $table->dateTime('scheduled_start_date')->nullable();
            $table->boolean('send_scheduled_start_date_reminder')->default(false);
            $table->dateTime('actual_start_date')->nullable();
            $table->dateTime('expected_completion_date')->nullable();
            $table->dateTime('actual_completion_date')->nullable();
            $table->boolean('use_start_odometer_for_completion_meter')->default(true);
            $table->bigInteger('assigned_to')->nullable();
            $table->text('labels')->nullable();
            $table->bigInteger('vendor_id')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('po_number')->nullable();
            $table->json('service_items')->nullable();
            $table->json('parts')->nullable();
            $table->longText('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('work_orders');
    }
};

