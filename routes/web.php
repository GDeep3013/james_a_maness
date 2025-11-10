<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StaffController;

Route::get('/', function () {
    return view('auth.login');
})->middleware('guest')->name('login');

Route::get('/logout', function () {
    Auth::logout();
    return redirect('/login');
})->name('logout');

Route::get('/create-password/{id}', [StaffController::class, 'getStaff'])
    ->middleware('guest')
    ->name('create-password.show');

Route::post('/create-password', [StaffController::class, 'confirmPassword'])
    ->middleware('guest')
    ->name('create-password.store');

Auth::routes(['register' => false]);

Route::middleware(['auth'])->group(function () {

    Route::get('/', [HomeController::class, 'index'])->name('home');
    
    Route::middleware(['page.access'])->group(function () {
        Route::get('/drivers', [HomeController::class, 'index']);
        Route::get('/drivers/create', [HomeController::class, 'index']);
        Route::get('/drivers/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
        Route::get('/drivers/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
        
        Route::get('/vehicles', [HomeController::class, 'index']);
        Route::get('/vehicles/create', [HomeController::class, 'index']);
        Route::get('/vehicles/{id}', [HomeController::class, 'index'])->where('id', '[0-9]+');
        Route::get('/vehicles/{id}/edit', [HomeController::class, 'index'])->where('id', '[0-9]+');
        
        Route::get('/profile', [HomeController::class, 'index']);
    });
    Route::fallback([HomeController::class, 'index']);
});