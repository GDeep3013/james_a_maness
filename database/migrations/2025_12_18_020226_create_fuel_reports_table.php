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
        Schema::create('fuel_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('vendor_id');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicals')->onDelete('cascade');
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('total_value', 10, 2)->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('po_number')->nullable();
            $table->string('counter_number')->nullable();
            $table->string('customer_account')->nullable();
            $table->string('ordered_by')->nullable();
            $table->text('special_instructions')->nullable();
            $table->string('sale_type')->nullable();
            $table->date('date')->nullable();
            $table->string('ship_via')->nullable();
            $table->json('line_items')->nullable();
            $table->decimal('sub_total', 10, 2)->nullable();
            $table->decimal('sales_tax', 10, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();
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
        Schema::dropIfExists('fuel_reports');
    }
};
