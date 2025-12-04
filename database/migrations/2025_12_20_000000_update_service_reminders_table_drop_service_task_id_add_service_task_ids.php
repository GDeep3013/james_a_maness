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
        if (!Schema::hasColumn('service_reminders', 'service_task_ids')) {
            Schema::table('service_reminders', function (Blueprint $table) {
                $table->json('service_task_ids')->nullable()->after('vehicle_id');
            });
        }

        if (Schema::hasColumn('service_reminders', 'service_task_id')) {
            $reminders = DB::table('service_reminders')
                ->whereNotNull('service_task_id')
                ->where(function($query) {
                    $query->whereNull('service_task_ids')
                          ->orWhere('service_task_ids', '[]')
                          ->orWhere('service_task_ids', '');
                })
                ->get();

            foreach ($reminders as $reminder) {
                $taskId = $reminder->service_task_id;
                if ($taskId) {
                    DB::table('service_reminders')
                        ->where('id', $reminder->id)
                        ->update(['service_task_ids' => json_encode([(int)$taskId])]);
                }
            }

            try {
                Schema::table('service_reminders', function (Blueprint $table) {
                    $table->dropForeign(['service_task_id']);
                });
            } catch (\Exception $e) {
            }

            Schema::table('service_reminders', function (Blueprint $table) {
                $table->dropColumn('service_task_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('service_reminders', function (Blueprint $table) {
            if (Schema::hasColumn('service_reminders', 'service_task_ids')) {
                $table->dropColumn('service_task_ids');
            }
        });

        Schema::table('service_reminders', function (Blueprint $table) {
            if (!Schema::hasColumn('service_reminders', 'service_task_id')) {
                $table->unsignedBigInteger('service_task_id')->nullable()->after('vehicle_id');
                $table->foreign('service_task_id')->references('id')->on('service_tasks')->onDelete('cascade');
            }
        });
    }
};

