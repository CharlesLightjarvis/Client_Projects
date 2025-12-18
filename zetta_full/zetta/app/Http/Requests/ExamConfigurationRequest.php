<?php

namespace App\Http\Requests;

use App\Models\Chapter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ExamConfigurationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'total_questions' => 'required|integer|min:1',
            'chapter_distribution' => 'required|array|min:1',
            'chapter_distribution.*' => 'required|integer|min:1',
            'time_limit' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validateChapterQuestionCounts($validator);
            $this->validateTotalQuestions($validator);
        });
    }

    /**
     * Validate that question counts don't exceed available questions per chapter
     */
    protected function validateChapterQuestionCounts(Validator $validator): void
    {
        $chapterDistribution = $this->input('chapter_distribution', []);
        
        foreach ($chapterDistribution as $chapterId => $questionCount) {
            $chapter = Chapter::find($chapterId);
            
            if (!$chapter) {
                $validator->errors()->add(
                    "chapter_distribution.{$chapterId}",
                    "Chapter not found."
                );
                continue;
            }

            $availableQuestions = $chapter->questions()->count();
            
            if ($questionCount > $availableQuestions) {
                $validator->errors()->add(
                    "chapter_distribution.{$chapterId}",
                    "Cannot request {$questionCount} questions from chapter '{$chapter->name}'. Only {$availableQuestions} questions available."
                );
            }
        }
    }

    /**
     * Validate that the sum of chapter distribution doesn't exceed total_questions
     */
    protected function validateTotalQuestions(Validator $validator): void
    {
        $totalQuestions = $this->input('total_questions');
        $chapterDistribution = $this->input('chapter_distribution', []);
        
        if (!$totalQuestions || !is_array($chapterDistribution)) {
            return;
        }

        $sumChapterQuestions = array_sum($chapterDistribution);
        
        if ($sumChapterQuestions > $totalQuestions) {
            $validator->errors()->add(
                'chapter_distribution',
                "The sum of questions per chapter ({$sumChapterQuestions}) cannot exceed the total questions limit ({$totalQuestions})."
            );
        }

        if ($sumChapterQuestions < $totalQuestions) {
            $remaining = $totalQuestions - $sumChapterQuestions;
            $validator->errors()->add(
                'chapter_distribution',
                "The sum of questions per chapter ({$sumChapterQuestions}) should equal the total questions ({$totalQuestions}). You have {$remaining} questions remaining to allocate."
            );
        }
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'total_questions.required' => 'Total questions is required.',
            'total_questions.integer' => 'Total questions must be an integer.',
            'total_questions.min' => 'Total questions must be at least 1.',
            'chapter_distribution.required' => 'Chapter distribution is required.',
            'chapter_distribution.array' => 'Chapter distribution must be an array.',
            'chapter_distribution.min' => 'At least one chapter must be configured.',
            'chapter_distribution.*.required' => 'Question count is required for each chapter.',
            'chapter_distribution.*.integer' => 'Question count must be an integer.',
            'chapter_distribution.*.min' => 'Question count must be at least 1.',
            'time_limit.required' => 'Time limit is required.',
            'time_limit.integer' => 'Time limit must be an integer.',
            'time_limit.min' => 'Time limit must be at least 1 minute.',
            'passing_score.required' => 'Passing score is required.',
            'passing_score.integer' => 'Passing score must be an integer.',
            'passing_score.min' => 'Passing score must be at least 1%.',
            'passing_score.max' => 'Passing score cannot exceed 100%.',
        ];
    }
}