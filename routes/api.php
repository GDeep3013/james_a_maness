<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DriverController;
// use App\Http\Controllers\Apps\LoginController;
// use App\Http\Controllers\Apps\DriverApiController;
// use App\Http\Controllers\Apps\RoutesApiController;
// use App\Http\Controllers\ReminderController;
// use App\Http\Controllers\MainRouteStopsController;
// use App\Http\Controllers\TripController;
// use App\Http\Controllers\LocationController;
// use App\Http\Controllers\InvoiceController;
// use App\Http\Controllers\MainRouteController;


Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});


Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('drivers', DriverController::class);
    Route::get('/drivers/{id}/edit', [DriverController::class, 'edit'])->where('id', '[0-9]+');
   
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
//     Route::any('/profile', [DriverApiController::class, 'getDriver']);
//     Route::any('/profile-update', [DriverApiController::class, 'updateDriver']);
//     Route::any('/live-tracking', [DriverApiController::class, 'driverLiveTracking']);
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
