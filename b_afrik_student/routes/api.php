<?php

use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\CourseSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;



// Enrollment actions - bulk unenroll (MUST be before apiResource)
Route::delete('enrollments/unenroll', [EnrollmentController::class, 'unenrollStudents']);

Route::apiResource('users', UserController::class);
Route::apiResource('lessons', LessonController::class);
Route::apiResource('formations', FormationController::class);
Route::apiResource('course-sessions', CourseSessionController::class);
Route::apiResource('enrollments', EnrollmentController::class);
Route::apiResource('modules', ModuleController::class);

// Get formations where the authenticated student is enrolled
Route::get('student/formations', [FormationController::class, 'getStudentEnrolledFormations'])->middleware('auth:sanctum');



// Get available students (not yet enrolled) for a course session
Route::get('course-sessions/{courseSession}/available-students', [CourseSessionController::class, 'getAvailableStudents']);

// Get students enrolled in a course session
Route::get('course-sessions/{courseSession}/students', [CourseSessionController::class, 'getSessionStudents']);







// Instructor routes
Route::get('instructors/{instructorId}/course-sessions', [CourseSessionController::class, 'getCourseSessionsByInstructor']);
Route::get('instructor/lessons', [LessonController::class, 'getInstructorLessons']);



Route::get('students/{studentId}/course-sessions', [CourseSessionController::class, 'getCourseSessionsByStudent']);




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