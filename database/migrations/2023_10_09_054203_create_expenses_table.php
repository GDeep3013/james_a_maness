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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('route_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->bigInteger('exp_vendor_id')->nullable();
            $table->string('exp_vendor_phone', 30)->nullable();
            $table->string('exp_vendor_email')->nullable();
            $table->enum('type_of_exp', ['Route', 'Company', 'Vehicle', 'Miscellaneous','Shop']);
            $table->date('exp_date')->nullable();
            $table->string('invoice_no')->nullable();
            // $table->longText('exp_type_id')->nullable();
            // $table->longText('tax_type_id')->nullable();
            // $table->longText('particular')->nullable();
            // $table->longText('gross_amount')->nullable();
            // $table->longText('tax_amount')->nullable();
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
        Schema::dropIfExists('expenses');
    }
};
