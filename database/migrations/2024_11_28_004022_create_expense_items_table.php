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
        Schema::create('expense_items', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('expense_id');
            $table->unsignedBigInteger('exp_type_id');
            $table->unsignedBigInteger('tax_type_id');
            $table->string('particular');
            $table->decimal('gross_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);

            // Add foreign key constraints if applicable
            $table->foreign('expense_id')->references('id')->on('expenses')->onDelete('cascade');
            $table->foreign('exp_type_id')->references('id')->on('expense_types')->onDelete('cascade');
            $table->foreign('tax_type_id')->references('id')->on('tax_types')->onDelete('cascade');
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
        Schema::dropIfExists('expense_items');
    }
};
