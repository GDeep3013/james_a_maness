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
        Schema::create('insurances', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->string('company_name')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->string('insured_name')->nullable();
            $table->string('email')->nullable();
            $table->string('cc_email')->nullable();
            $table->string('bcc_email')->nullable();
            $table->text('address')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('policy_no')->nullable();
            $table->string('phone_no', 20)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('days_before')->nullable();
            $table->string('recurring_day', 15)->nullable();
            $table->date('recurring_date')->nullable();
            $table->string('ins_file')->nullable();
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
        Schema::dropIfExists('insurances');
    }
};
