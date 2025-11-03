<?php

use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\PostController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\CourseSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;



Route::apiResource('users', UserController::class);
Route::apiResource('lessons', LessonController::class);
Route::apiResource('modules', ModuleController::class);
Route::apiResource('formations', FormationController::class);
Route::apiResource('course-sessions', CourseSessionController::class);
Route::apiResource('enrollments', EnrollmentController::class);

// Enrollment actions
Route::post('enrollments/{enrollment}/confirm', [EnrollmentController::class, 'confirm']);
Route::post('enrollments/{enrollment}/cancel', [EnrollmentController::class, 'cancelEnrollment']);

// Progress routes
Route::post('lessons/{lessonId}/complete', [ProgressController::class, 'markLessonCompleted']);
Route::post('lessons/{lessonId}/incomplete', [ProgressController::class, 'markLessonIncomplete']);
Route::get('lessons/{lessonId}/progress', [ProgressController::class, 'getLessonProgress']);
Route::get('students/{studentId}/progress', [ProgressController::class, 'getStudentProgress']);
Route::get('students/{studentId}/formations/{formationId}/completion', [ProgressController::class, 'getFormationCompletion']);
Route::get('students/{studentId}/modules/{moduleId}/completion', [ProgressController::class, 'getModuleCompletion']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => UserResource::make($request->user()),
    ]);
});