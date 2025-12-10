<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExpenseHistoryController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\FuelEconomyController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ServiceTaskController;
use App\Http\Controllers\ServiceReminderController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\MeterReadingController;
use App\Http\Controllers\VehicleAssignmentController;
use App\Http\Controllers\VehicleReplacementController;
use App\Http\Controllers\MaintenanceController;

use App\Http\Controllers\PartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\VehicleDocumentController;
use App\Http\Controllers\ReportController;

// use App\Http\Controllers\Apps\LoginController;
// use App\Http\Controllers\Apps\ContactApiController;
// use App\Http\Controllers\Apps\RoutesApiController;
// use App\Http\Controllers\ReminderController;
// use App\Http\Controllers\MainRouteStopsController;
// use App\Http\Controllers\TripController;
// use App\Http\Controllers\LocationController;
// use App\Http\Controllers\InvoiceController;
// use App\Http\Controllers\MainRouteController;


Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/get-dashboard-workorder', [DashboardController::class, 'getDashboardWorkOrder']);

    Route::get('/get-reminder-service', [DashboardController::class, 'getDashboardReminders']);

    Route::get('/get-total-costs', [DashboardController::class, 'getTotalCosts']);

    Route::get('/get-fleet-performance', [DashboardController::class, 'getFleetPerformance']);

    Route::get('/get-maintenance-costs', [DashboardController::class, 'getMaintenanceCosts']);

    Route::get('/get-dashboard-statistics', [DashboardController::class, 'getDashboardStatistics']);

    Route::apiResource('con', ContactController::class);
    Route::get('/con/{id}/edit', [ContactController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('vehicles', VehicleController::class);
    Route::post('/vehicles/import', [VehicleController::class, 'import']);
    Route::get('/vehicles/{id}/edit', [VehicleController::class, 'edit'])->where('id', '[0-9]+');
    Route::get('/vehicles-statistics', [VehicleController::class, 'getStatistics']);

    Route::get('/fuels/last-entry/{vehicleId}', [FuelController::class, 'getLastEntryByVehicle'])->where('vehicleId', '[0-9]+');
    Route::get('/fuels-statistics', [FuelEconomyController::class, 'getStatistics']);
    Route::apiResource('fuels', FuelController::class);
    Route::get('/fuels/{id}/edit', [FuelController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('meter-history', MeterReadingController::class);
    Route::get('/meter-history/{id}/edit', [MeterReadingController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('expense-history', ExpenseHistoryController::class);
    Route::get('/expense-history/{id}/edit', [ExpenseHistoryController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('work-orders', WorkOrderController::class);
    Route::get('/work-orders/{id}/edit', [WorkOrderController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('issues', IssueController::class);
    Route::get('/issues/{id}/edit', [IssueController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('service-tasks', ServiceTaskController::class);
    Route::get('/service-tasks/{id}/edit', [ServiceTaskController::class, 'edit'])->where('id', '[0-9]+');

    Route::get('/service-reminders/check-logged', [ServiceReminderController::class, 'checkServiceTaskLogged']);
    Route::apiResource('service-reminders', ServiceReminderController::class);
    Route::get('/service-reminders/{id}/edit', [ServiceReminderController::class, 'edit'])->where('id', '[0-9]+');

    Route::get('/schedules/check-logged', [ScheduleController::class, 'checkServiceTaskLogged']);
    Route::apiResource('schedules', ScheduleController::class);
    Route::get('/schedules/{id}/edit', [ScheduleController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('vendors', VendorController::class);
    Route::get('/vendors/{id}/edit', [VendorController::class, 'edit'])->where('id', '[0-9]+');



    Route::apiResource('parts', PartController::class);
    Route::get('/parts/{id}/edit', [PartController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('services', ServiceController::class);
    Route::get('/services/{id}/edit', [ServiceController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('vehicle-assignments', VehicleAssignmentController::class);
    Route::get('/vehicle-assignments/{id}/edit', [VehicleAssignmentController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('vehicle-replacements', VehicleReplacementController::class);
    Route::get('/vehicle-replacements/{id}/edit', [VehicleReplacementController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('maintenances', MaintenanceController::class);
    Route::get('/maintenances/{id}/edit', [MaintenanceController::class, 'edit'])->where('id', '[0-9]+');

    Route::apiResource('vehicle-documents', VehicleDocumentController::class);
    Route::get('/vehicle-documents/{id}/edit', [VehicleDocumentController::class, 'show'])->where('id', '[0-9]+');

    Route::apiResource('reports', ReportController::class);
    Route::get('/reports/{id}/download', [ReportController::class, 'download'])->where('id', '[0-9]+');
    Route::post('/reports/generate', [ReportController::class, 'store']);
});

// Route::prefix('mobileApps')->group(function () {
//  Route::get('/allDrivers',[LoginController::class,'index'])->name('alldriver');

// });

// Route::middleware('auth.driver')->get('/driver', function (Request $request) {
//     return response()->json(Auth::guard('driver')->user());
// });
// Route::resource('/v1/location', LocationController::class);
// Route::any('/v1/login', [LoginController::class, 'login']);
// Route::group(['prefix' => 'v1', 'middleware' => ['auth.driver']], function () {
//     // Route::any('/carrier_service', [ShippingZones::class,'apiResonse']);
//     Route::any('/logout', [LoginController::class, 'logout']);
//     Route::any('/password/reset', [LoginController::class, 'forgotPassword']);
//     Route::any('/password/verify', [LoginController::class, 'verifyPassword']);
//     Route::any('/password/new', [LoginController::class, 'updatePassword']);
//     Route::any('/profile', [ContactApiController::class, 'getContact']);
//     Route::any('/profile-update', [ContactApiController::class, 'updateContact']);
//     Route::any('/live-tracking', [ContactApiController::class, 'contactLiveTracking']);
//     Route::any('/routes', [RoutesApiController::class, 'getRoutesDetails']);
//     Route::any('/trip-in-progress', [RoutesApiController::class, 'getRoutesInProgress']);
//     Route::any('/trip-completed', [RoutesApiController::class, 'getCompletedTrip']);
//     Route::any('/update-status', [RoutesApiController::class, 'updateRoutesStatus']);
//     Route::any('/view-routes', [RoutesApiController::class, 'getViewRoutes']);
//     Route::any('/history', [RoutesApiController::class, 'getRoutesHistory']);
//     Route::any('/route-status/check', [RoutesApiController::class, 'checkRoutesStatus']);
//     Route::any('/route-status/verify', [RoutesApiController::class, 'checkRoutesVerify']);
//     Route::any('/fcm-token', [RoutesApiController::class, 'createFcmToken']);
//     Route::any('/route-stops', [RoutesApiController::class, 'getRoutesStops']);
//     Route::any('/notification', [RoutesApiController::class, 'pushNotification']);
//     Route::any('/up-coming-trip', [RoutesApiController::class, 'upComingTrips']);

//     Route::any('/track', [RoutesApiController::class, 'vehicleLiveTracking']);
//     Route::resource('/main-trips', MainRouteStopsController::class);
//     Route::any('/main-route-script', [TripController::class, 'storeMainRouteDataUsingDateRoute']);


//     Route::get('/invoice-pdf/{id}', [InvoiceController::class, 'downloadPDFInvoice']);

//     Route::resource('/main-route', MainRouteController::class);
//     Route::any('/reminders', [ReminderController::class, 'sendReminderMail']);
// });
