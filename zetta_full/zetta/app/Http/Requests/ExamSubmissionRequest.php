<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamSubmissionRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'answers' => 'sometimes|array',
            'answers.*' => 'array',
            'answers.*.*' => 'integer'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'answers.array' => 'Answers must be provided as an array',
            'answers.*.array' => 'Each question answer must be an array of answer IDs',
            'answers.*.*.integer' => 'Answer IDs must be integers'
        ];
    }
}