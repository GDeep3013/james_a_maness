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


    // New Fileds : first_name, last_name, email, classification, mobile_number, home_mobile_number, work_mobile_number, other_mobile_number, job_title, date_of_birth, employee_number, start_date, end_date, hourly_labor_rate, address, country, state, city, zip_code, license_number, license_class, license_issue_state

    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->text('profile_picture')->nullable(true);
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('dob')->nullable();
            $table->string('sin_no')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            // $table->string('address')->nullable();
            // $table->string('country')->nullable();
            // $table->string('state')->nullable();
            // $table->string('city')->nullable();
            // $table->string('zip')->nullable();
            $table->string('license_no')->nullable();
            $table->text('license_no_file')->nullable();
            $table->enum('license_class', ['Class 1', 'Class 5']);
            $table->string('license_issue_country')->nullable();
            $table->string('license_issue_state')->nullable();
            $table->date('license_issue_date')->nullable();
            $table->date('license_expire_date')->nullable();
            $table->enum('status_in_country', ['study', 'work', 'permanent', 'citizen']);
            $table->date('doc_expiry_date')->nullable();
            $table->date('job_join_date')->nullable();
            $table->text('offer_letter_file')->nullable();
            $table->date('job_leave_date')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_no', 20)->nullable();
            $table->longText('emergency_contact_address')->nullable();
            
            $table->text('tokens')->nullable();
            $table->integer('one_time_pin')->length(6)->nullable();
            $table->tinyInteger('verify_otp')->default(0)->nullable();
            $table->string('designation')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->enum('immigration_status', ['LMIA','SINP','Other'])->default('LMIA');
            $table->text('comment')->nullable();

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
        Schema::dropIfExists('contacts');
    }
};
