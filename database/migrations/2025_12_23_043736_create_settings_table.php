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
            $table->text('logo_image')->nullable();
            $table->text('address')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('post_code')->nullable();
            $table->string('primary_email')->nullable();
            $table->json('cc_emails')->nullable();
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
