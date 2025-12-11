<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\TimeLineController;

Route::middleware(['guest'])->group(function () {
    Route::get('/', function () {
        return view('auth.login');
    });
    // Route::get('/login', function(){  return view('auth.login');});
    Auth::routes(['register' => false]);
});


Route::get('/invoice/MMR_Report', function(){
    return view('invoice.MMR_Report');
});

Route::middleware(['auth','page.access'])->group(function () {

    Route::get('/logout', [LoginController::class, 'logout']);
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/home', [HomeController::class, 'index']);

    // Vehicles
    Route::get('/vehicles', [HomeController::class, 'index']);
    Route::get('/vehicles/create', [HomeController::class, 'index']);
    Route::get('/vehicles/add', [HomeController::class, 'index']);
    Route::get('/vehicles/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vehicles/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vehicles/{id}/VehicleDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');


    // Contacts
    Route::get('/contacts', [HomeController::class, 'index']);
    Route::get('/contacts/create', [HomeController::class, 'index']);
    Route::get('/contacts/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/contacts/{id}/ContactDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/contacts/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    //Maintenance
    Route::get('/maintenances', [HomeController::class, 'index']);
    Route::get('/maintenances/create', [HomeController::class, 'index']);
    Route::get('/maintenances/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/maintenances/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Work Orders
    Route::get('/work-orders', [HomeController::class, 'index']);
    Route::get('/work-orders/create', [HomeController::class, 'index']);
    Route::get('/work-orders/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/work-orders/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');


    // Service Tasks
    Route::get('/service-tasks', [HomeController::class, 'index']);
    Route::get('/service-tasks/create', [HomeController::class, 'index']);
    Route::get('/service-tasks/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/service-tasks/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Issues
    Route::get('/issues', [HomeController::class, 'index']);
    Route::get('/issues/create', [HomeController::class, 'index']);
    Route::get('/issues/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/issues/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Vendors
    Route::get('/vendors', [HomeController::class, 'index']);
    Route::get('/vendors/create', [HomeController::class, 'index']);
    Route::get('/vendors/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vendors/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Fuels
    Route::get('/fuels', [HomeController::class, 'index']);
    Route::get('/fuels/create', [HomeController::class, 'index']);
    Route::get('/fuels/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/fuels/{id}/FuelDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/fuels/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // MeterReadings
    Route::get('/meter-history', [HomeController::class, 'index']);
    Route::get('/meter-history/create', [HomeController::class, 'index']);
    Route::get('/meter-history/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/meter-history/{id}/FuelDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/meter-history/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/meter-history/:id/MeterReadingDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // ExpenseHistory
    Route::get('/expense-history', [HomeController::class, 'index']);
    Route::get('/expense-history/create', [HomeController::class, 'index']);
    Route::get('/expense-history/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/expense-history/{id}/FuelDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/expense-history/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/expense-history/:id/ExpenseHistoryDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');


    // Parts
    Route::get('/parts', [HomeController::class, 'index']);
    Route::get('/parts/create', [HomeController::class, 'index']);
    Route::get('/parts/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/parts/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Service Reminders
    Route::get('/service-reminders', [HomeController::class, 'index']);
    Route::get('/service-reminders/create', [HomeController::class, 'index']);
    Route::get('/service-reminders/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/service-reminders/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Schedules
    Route::get('/schedules', [HomeController::class, 'index']);
    Route::get('/schedules/create', [HomeController::class, 'index']);
    Route::get('/schedules/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/schedules/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Services
    Route::get('/services', [HomeController::class, 'index']);
    Route::get('/services/create', [HomeController::class, 'index']);
    Route::get('/services/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/services/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    // Calendar
    Route::get('/calendar', [HomeController::class, 'index']);
    Route::get('/vehicle-assignments', [HomeController::class, 'index']);

    // Vehicle Replacement Analysis
    Route::get('/vehicle-replacement-analysis', [HomeController::class, 'index']);

    // Reports
    Route::get('/reports', [HomeController::class, 'index']);
    Route::get('/reports/mmr', [HomeController::class, 'index']);
    Route::get('/reports/mmr/create', [HomeController::class, 'index']);
    Route::get('/reports/mmr/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/reports/mmr/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/reports/monthly-maintenance', [HomeController::class, 'index']);
    Route::get('/reports/maintenance', [HomeController::class, 'index']);
    Route::get('/reports/fuel', [HomeController::class, 'index']);

    Route::get('profile', [HomeController::class, 'index']);

    //Maintenance Reports
    Route::get('/maintenance-record', [HomeController::class, 'index']);


    // TimeLine Records For the All Modules
    Route::get('/timeline', [TimeLineController::class, 'index'])->name('timeline.index');
    Route::get('/timeline/vehicle/{vehicleId}', [TimeLineController::class, 'vehicle'])->name('timeline.vehicle');
    Route::get('/timeline/module/{moduleName}', [TimeLineController::class, 'module'])->name('timeline.module');
    Route::get('/timeline/{timeLine}', [TimeLineController::class, 'show'])->name('timeline.show');

});

