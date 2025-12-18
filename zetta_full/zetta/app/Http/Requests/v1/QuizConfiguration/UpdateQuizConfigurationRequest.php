<?php

namespace App\Http\Requests\v1\QuizConfiguration;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizConfigurationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'total_questions' => 'sometimes|required|integer|min:1',
            'difficulty_distribution' => 'sometimes|required|array',
            'difficulty_distribution.easy' => 'required_with:difficulty_distribution|integer|min:0|max:100',
            'difficulty_distribution.medium' => 'required_with:difficulty_distribution|integer|min:0|max:100',
            'difficulty_distribution.hard' => 'required_with:difficulty_distribution|integer|min:0|max:100',
            'module_distribution' => 'sometimes|nullable|array',
            'module_distribution.*' => 'integer|min:0|max:100',
            'passing_score' => 'sometimes|required|integer|min:0|max:100',
            'time_limit' => 'sometimes|required|integer|min:1',
        ];
    }
}
