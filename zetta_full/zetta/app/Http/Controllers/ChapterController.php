<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChapterRequest;
use App\Models\Certification;
use App\Models\Chapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    /**
     * Display a listing of chapters for a certification.
     */
    public function index(Certification $certification): JsonResponse
    {
        $chapters = $certification->chapters()
            ->withCount('questions')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $chapters,
        ]);
    }

    /**
     * Store a newly created chapter.
     */
    public function store(Certification $certification, ChapterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // If no order is provided, set it to the next available order
        if (!isset($validated['order'])) {
            $maxOrder = $certification->chapters()->max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $chapter = $certification->chapters()->create($validated);
        $chapter->load('certification');
        $chapter->loadCount('questions');

        return response()->json([
            'success' => true,
            'message' => 'Chapitre créé avec succès.',
            'data' => $chapter,
        ], 201);
    }

    /**
     * Display the specified chapter.
     */
    public function show(Chapter $chapter): JsonResponse
    {
        $chapter->load('certification');
        $chapter->loadCount('questions');

        return response()->json([
            'success' => true,
            'data' => $chapter,
        ]);
    }

    /**
     * Update the specified chapter.
     */
    public function update(Chapter $chapter, ChapterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $chapter->update($validated);
        $chapter->load('certification');
        $chapter->loadCount('questions');

        return response()->json([
            'success' => true,
            'message' => 'Chapitre mis à jour avec succès.',
            'data' => $chapter,
        ]);
    }

    /**
     * Remove the specified chapter from storage.
     */
    public function destroy(Chapter $chapter): JsonResponse
    {
        // Check if chapter has questions
        $questionsCount = $chapter->questions()->count();
        
        if ($questionsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer le chapitre car il contient {$questionsCount} question(s). Supprimez d'abord les questions associées.",
            ], 422);
        }

        $chapterName = $chapter->name;
        $chapter->delete();

        return response()->json([
            'success' => true,
            'message' => "Le chapitre '{$chapterName}' a été supprimé avec succès.",
        ]);
    }
}