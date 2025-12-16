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
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('part_name');
            $table->string('part_code');
            $table->text('description')->nullable();
            $table->json('vehical_types')->nullable();
            $table->string('manufacturer_name')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->decimal('purchase_price', 10, 2);
            $table->unsignedBigInteger('vendor_id')->nullable();
            $table->string('warranty_period_months')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();

            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('set null');
            $table->unique('part_code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parts');
    }
};
