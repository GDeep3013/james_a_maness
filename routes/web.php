<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;

Auth::routes(['register' => false ]);

 Route::get('/', [HomeController::class, 'index']);
// Route::get('/login', [HomeController::class, 'index'])->name('login');
// Route::get('/signin', [HomeController::class, 'index'])->name('signin');
Route::get('/logout', function () {  Auth::logout();  return redirect('/login'); })->name('logout');


Route::middleware(['page.access'])->group(function () {

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

    
    Route::get('profile', [HomeController::class, 'index']);
});