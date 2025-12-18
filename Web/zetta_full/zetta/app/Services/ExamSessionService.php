<?php

namespace App\Services;

use App\Models\ExamSession;
use App\Models\User;
use App\Models\Certification;
use App\Models\Question;
use App\Exceptions\ExamTimeExpiredException;

class ExamSessionService
{
    public function __construct(
        private ExamGeneratorService $examGeneratorService
    ) {}

    public function createSession(User $user, Certification $certification): ExamSession
    {
        // Check if user has an active session for this certification
        $activeSession = ExamSession::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->first();

        if ($activeSession && $activeSession->isActive()) {
            return $activeSession;
        }

        // Generate exam data
        $examData = $this->examGeneratorService->generateExam($certification);
        
        // Get time limit from quiz configuration
        $quizConfig = $certification->quizConfiguration;
        $timeLimit = $quizConfig->time_limit ?? 60; // Default 60 minutes

        // Force UTC timezone pour éviter les problèmes entre local et production
        $startTime = \Carbon\Carbon::now('UTC');
        
        $session = ExamSession::create([
            'user_id' => $user->id,
            'certification_id' => $certification->id,
            'exam_data' => $examData,
            'started_at' => $startTime,
            'expires_at' => $startTime->copy()->addMinutes($timeLimit),
            'status' => 'active'
        ]);

        return $session;
    }

    public function saveAnswer(ExamSession $session, string $questionId, array $answerIds): void
    {
        if ($session->isExpired()) {
            throw new ExamTimeExpiredException('Cannot save answer: exam time has expired');
        }
        
        if (!$session->isActive()) {
            throw new \Exception('Exam session is not active');
        }

        $answers = $session->answers ?? [];
        $answers[$questionId] = $answerIds;

        $session->update(['answers' => $answers]);
    }

    public function submitExam(ExamSession $session): ExamSession
    {
        if ($session->status !== 'active') {
            throw new \Exception('Exam session is not active');
        }

        $score = $this->calculateScore($session);
        
        $session->update([
            'score' => $score,
            'submitted_at' => now(),
            'status' => 'submitted'
        ]);

        return $session;
    }

    public function expireSession(ExamSession $session): ExamSession
    {
        if ($session->status === 'active') {
            $score = $this->calculateScore($session);
            
            $session->update([
                'score' => $score,
                'submitted_at' => now(),
                'status' => 'expired'
            ]);
        }

        return $session;
    }

    public function calculateScore(ExamSession $session): float
    {
        $examQuestions = $session->exam_data['questions'] ?? [];
        $userAnswers = $session->answers ?? [];
        
        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($examQuestions as $question) {
            $questionId = $question['id'];
            $totalPoints += $question['points'] ?? 1;

            if (!isset($userAnswers[$questionId])) {
                continue; // No answer provided
            }

            // Get the original question to check correct answers
            $originalQuestion = Question::find($questionId);
            if (!$originalQuestion) {
                continue;
            }

            $correctAnswerIds = collect($originalQuestion->answers)
                ->where('correct', true)
                ->pluck('id')
                ->sort()
                ->values()
                ->toArray();

            $userAnswerIds = collect($userAnswers[$questionId])
                ->sort()
                ->values()
                ->toArray();

            // Check if user answers match correct answers exactly
            if ($correctAnswerIds === $userAnswerIds) {
                $earnedPoints += $question['points'] ?? 1;
            }
        }

        return $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 1) : 0;
    }

    public function checkAndExpireExpiredSessions(): int
    {
        $expiredSessions = ExamSession::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        $count = 0;
        foreach ($expiredSessions as $session) {
            $this->expireSession($session);
            $count++;
        }

        return $count;
    }

    public function getActiveSession(User $user, Certification $certification): ?ExamSession
    {
        return ExamSession::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->first();
    }

    public function generateDetailedResult(ExamSession $session): array
    {
        $examQuestions = $session->exam_data['questions'] ?? [];
        $userAnswers = $session->answers ?? [];
        $certification = $session->certification;
        $quizConfig = $certification->quizConfiguration;
        
        $totalPoints = 0;
        $earnedPoints = 0;
        $correctAnswers = 0;
        $questionResults = [];

        foreach ($examQuestions as $question) {
            $questionId = $question['id'];
            $questionPoints = $question['points'] ?? 1;
            $totalPoints += $questionPoints;

            // Get the original question for correct answers
            $originalQuestion = Question::find($questionId);
            if (!$originalQuestion) {
                continue;
            }

            $correctAnswerIds = collect($originalQuestion->answers)
                ->where('correct', true)
                ->pluck('id')
                ->toArray();

            $correctAnswerTexts = collect($originalQuestion->answers)
                ->whereIn('id', $correctAnswerIds)
                ->pluck('text')
                ->toArray();

            $userAnswerIds = $userAnswers[$questionId] ?? [];
            $userAnswerTexts = collect($originalQuestion->answers)
                ->whereIn('id', $userAnswerIds)
                ->pluck('text')
                ->toArray();

            // Check if answer is correct
            $isCorrect = !empty($userAnswerIds) && 
                         collect($correctAnswerIds)->sort()->values()->toArray() === 
                         collect($userAnswerIds)->sort()->values()->toArray();

            $pointsEarned = $isCorrect ? $questionPoints : 0;
            $earnedPoints += $pointsEarned;

            if ($isCorrect) {
                $correctAnswers++;
            }

            $questionResults[] = [
                'question' => $question['question'],
                'student_answer' => implode(', ', $userAnswerTexts),
                'correct_answer' => implode(', ', $correctAnswerTexts),
                'explanation' => $this->generateExplanation($question, $isCorrect),
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
                'points_possible' => $questionPoints,
                'difficulty' => $question['difficulty'] ?? 'medium'
            ];
        }

        $scorePercentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 1) : 0;
        $passingScore = $quizConfig->passing_score ?? 70;
        $passed = $scorePercentage >= $passingScore;

        // Get attempt number (count previous completed attempts + current)
        $attemptNumber = ExamSession::where('user_id', $session->user_id)
            ->where('certification_id', $session->certification_id)
            ->whereIn('status', ['submitted', 'expired'])
            ->where('id', '!=', $session->id) // Exclude current session
            ->count() + 1;

        return [
            'certification_name' => $certification->name,
            'score' => $scorePercentage,
            'passing_score' => $passingScore,
            'passed' => $passed,
            'attempt_number' => $attemptNumber,
            'completed_at' => $session->submitted_at,
            'questions' => $questionResults,
            'total_questions' => count($examQuestions),
            'correct_answers' => $correctAnswers,
            'session_id' => $session->id,
            'status' => $session->status,
            'submitted_at' => $session->submitted_at
        ];
    }

    private function generateExplanation(array $question, bool $isCorrect): string
    {
        if ($isCorrect) {
            $explanations = [
                'Excellent! You have demonstrated a solid understanding of this concept.',
                'Correct! This shows your good grasp of the fundamental principles.',
                'Well done! You have successfully identified the right approach.',
                'Perfect! Your knowledge of this topic is clearly evident.',
                'Great job! You understand the key concepts involved.'
            ];
        } else {
            $explanations = [
                'This concept requires careful consideration of best practices and industry standards.',
                'Understanding this topic is crucial for professional development and implementation.',
                'This principle is fundamental to creating robust and maintainable solutions.',
                'Mastering this concept will improve your overall technical expertise.',
                'This knowledge is essential for following proper development methodologies.'
            ];
        }

        return $explanations[array_rand($explanations)];
    }
}