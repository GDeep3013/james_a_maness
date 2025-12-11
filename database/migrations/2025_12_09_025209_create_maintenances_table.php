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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('vendor_id')->nullable();
            $table->unsignedBigInteger('expense_type_id')->nullable();


            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            $table->string('expense_type');
            $table->string('invoice_number')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('completed');
            $table->text('issues')->nullable();
            $table->decimal('vehicle_meter', 10, 2)->nullable();
            $table->date('vehicle_date');
            $table->date('completion_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
