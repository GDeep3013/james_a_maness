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
        Schema::table('work_orders', function (Blueprint $table) {
            $table->string('discount_type')->nullable()->after('po_number');
            $table->decimal('discount_value', 10, 2)->nullable()->after('discount_type');
            $table->decimal('base_value', 10, 2)->nullable()->after('discount_value');
            $table->decimal('total_value', 10, 2)->nullable()->after('base_value');
            $table->string('tax_type')->nullable()->after('total_value');
            $table->decimal('tax_value', 10, 2)->nullable()->after('tax_type');
        });
    }

    public function down()
    {
        Schema::table('work_orders', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value', 'base_value', 'total_value', 'tax_type', 'tax_value']);
        });
    }
};
