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
        Schema::create('expense_histories', function (Blueprint $table) {
            $table->id();
            // Foreign keys
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('vendor_id')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');

            // Expense details
            $table->string('expense_type'); // down_payment, maintenance, insurance, etc.
            $table->decimal('amount', 10, 2);
            $table->dateTime('date');
            $table->text('notes')->nullable();

            // Reference tracking (for linking to other entities like fuel, service records, etc.)
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_type')->nullable(); // fuel, service, etc.

            // Frequency tracking
            $table->enum('frequency', ['single', 'recurring'])->default('single');
            $table->enum('recurrence_period', ['monthly', 'annual'])->nullable();

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
        Schema::dropIfExists('expense_histories');
    }
};



