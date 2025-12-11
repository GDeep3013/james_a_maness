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
        Schema::table('mmr_reports', function (Blueprint $table) {
            $table->boolean('declaration')->nullable()->after('signature');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mmr_reports', function (Blueprint $table) {
            $table->dropColumn('declaration');
        });
    }
};
