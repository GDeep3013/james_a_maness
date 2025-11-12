<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StaffController;


Route::get('/', [HomeController::class, 'index'])->name('login');
Route::get('/login', [HomeController::class, 'index']);
Route::get('/signin', [HomeController::class, 'index'])->name('signin');


Route::get('/logout', function () {  Auth::logout();  return redirect('/login'); })->name('logout');

Route::get('/create-password/{id}', [StaffController::class, 'getStaff'])->middleware('guest')->name('create-password.show');

Route::post('/create-password', [StaffController::class, 'confirmPassword'])->middleware('guest')->name('create-password.store');

Auth::routes(['register' => false, 'login' => false     ]);

Route::middleware(['page.access'])->group(function () {

    Route::get('/', [HomeController::class, 'index'])->name('home');

        
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

    Route::get('profile', [HomeController::class, 'index']);
});