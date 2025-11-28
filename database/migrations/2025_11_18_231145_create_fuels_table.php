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
    Schema::create('fuels', function (Blueprint $table) {
        $table->id();

        // First create the columns
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('vehicle_id');
        $table->unsignedBigInteger('vendor_id');

        // Then the foreign key constraints
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
        $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');

        // Other fields
        $table->enum('fuel_type', ['gasoline', 'diesel','hybrid','electric'])->nullable();
        $table->enum('unit_type', ['us_gallons', 'liters', 'uk_gallons'])->nullable();
        $table->decimal('units', 10, 2);
        $table->decimal('total_cost');
        $table->decimal('price_per_volume_unit', 10, 2);
        $table->string('vehicle_meter');
        $table->text('notes')->nullable();
        $table->dateTime('date');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuels');
    }
};
