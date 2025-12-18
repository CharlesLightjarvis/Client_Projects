<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Exceptions\InsufficientQuestionsException;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class ExamGeneratorService
{
    /**
     * Generate an exam for a certification based on its configuration
     *
     * @param Certification $certification
     * @return array
     * @throws InvalidArgumentException
     */
    public function generateExam(Certification $certification): array
    {
        $configuration = $certification->quizConfiguration;
        
        if (!$configuration || !$configuration->hasChapterDistribution()) {
            throw new InvalidArgumentException('No exam configuration found for this certification');
        }

        $selectedQuestions = $this->selectQuestionsFromChapters($configuration);
        
        if ($selectedQuestions->isEmpty()) {
            throw new InvalidArgumentException('No questions available for exam generation');
        }

        // Shuffle the order of questions from all chapters
        $shuffledQuestions = $selectedQuestions->shuffle();

        // Shuffle answers for each question and format for exam
        $examQuestions = $shuffledQuestions->map(function ($question) {
            return $this->formatQuestionForExam($question);
        });

        return [
            'certification_id' => $certification->id,
            'questions' => $examQuestions->toArray(),
            'time_limit' => $configuration->time_limit,
            'total_points' => $examQuestions->sum('points'),
            'total_questions' => $examQuestions->count(),
        ];
    }

    /**
     * Select random questions from chapters based on configuration
     *
     * @param QuizConfiguration $configuration
     * @return Collection
     * @throws InvalidArgumentException
     */
    private function selectQuestionsFromChapters(QuizConfiguration $configuration): Collection
    {
        $selectedQuestions = collect();

        foreach ($configuration->chapter_distribution as $chapterId => $questionCount) {
            $chapter = Chapter::find($chapterId);
            
            if (!$chapter) {
                throw new InvalidArgumentException("Chapter with ID {$chapterId} not found");
            }

            $availableQuestions = $chapter->questions()->count();
            
            if ($availableQuestions < $questionCount) {
                throw new InsufficientQuestionsException(
                    "Chapter '{$chapter->name}' has only {$availableQuestions} questions, but {$questionCount} are required"
                );
            }

            $chapterQuestions = $this->selectRandomQuestions($chapter, $questionCount);
            $selectedQuestions = $selectedQuestions->merge($chapterQuestions);
        }

        return $selectedQuestions;
    }

    /**
     * Select random questions from a specific chapter
     *
     * @param Chapter $chapter
     * @param int $count
     * @return Collection
     */
    private function selectRandomQuestions(Chapter $chapter, int $count): Collection
    {
        return $chapter->questions()
            ->inRandomOrder()
            ->limit($count)
            ->get();
    }

    /**
     * Format a question for exam display with shuffled answers
     *
     * @param Question $question
     * @return array
     */
    private function formatQuestionForExam(Question $question): array
    {
        $shuffledAnswers = $this->shuffleAnswers($question->answers);

        return [
            'id' => $question->id,
            'chapter_id' => $question->chapter_id,
            'chapter_name' => $question->chapter->name,
            'question' => $question->question,
            'answers' => $shuffledAnswers,
            'type' => $question->type,
            'difficulty' => $question->difficulty,
            'points' => $question->points ?? 1,
        ];
    }

    /**
     * Shuffle the order of answers for a question
     *
     * @param array $answers
     * @return array
     */
    private function shuffleAnswers(array $answers): array
    {
        if (empty($answers)) {
            return [];
        }

        // Create a copy to avoid modifying original
        $shuffledAnswers = $answers;
        
        // Shuffle the array while preserving the structure
        shuffle($shuffledAnswers);

        return $shuffledAnswers;
    }

    /**
     * Validate if exam can be generated for a certification
     *
     * @param Certification $certification
     * @return array Array with 'valid' boolean and 'errors' array
     */
    public function validateExamGeneration(Certification $certification): array
    {
        $errors = [];
        $configuration = $certification->quizConfiguration;

        if (!$configuration) {
            $errors[] = 'No exam configuration found for this certification';
            return ['valid' => false, 'errors' => $errors];
        }

        if (!$configuration->hasChapterDistribution()) {
            $errors[] = 'No chapter distribution configured';
            return ['valid' => false, 'errors' => $errors];
        }

        foreach ($configuration->chapter_distribution as $chapterId => $questionCount) {
            $chapter = Chapter::find($chapterId);
            
            if (!$chapter) {
                $errors[] = "Chapter with ID {$chapterId} not found";
                continue;
            }

            $availableQuestions = $chapter->questions()->count();
            
            if ($availableQuestions < $questionCount) {
                $errors[] = "Chapter '{$chapter->name}' has only {$availableQuestions} questions, but {$questionCount} are required";
            }
        }

        return ['valid' => empty($errors), 'errors' => $errors];
    }
}