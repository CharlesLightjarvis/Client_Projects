<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamConfigurationRequest;
use App\Models\Certification;
use Illuminate\Http\JsonResponse;

class ExamConfigurationController extends Controller
{
    /**
     * Display the exam configuration for a certification
     */
    public function show(Certification $certification): JsonResponse
    {
        $certification->load(['chapters.questions', 'quizConfiguration']);
        
        $chapters = $certification->chapters->map(function ($chapter) {
            return [
                'id' => $chapter->id,
                'name' => $chapter->name,
                'order' => $chapter->order,
                'description' => $chapter->description,
                'questions_count' => $chapter->questions_count,
            ];
        });

        $configuration = $certification->quizConfiguration;

        return response()->json([
            'certification' => [
                'id' => $certification->id,
                'name' => $certification->name,
            ],
            'chapters' => $chapters,
            'configuration' => $configuration ? [
                'total_questions' => $configuration->total_questions,
                'chapter_distribution' => $configuration->chapter_distribution ?? [],
                'time_limit' => $configuration->time_limit,
                'passing_score' => $configuration->passing_score,
            ] : null,
        ]);
    }

    /**
     * Update or create exam configuration for a certification
     */
    public function update(Certification $certification, ExamConfigurationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $configuration = $certification->quizConfiguration()->updateOrCreate(
            [
                'configurable_type' => Certification::class,
                'configurable_id' => $certification->id,
            ],
            [
                'total_questions' => $validated['total_questions'],
                'chapter_distribution' => $validated['chapter_distribution'],
                'time_limit' => $validated['time_limit'],
                'passing_score' => $validated['passing_score'],
                'difficulty_distribution' => [], // Add default empty array
                'module_distribution' => [], // Add default empty array
            ]
        );

        return response()->json([
            'message' => 'Exam configuration updated successfully',
            'configuration' => [
                'total_questions' => $configuration->total_questions,
                'chapter_distribution' => $configuration->chapter_distribution,
                'time_limit' => $configuration->time_limit,
                'passing_score' => $configuration->passing_score,
            ],
        ]);
    }
}