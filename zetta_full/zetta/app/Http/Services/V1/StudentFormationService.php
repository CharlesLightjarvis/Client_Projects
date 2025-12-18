<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\FormationResource;
use App\Http\Resources\v1\QuestionResource;
use App\Models\Formation;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class StudentFormationService
{
    public function getStudentFormations($studentId)
    {
        $user = User::findOrFail($studentId);
        $formations = $user->formations()
            ->with([
                'category',
                'certifications',
                'modules.lessons.resources',
                'sessions' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'sessions.teacher'
            ])
            ->get();

        return FormationResource::collection($formations);
    }

    // public function getFormationDetails($studentId, $formationId)
    // {
    //     $user = User::findOrFail($studentId);
    //     $formation = $user->formations()
    //         ->with([
    //             'category',
    //             'certifications',
    //             'modules.lessons.resources',
    //             'sessions' => function ($query) {
    //                 $query->orderBy('start_date', 'desc');
    //             },
    //             'sessions.teacher'
    //         ])
    //         ->where('formations.id', $formationId)
    //         ->firstOrFail();

    //     return new FormationResource($formation);
    // }

    public function getFormationDetails($studentId, $formationId)
    {
        $user = User::findOrFail($studentId);
        $formation = $user->formations()
            ->with([
                'category',
                'certifications',
                'modules.lessons.resources',
                'sessions' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'sessions.teacher'
            ])
            ->where('formations.id', $formationId)
            ->firstOrFail();

        // Récupérer les quiz des leçons de manière aléatoire
        $lessonQuizzes = $this->getLessonQuizzes($formation);

        // Ajouter les quiz à la ressource
        $formationResource = new FormationResource($formation);
        $formationData = $formationResource->toArray(request());
        $formationData['lesson_quizzes'] = $lessonQuizzes;

        Log::info('Formation Details JSON: ' . json_encode($formationData, JSON_PRETTY_PRINT));


        return $formationData;
    }

    /**
     * Récupérer les quiz des leçons de manière aléatoire
     * 
     * @param Formation $formation
     * @return array
     */
    private function getLessonQuizzes(Formation $formation)
    {
        $quizService = app(QuizService::class);
        $lessonQuizzes = [];

        // Parcourir tous les modules de la formation
        foreach ($formation->modules as $module) {
            // Parcourir toutes les leçons du module
            foreach ($module->lessons as $lesson) {
                // Récupérer les questions liées à cette leçon (type normal)
                $questions = Question::where('questionable_type', Lesson::class)
                    ->where('questionable_id', $lesson->id)
                    ->where('type', 'normal')
                    ->inRandomOrder()
                    ->limit(5) // Limiter à 5 questions par leçon
                    ->get();

                // Si des questions existent pour cette leçon
                if ($questions->count() > 0) {
                    $lessonQuizzes[] = [
                        'lesson_id' => $lesson->id,
                        'lesson_name' => $lesson->name,
                        'module_id' => $module->id,
                        'module_name' => $module->name,
                        'questions' => QuestionResource::collection($questions)->toArray(request())
                    ];
                }
            }
        }

        return $lessonQuizzes;
    }
}
