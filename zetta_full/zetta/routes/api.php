<?php

use App\Http\Controllers\v1\CourseSchedulesController;
use App\Http\Controllers\v1\PrismController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    require __DIR__ . '/v1/student.php';
    require __DIR__ . '/v1/guest.php';
    require __DIR__ . '/v1/admin.php';
    require __DIR__ . '/v1/teacher.php';
    require __DIR__ . '/v1/auth.php';

    Route::get("/pfe", function () {
        return response()->json([
            "Title" => "Projet de Fin d'Etude",
            "Subject" => "Développement d'une application web de plateforme de formation",
            "Author" => "TAGNE NEGUIN Charles",
            "Encadreur" => "M. Mohamed KOUBAA",
            "jurys" => [
                "M. Slim KALLEL",
                "M. Fahmi KALLEL"
            ],
            "Date" => "20/09/2024",
            "Lieu" => "IIT- Sfax"
        ]);
    } );
    
    Route::get('/schedules/date-range', [CourseSchedulesController::class, 'getDateRangeSchedules']);
    Route::get('/schedules/week', [CourseSchedulesController::class, 'getWeekSchedules']);
    Route::get('/schedules/session/{sessionId}', [CourseSchedulesController::class, 'getBySession']);
    Route::get('/schedules/{id}', [CourseSchedulesController::class, 'show']);
    Route::get('/schedules', [CourseSchedulesController::class, 'index']);

    Route::post('/schedules', [CourseSchedulesController::class, 'store']);

    Route::post('/prism/ask', [PrismController::class, 'askQuestion']);
    Route::post('/prism/clear', [PrismController::class, 'clearConversation']);
    
    // Routes pour les étudiants
    Route::get('/student/schedules', [CourseSchedulesController::class, 'getStudentSchedules']);
    
    // Routes pour les professeurs
    Route::get('/teacher/schedules', [CourseSchedulesController::class, 'getTeacherSchedules']);
});
