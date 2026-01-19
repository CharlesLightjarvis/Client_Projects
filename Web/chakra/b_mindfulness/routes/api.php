<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PrismAIController;
use Illuminate\Support\Facades\Route;


Route::apiResource('posts', PostController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => UserResource::make($request->user()),
    ]);
});