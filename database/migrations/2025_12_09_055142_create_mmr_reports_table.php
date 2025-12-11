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
        Schema::create('mmr_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->date('date')->nullable();
            $table->string('domicile_station')->nullable();
            $table->string('provider_company_name')->nullable();
            $table->string('current_mileage')->nullable();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->boolean('preventative_maintenance')->nullable();
            $table->boolean('out_of_service')->nullable();
            $table->string('signature')->nullable();
            $table->date('completed_date')->nullable();
            $table->json('maintenance_records')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mmr_reports');
    }
};
