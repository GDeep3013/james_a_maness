<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fuels', function (Blueprint $table) {
            $table->string('previous_meter')->nullable()->after('vehicle_meter');
        });
    }

    public function down(): void
    {
        Schema::table('fuels', function (Blueprint $table) {
            $table->dropColumn(['previous_meter']);
        });
    }
};

