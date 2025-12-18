<?php

use App\Http\Controllers\v1\AdminController;
use App\Http\Controllers\v1\QuizController;
use App\Http\Controllers\v1\CertificationController;
use App\Http\Controllers\v1\FormationController;
use App\Http\Controllers\v1\FormationInterestController;
use App\Http\Controllers\v1\FormationSessionController;
use App\Http\Controllers\v1\LessonController;
use App\Http\Controllers\v1\ModuleController;
use App\Http\Controllers\v1\PaymentController;
use App\Http\Controllers\v1\RoleController;
use App\Http\Controllers\v1\PermissionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\UserController;
use App\Http\Controllers\v1\CategoryController;
use App\Http\Controllers\v1\CourseSchedulesController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CertificationQuestionController;
use App\Http\Controllers\ExamConfigurationController;
use App\Http\Controllers\ExamGeneratorController;

Route::prefix('admin')->group(function () {
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    
    // Role-Permission assignment routes
    Route::post('roles/{role}/permissions/assign', [RoleController::class, 'assignPermissions']);
    Route::post('roles/{role}/permissions/revoke', [RoleController::class, 'revokePermissions']);
    Route::post('roles/{role}/permissions/sync', [RoleController::class, 'syncPermissions']);
    Route::get('roles/{role}/permissions', [RoleController::class, 'getPermissions']);
    Route::apiResource('users', UserController::class);
    Route::apiResource('lessons', LessonController::class);
    Route::apiResource('modules', ModuleController::class);
    Route::apiResource('sessions', FormationSessionController::class);
    Route::apiResource('certifications', CertificationController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('formations', FormationController::class);
    Route::apiResource('interests', FormationInterestController::class);
    Route::post('interests/{id}/approve', [FormationInterestController::class, 'approve']);
    Route::get('sessions/{sessionId}/students', [FormationSessionController::class, 'getSessionStudents']);
    Route::get('students/{studentId}/sessions-formations', [UserController::class, 'getStudentSessionsAndFormations']);

    Route::post('sessions/{sessionId}/students/{studentId}', [FormationSessionController::class, 'enrollStudent']);
    Route::delete('sessions/{sessionId}/students/{studentId}', [FormationSessionController::class, 'unenrollStudent']);
    // Dans le groupe admin existant
    Route::apiResource('payments', PaymentController::class);
    Route::get('students', [UserController::class, 'getStudents']);

    Route::post('formations/{formation}/enroll', [FormationController::class, 'enrollStudent']);
    Route::delete('formations/{formation}/unenroll/{studentId}', [FormationController::class, 'unenrollStudent']);

    Route::get('formations/{formation}/students', [FormationController::class, 'getEnrolledStudents']);

    Route::get('statistics', [AdminController::class, 'getStatistics']);

    // Routes pour les quiz
    Route::prefix('quiz')->group(function () {
        Route::post('configurations', [QuizController::class, 'storeConfiguration']);
        Route::get('configurations', [QuizController::class, 'getAllConfigurations']);
        Route::get('configurations/{id}', [QuizController::class, 'getConfiguration']);
        Route::put('configurations/{id}', [QuizController::class, 'updateConfiguration']);  // Nouvelle route
        Route::delete('configurations/{id}', [QuizController::class, 'deleteConfiguration']);  // Nouvelle route

        Route::post('questions', [QuizController::class, 'storeQuestion']);
        Route::get('questions', [QuizController::class, 'getAllQuestions']);
        Route::get('questions/{id}', [QuizController::class, 'getQuestion']);
        Route::put('questions/{id}', [QuizController::class, 'updateQuestion']);  // Nouvelle route
        Route::delete('questions/{id}', [QuizController::class, 'deleteQuestion']);  // Nouvelle route

        Route::get('generate-quiz/{configId}/{type?}', [QuizController::class, 'generateQuiz']);

    });

    Route::get('certifications/{certificationId}/modules', [QuizController::class, 'getCertificationModules']);

    // Routes pour la gestion des chapitres
    Route::get('certifications/{certification}/chapters', [ChapterController::class, 'index']);
    Route::post('certifications/{certification}/chapters', [ChapterController::class, 'store']);
    Route::get('chapters/{chapter}', [ChapterController::class, 'show']);
    Route::put('chapters/{chapter}', [ChapterController::class, 'update']);
    Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy']);

    // Routes pour la gestion des questions de certification
    Route::get('chapters/{chapter}/questions', [CertificationQuestionController::class, 'index']);
    Route::post('chapters/{chapter}/questions', [CertificationQuestionController::class, 'store']);
    Route::get('chapters/{chapter}/questions/{question}', [CertificationQuestionController::class, 'show']);
    Route::put('chapters/{chapter}/questions/{question}', [CertificationQuestionController::class, 'update']);
    Route::delete('chapters/{chapter}/questions/{question}', [CertificationQuestionController::class, 'destroy']);

    // Routes pour la configuration d'examens
    Route::get('certifications/{certification}/exam-configuration', [ExamConfigurationController::class, 'show']);
    Route::put('certifications/{certification}/exam-configuration', [ExamConfigurationController::class, 'update']);

    // Routes pour la génération et l'exécution d'examens
    Route::get('certifications/{certification}/exam/generate', [ExamGeneratorController::class, 'generate']);
    Route::post('certifications/{certification}/exam/start', [ExamGeneratorController::class, 'start']);
    Route::post('exam-sessions/{session}/submit', [ExamGeneratorController::class, 'submit']);
    Route::post('exam-sessions/{session}/save-answer', [ExamGeneratorController::class, 'saveAnswer']);
    Route::get('exam-sessions/{session}/status', [ExamGeneratorController::class, 'status']);
});

