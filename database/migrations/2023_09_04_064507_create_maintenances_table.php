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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('exp_type_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->string('vehicle_year')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->string('vehicle_date')->nullable();
            // $table->longText('maintenance_date')->nullable();
            // $table->longText('maintenance_note')->nullable();
            // $table->longText('performed_by')->nullable();
            // $table->longText('valicate_By')->nullable();
            // $table->longText('total_amount')->nullable();
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
        Schema::dropIfExists('maintenances');
    }
};
