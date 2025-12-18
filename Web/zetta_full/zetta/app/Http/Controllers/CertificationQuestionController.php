<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuestionRequest;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Http\JsonResponse;

class CertificationQuestionController extends Controller
{
    /**
     * Display a listing of questions for a chapter.
     */
    public function index(Chapter $chapter): JsonResponse
    {
        $questions = $chapter->questions()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questions,
        ]);
    }

    /**
     * Store a newly created question in the chapter.
     */
    public function store(Chapter $chapter, QuestionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Associate the question with the chapter
        $validated['chapter_id'] = $chapter->id;
        
        $question = Question::create($validated);
        $question->load('chapter');

        return response()->json([
            'success' => true,
            'message' => 'Question créée avec succès.',
            'data' => $question,
        ], 201);
    }

    /**
     * Display the specified question.
     */
    public function show(Chapter $chapter, Question $question): JsonResponse
    {
        // Ensure the question belongs to the specified chapter
        if ($question->chapter_id !== $chapter->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question non trouvée dans ce chapitre.',
            ], 404);
        }

        $question->load('chapter');

        return response()->json([
            'success' => true,
            'data' => $question,
        ]);
    }

    /**
     * Update the specified question.
     */
    public function update(Chapter $chapter, Question $question, QuestionRequest $request): JsonResponse
    {
        // Ensure the question belongs to the specified chapter
        if ($question->chapter_id !== $chapter->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question non trouvée dans ce chapitre.',
            ], 404);
        }

        $validated = $request->validated();
        $question->update($validated);
        $question->load('chapter');

        return response()->json([
            'success' => true,
            'message' => 'Question mise à jour avec succès.',
            'data' => $question,
        ]);
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy(Chapter $chapter, Question $question): JsonResponse
    {
        // Ensure the question belongs to the specified chapter
        if ($question->chapter_id !== $chapter->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question non trouvée dans ce chapitre.',
            ], 404);
        }

        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'Question supprimée avec succès.',
        ]);
    }
}