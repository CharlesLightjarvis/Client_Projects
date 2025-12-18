<?php

use App\Http\Controllers\v1\CategoryController;
use App\Http\Controllers\v1\FormationController;
use App\Http\Controllers\v1\FormationSessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\CertificationController;
use App\Http\Controllers\v1\ModuleController;
use App\Http\Controllers\v1\LessonController;

Route::prefix('guest')->group(function () {
    Route::get('formations', [FormationController::class, 'index']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('lessons', [LessonController::class, 'index']);
    Route::get('sessions', [FormationSessionController::class, 'index']);
    Route::get('modules', [ModuleController::class, 'index']);
    Route::get('formations/slug/{slug}', [FormationController::class, 'getFormationBySlug']);
    Route::get('certifications', [CertificationController::class, 'index']);
});
