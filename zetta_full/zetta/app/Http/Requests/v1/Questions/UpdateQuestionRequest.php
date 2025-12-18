<?php

namespace App\Http\Requests\v1\Questions;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question' => 'sometimes|required|string',
            'answers' => 'sometimes|required|array',
            'answers.*.id' => 'required',
            'answers.*.text' => 'required|string',
            'answers.*.correct' => 'required|boolean',
            'difficulty' => 'sometimes|required|string|in:easy,medium,hard',
            'points' => 'sometimes|required|integer|min:1',
            'type' => 'sometimes|required|string|in:normal,certification',
            'questionable_type' => 'sometimes|required|in:lesson,module',
            'questionable_id' => 'sometimes|required|uuid'
        ];
    }
}
