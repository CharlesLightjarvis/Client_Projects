<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/debug/quiz-configs', function () {
    return \App\Models\QuizConfiguration::with('configurable')->get();
});

Route::get('/debug/questions', function () {
    return \App\Models\Question::with('questionable')->get();
});
