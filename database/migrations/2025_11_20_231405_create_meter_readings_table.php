<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meter_readings', function (Blueprint $table) {
            $table->id();

            // First create the columns
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');

            // Then the foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');

            // Other fields
            $table->string('vehicle_meter');
            $table->dateTime('date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meter_readings');
    }
};
