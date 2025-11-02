<?php

use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\PostController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\FormationController;
use Illuminate\Support\Facades\Route;



Route::apiResource('users', UserController::class);
Route::apiResource('lessons', LessonController::class);
Route::apiResource('modules', ModuleController::class);
Route::apiResource('formations', FormationController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => UserResource::make($request->user()),
    ]);
});