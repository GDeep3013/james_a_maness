<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('services', 'hour_meter') && !Schema::hasColumn('services', 'primary_meter')) {
            DB::statement('ALTER TABLE `services` CHANGE `hour_meter` `primary_meter` DECIMAL(10, 2) NULL');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('services', 'primary_meter') && !Schema::hasColumn('services', 'hour_meter')) {
            DB::statement('ALTER TABLE `services` CHANGE `primary_meter` `hour_meter` DECIMAL(10, 2) NULL');
        }
    }
};

