<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('service_tasks', function (Blueprint $table) {
            $table->decimal('labor_cost', 10, 2)->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('service_tasks', function (Blueprint $table) {
            $table->dropColumn('labor_cost');
        });
    }
};

