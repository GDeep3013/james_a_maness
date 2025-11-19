<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\LoginController;


Route::middleware(['guest'])->group(function () {
    Route::get('/', function(){  return view('auth.login');});
    // Route::get('/login', function(){  return view('auth.login');});
    Auth::routes(['register' => false ]);
});

Route::middleware(['auth','page.access'])->group(function () {
    
    Route::get('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/vehicles', [HomeController::class, 'index']);
    Route::get('/vehicles/create', [HomeController::class, 'index']);
    Route::get('/vehicles/add', [HomeController::class, 'index']);
    Route::get('/vehicles/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vehicles/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vehicles/{id}/VehicleDetail', [HomeController::class, 'index'])->where('id', '[0-9]+');


    Route::get('/contacts', [HomeController::class, 'index']);
    Route::get('/contacts/create', [HomeController::class, 'index']);
    Route::get('/contacts/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/contacts/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    //
    Route::get('/work-orders', [HomeController::class, 'index']);
    Route::get('/work-orders/create', [HomeController::class, 'index']);
    Route::get('/work-orders/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/work-orders/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');


    Route::get('/service-tasks', [HomeController::class, 'index']);
    Route::get('/service-tasks/create', [HomeController::class, 'index']);
    Route::get('/service-tasks/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/service-tasks/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    Route::get('/issues', [HomeController::class, 'index']);
    Route::get('/issues/create', [HomeController::class, 'index']);
    Route::get('/issues/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/issues/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    Route::get('/vendors', [HomeController::class, 'index']);
    Route::get('/vendors/create', [HomeController::class, 'index']);
    Route::get('/vendors/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/vendors/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    Route::get('/fuels', [HomeController::class, 'index']);
    Route::get('/fuels/create', [HomeController::class, 'index']);
    Route::get('/fuels/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/fuels/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    Route::get('/parts', [HomeController::class, 'index']);
    Route::get('/parts/create', [HomeController::class, 'index']);
    Route::get('/parts/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/parts/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');

    Route::get('/service-reminders', [HomeController::class, 'index']);
    Route::get('/service-reminders/create', [HomeController::class, 'index']);
    Route::get('/service-reminders/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
    Route::get('/service-reminders/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
    
    Route::get('profile', [HomeController::class, 'index']);
});
