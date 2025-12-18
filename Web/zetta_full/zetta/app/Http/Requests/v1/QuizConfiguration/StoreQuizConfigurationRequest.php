<?php

namespace App\Http\Requests\v1\QuizConfiguration;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizConfigurationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'configurable_type' => 'required|string|in:lesson,certification',
            'configurable_id' => 'required|uuid',
            'total_questions' => 'required|integer|min:1',
            'difficulty_distribution' => 'required|array',
            'difficulty_distribution.easy' => 'required|integer|min:0|max:100',
            'difficulty_distribution.medium' => 'required|integer|min:0|max:100',
            'difficulty_distribution.hard' => 'required|integer|min:0|max:100',
            'module_distribution' => 'nullable|array',
            'module_distribution.*' => 'integer|min:0|max:100',
            'question_type' => 'required|string|in:normal,certification',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit' => 'required|integer|min:1',
        ];
    }
}
