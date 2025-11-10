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
            $table->bigInteger('user_id')->nullable();
            $table->string('truck')->nullable();
            $table->string('number_plate')->nullable();
            $table->string('truck_type')->nullable();
            $table->string('vin_no')->nullable();
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('year')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('reg_country')->nullable();
            $table->string('reg_state')->nullable();
            $table->string('odometer')->nullable();
            $table->string('unit')->nullable();
            $table->string('track_device_id')->nullable();
            $table->string('fuel_card')->nullable();
            $table->float('purchase_value', 10, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->text('vehicle_reg_file')->nullable();
            $table->text('tax_doc_file')->nullable();
            $table->text('vehicle_ins_file')->nullable();
            $table->text('vehicle_mnl_file')->nullable();
            $table->text('other_doc')->nullable();
            $table->enum('vehicle_status', ['Active', 'Inactive'])->default('Active');
            $table->text('comment')->nullable();

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
