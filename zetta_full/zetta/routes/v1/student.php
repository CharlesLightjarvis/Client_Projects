<?php

use App\Http\Controllers\v1\CourseSchedulesController;
use App\Http\Controllers\v1\PaymentController;
use App\Http\Controllers\v1\StudentCertificationController;
use App\Http\Controllers\v1\StudentController;
use App\Http\Controllers\v1\StudentFormationController;
use Illuminate\Support\Facades\Route;



Route::prefix('student')->group(function () {
    Route::get('certifications', [StudentCertificationController::class, 'index']);
    Route::get('certifications/{certificationId}', [StudentCertificationController::class, 'show']);
    Route::get('certifications/{certificationId}/quiz', [StudentCertificationController::class, 'getQuizQuestions']);

    Route::get('formations', [StudentFormationController::class, 'index']);
    Route::get('formations/{formationId}', [StudentFormationController::class, 'show']);


    Route::post('certifications/{certificationId}/quiz/submit', [StudentCertificationController::class, 'submitQuiz']);
    Route::get('certifications/{certificationId}/quiz-results/{progressTrackingId}', [StudentCertificationController::class, 'getQuizResult']);

    // Dans le groupe student existant
    Route::get('payments', [PaymentController::class, 'studentPayments']);

    Route::get('statistics', [StudentController::class, 'getStatistics']);
});
