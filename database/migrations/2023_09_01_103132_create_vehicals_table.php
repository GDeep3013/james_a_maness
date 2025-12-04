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

        Schema::create('vehicals', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_code')->unique();
            $table->string('vehicle_name');
            $table->string('type');
            $table->string('make');
            $table->string('model')->nullable();
            $table->string('year')->nullable();
            $table->string('vin')->nullable();
            $table->string('license_plate')->unique();
            $table->string('color')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('transmission')->nullable();
            $table->string('purchase_date')->nullable();
            $table->string('engine_size')->nullable();
            $table->string('current_mileage')->nullable();
            $table->string('purchase_price')->nullable();
            $table->enum('initial_status', ['available', 'assigned', 'maintenance','active', 'inactive'])->default('available');
            $table->string('primary_location')->nullable();
            $table->text('notes')->nullable();
            $table->bigInteger('assigned_driver')->nullable();
            $table->string('department')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicals');
    }
};
