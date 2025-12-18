<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::get('/me', [App\Http\Controllers\v1\AuthController::class, 'me']);
});
