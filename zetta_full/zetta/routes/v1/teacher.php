<?php

use App\Http\Controllers\v1\AttendanceController;
use App\Http\Controllers\v1\CourseSchedulesController;
use App\Http\Controllers\v1\ResourceController;
use App\Http\Controllers\v1\TeacherController;
use Illuminate\Support\Facades\Route;

Route::prefix('teacher')->group(function () {
    Route::get('sessions', [TeacherController::class, 'sessions']);

    Route::get('statistics', [TeacherController::class, 'getStatistics']);

    // Routes pour la gestion des présences
    Route::prefix('attendance')->group(function () {
        // Récupérer les présences d'une session pour une date
        Route::get('sessions/{sessionId}', [AttendanceController::class, 'getSessionAttendance']);

        // Enregistrer les présences
        Route::post('record', [AttendanceController::class, 'recordAttendance']);

        // Mettre à jour une présence
        Route::put('{id}', [AttendanceController::class, 'updateAttendance']);

        // Supprimer une présence
        Route::delete('{id}', [AttendanceController::class, 'deleteAttendance']);

        // Historique des présences d'un étudiant
        Route::get('sessions/{sessionId}/students/{studentId}', [AttendanceController::class, 'getStudentAttendance']);

        Route::get('my-records', [AttendanceController::class, 'getTeacherAttendances']);
    });

    Route::prefix('resources')->group(function () {
        Route::get('lessons/{lessonId}', [ResourceController::class, 'index']);
        Route::get('{id}', [ResourceController::class, 'show']);
        Route::post('/', [ResourceController::class, 'store']);
        Route::post('{id}', [ResourceController::class, 'update']);
        Route::delete('{id}', [ResourceController::class, 'destroy']);
    });

});
