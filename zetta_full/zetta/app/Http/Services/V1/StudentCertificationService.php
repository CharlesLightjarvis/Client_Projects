<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\CertificationQuizResource;
use App\Http\Resources\v1\CertificationResource;
use App\Models\Certification;
use App\Models\ProgressTracking;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentCertificationService
{
    public function getStudentCertifications($studentId)
    {
        $user = User::findOrFail($studentId);
        $formations = $user->formations()->with('certifications.formations')->get();

        return CertificationResource::collection(
            $formations->pluck('certifications')->flatten()
        );
    }

    public function getCertificationDetails($studentId, $certificationId)
    {
        $user = User::findOrFail($studentId);
        $certification = Certification::whereHas('formations.students', function ($query) use ($studentId) {
            $query->where('users.id', $studentId);
        })->findOrFail($certificationId);

        $certification->load('formations');

        return new CertificationResource($certification);
    }

    public function getCertificationQuizQuestions($studentId, $certificationId)
    {
        $user = User::findOrFail($studentId);
        $certification = Certification::whereHas('formations.students', function ($query) use ($studentId) {
            $query->where('users.id', $studentId);
        })
            ->with(['quizConfiguration', 'formations.modules'])
            ->findOrFail($certificationId);

        // Récupérer les questions depuis les modules configurés
        $moduleIds = [];
        $moduleDistribution = $certification->quizConfiguration->module_distribution ?? [];
        if (!empty($moduleDistribution)) {
            $moduleIds = array_keys($moduleDistribution);
        } else {
            $moduleIds = $certification->formations->modules->pluck('id')->toArray();
        }

        $questions = Question::where('questionable_type', \App\Models\Module::class)
            ->whereIn('questionable_id', $moduleIds)
            ->where('type', 'certification')
            ->get();

        Log::info('Questions des modules pour quiz', [
            'certification_id' => $certification->id,
            'module_ids' => $moduleIds,
            'questions_count' => $questions->count(),
            'total_questions_required' => $certification->quizConfiguration->total_questions
        ]);

        // Logique pour sélectionner les questions selon la configuration du quiz
        $selectedQuestions = $this->selectQuestionsBasedOnConfig($certification, $questions);

        // On récupère les IDs des questions sélectionnées
        $questionIds = $selectedQuestions->pluck('id')->toArray();

        // On passe tout à la resource
        return new CertificationQuizResource([
            'certification' => $certification,
            'questions' => $selectedQuestions,
            'question_ids' => $questionIds, // <-- AJOUT ICI
            'time_limit' => $certification->quizConfiguration->time_limit
        ]);
    }

    public function getQuizResult($studentId, $certificationId, $progressTrackingId)
    {
        $progress = ProgressTracking::where('id', $progressTrackingId)
            ->where('trackable_type', Certification::class)
            ->where('trackable_id', $certificationId)
            ->where('user_id', $studentId)
            ->firstOrFail();

        return $this->formatQuizResult($progress);
    }

    public function submitQuiz($studentId, $certificationId, $answers, $questionIds)
    {
        DB::beginTransaction();
        try {
            $certification = Certification::with(['quizConfiguration', 'formations.modules'])
                ->whereHas('formations.students', function ($query) use ($studentId) {
                    $query->where('users.id', $studentId);
                })
                ->findOrFail($certificationId);

            $totalScore = 0;
            $maxScore = 0;
            $answerDetails = [];

            // Utilise la liste complète des questions générées
            $questions = Question::whereIn('id', $questionIds)->get();

            foreach ($questions as $question) {
                $studentAnswer = $answers[$question->id] ?? null;
                $correct = false;
                if ($studentAnswer !== null) {
                    $correctAnswer = collect($question->answers)->first(function ($answer) {
                        return $answer['correct'] === true;
                    });
                    $correct = (string)$studentAnswer === (string)$correctAnswer['id'];
                    if ($correct) {
                        $totalScore += $question->points;
                    }
                }
                $maxScore += $question->points;
                $answerDetails[] = [
                    'question_id' => $question->id,
                    'student_answer' => $studentAnswer,
                    'correct' => $correct,
                    'points_earned' => $correct ? $question->points : 0,
                    'points_possible' => $question->points
                ];
            }

            $percentageScore = $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;
            $percentageScore = round($percentageScore, 2);
            $passed = $percentageScore >= $certification->quizConfiguration->passing_score;

            $progress = new ProgressTracking([
                'user_id' => $studentId,
                'trackable_type' => Certification::class,
                'trackable_id' => $certificationId,
                'answer_details' => $answerDetails,
                'score' => $percentageScore,
                'passed' => $passed,
                'attempt_number' => $this->getAttemptNumber($studentId, $certificationId),
                'completed_at' => now(),
                'question_ids' => $questionIds // <-- ENREGISTRE ICI
            ]);

            $progress->save();
            $progress->load('trackable');

            DB::commit();
            return $this->formatQuizResult($progress);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    private function formatQuizResult($progress)
    {
        $certification = $progress->trackable;

        if (!$certification) {
            Log::error('Missing certification for progress tracking', [
                'progress_id' => $progress->id,
                'trackable_id' => $progress->trackable_id,
                'trackable_type' => $progress->trackable_type
            ]);
            throw new ModelNotFoundException('Certification not found');
        }

        // Charger la formation et ses modules
        $certification->load('formations.modules');
        $moduleIds = [];
        $moduleDistribution = $certification->quizConfiguration->module_distribution ?? [];
        if (!empty($moduleDistribution)) {
            $moduleIds = array_keys($moduleDistribution);
        } else {
            $moduleIds = $certification->formations->modules->pluck('id')->toArray();
        }

        // On récupère la liste exacte des questions posées
        $questionIds = $progress->question_ids ?? [];
        $questions = Question::where('questionable_type', \App\Models\Module::class)
            ->whereIn('questionable_id', $moduleIds)
            ->whereIn('id', $questionIds)
            ->where('type', 'certification')
            ->get();

        // On garde l'ordre original des questions posées
        $questions = $questions->sortBy(function ($q) use ($questionIds) {
            return array_search($q->id, $questionIds);
        });

        $detailedQuestions = collect($questionIds)->map(function ($questionId) use ($questions, $progress) {
            $question = $questions->firstWhere('id', $questionId);
            if (!$question) return null;

            $answerDetail = collect($progress->answer_details)
                ->firstWhere('question_id', $question->id);

            $correctAnswer = collect($question->answers)
                ->first(function ($answer) {
                    return $answer['correct'] === true;
                });

            $studentAnswerText = 'Non répondu';
            $isCorrect = false;
            $pointsEarned = 0;

            if ($answerDetail) {
                if ($answerDetail['student_answer'] !== null) {
                    foreach ($question->answers as $answer) {
                        if ((string)$answer['id'] === (string)$answerDetail['student_answer']) {
                            $studentAnswerText = $answer['text'];
                            break;
                        }
                    }
                    if ($studentAnswerText === 'Non répondu') {
                        $studentAnswerText = $this->getAnswerText($question->answers, $answerDetail['student_answer']);
                    }
                    if ($studentAnswerText === 'Réponse non trouvée') {
                        $studentAnswerText = "Réponse #" . $answerDetail['student_answer'];
                    }
                }
                $isCorrect = $answerDetail['correct'];
                $pointsEarned = $answerDetail['points_earned'];
            }

            return [
                'question' => $question->question,
                'student_answer' => $studentAnswerText,
                'correct_answer' => $correctAnswer['text'] ?? null,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
                'points_possible' => $question->points,
                'difficulty' => $question->difficulty
            ];
        })->filter()->values();

        return [
            'certification_name' => $certification->name,
            'score' => round($progress->score, 2),
            'passing_score' => $certification->quizConfiguration->passing_score,
            'passed' => $progress->passed,
            'attempt_number' => $progress->attempt_number,
            'completed_at' => $progress->completed_at->format('Y-m-d H:i:s'),
            'questions' => $detailedQuestions,
            'total_questions' => count($questionIds),
            'correct_answers' => collect($progress->answer_details)->where('correct', true)->count(),
        ];
    }

    private function getAnswerText($answers, $studentAnswerId)
    {
        // Conversion en string pour comparaison cohérente
        $studentAnswerId = (string) $studentAnswerId;

        // Méthode 1 : recherche par clé directe si c'est un tableau associatif
        if (isset($answers[$studentAnswerId]) && isset($answers[$studentAnswerId]['text'])) {
            return $answers[$studentAnswerId]['text'];
        }

        // Méthode 2 : recherche séquentielle si c'est un tableau indexé
        foreach ($answers as $answer) {
            if ((string)$answer['id'] === $studentAnswerId) {
                return $answer['text'];
            }
        }

        return 'Réponse non trouvée';
    }

    private function getAttemptNumber($studentId, $certificationId)
    {
        return ProgressTracking::where('user_id', $studentId)
            ->where('trackable_type', Certification::class)
            ->where('trackable_id', $certificationId)
            ->count() + 1;
    }

    private function selectQuestionsBasedOnConfig($certification, $questions)
    {
        $config = $certification->quizConfiguration;

        // Logique de sélection des questions selon la difficulté et le nombre total
        // À implémenter selon vos besoins spécifiques
        return $questions->random($config->total_questions);
    }
}
