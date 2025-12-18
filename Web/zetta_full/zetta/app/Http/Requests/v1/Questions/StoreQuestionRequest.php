<?php

namespace App\Http\Requests\v1\Questions;

use App\Enums\QuestionDifficultyEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'questionable_type' => 'required|in:lesson,module',
            'questionable_id' => 'required|uuid',
            'question' => 'required|string',
            'answers' => 'required|array',
            'answers.*.id' => 'required',
            'answers.*.text' => 'required|string',
            'answers.*.correct' => 'required|boolean',
            'difficulty' => 'required|string|in:easy,medium,hard',
            'points' => 'required|integer|min:1',
            'type' => 'required|string|in:normal,certification' // Ajouter cette ligne

        ];
    }
}
