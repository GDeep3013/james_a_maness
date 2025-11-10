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
        Schema::create('refuels', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vehicle_id');
            $table->string('vendor_name');
            $table->bigInteger('driver_id');
            $table->string('fuel_type');
            $table->bigInteger('driver_phone_no');
            $table->date('refueled_date');
            $table->string('station_name');
            $table->integer('max_unit');
            $table->double('budget_given', 8, 2);
            $table->integer('consumption_percent');
            $table->string('place');
            $table->float('km_after_day_end');
            $table->float('km_per_unit');
            $table->float('odometer_at_refueling');
            $table->float('last_reading');
            $table->integer('unit_taken');
            $table->integer('last_unit');
            $table->text('fuel_slip_copy');
            $table->tinyInteger('strict_cons_apply')->default(0);
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
        Schema::dropIfExists('refuels');
    }
};
