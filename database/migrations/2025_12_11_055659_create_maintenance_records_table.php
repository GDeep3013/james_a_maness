<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->bigInteger('vendor_id')->nullable();

            $table->dateTime('actual_start_date')->nullable();
            $table->dateTime('actual_completion_date')->nullable();

            $table->decimal('total_value', 10, 2)->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('po_number')->nullable();

            $table->string('counter_number')->nullable();
            $table->string('customer_account')->nullable();
            $table->string('ordered_by')->nullable();

            $table->longText('special_instructions')->nullable();
            $table->string('sale_type')->nullable();

            $table->dateTime('date')->nullable();
            $table->string('ship_via')->nullable();

            $table->json('line_items')->nullable();

            $table->decimal('sub_total', 10, 2)->nullable();
            $table->decimal('sales_tax', 10, 2)->nullable();

            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('maintenance_records');
    }
};
