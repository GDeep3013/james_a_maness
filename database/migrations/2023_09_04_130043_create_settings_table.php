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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->string('title')->nullable();
            $table->string('store_name')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->bigInteger('phone')->nullable();
            $table->string('favicon')->nullable();
            $table->string('logo')->nullable();
            $table->string('splash_logo')->nullable();
            // $table->string('vat_setting');
            // $table->string('currency');
            // $table->string('language');
            // $table->string('date_format');
            // $table->string('alignment');
            // $table->string('powered_by_text');
            $table->string('footer_text');
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
        Schema::dropIfExists('settings');
    }
};
