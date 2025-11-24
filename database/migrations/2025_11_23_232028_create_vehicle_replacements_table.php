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
        Schema::create('vehicle_replacements', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
            
            $table->integer('estimated_vehicle_life');
            $table->integer('estimated_annual_usage');
            $table->decimal('estimated_fuel_efficiency', 10, 2);
            
            $table->decimal('purchase_price', 10, 2);
            
            $table->decimal('estimated_disposal_cost', 10, 2);
            $table->decimal('estimated_salvage_value', 10, 2);
            $table->enum('method_of_depreciation', ['Double Declining', 'Sum of Years'])->default('Sum of Years');
            
            $table->json('service_cost_estimates')->nullable();
            $table->json('fuel_cost_estimates')->nullable();
            
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
        Schema::dropIfExists('vehicle_replacements');
    }
};
