<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->bigInteger('vendor_id')->nullable();
            $table->string('repair_priority_class')->nullable();
            $table->decimal('hour_meter', 10, 2)->nullable();
            $table->dateTime('completion_date')->nullable();
            $table->boolean('set_start_date')->default(false);
            $table->dateTime('start_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('discount_type')->nullable();
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->string('tax_type')->nullable();
            $table->decimal('tax_value', 10, 2)->nullable();
            $table->decimal('labor_total', 10, 2)->nullable();
            $table->decimal('parts_total', 10, 2)->nullable();
            $table->decimal('subtotal', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('tax_amount', 10, 2)->nullable();
            $table->decimal('total', 10, 2)->nullable();
            $table->json('service_items')->nullable();
            $table->json('parts')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
};

