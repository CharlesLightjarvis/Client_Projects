<?php

namespace App\Http\Requests;

use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuestionRequest extends FormRequest
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
            'question' => 'required|string',
            'answers' => 'required|array|min:2',
            'answers.*.id' => 'required|integer|min:1',
            'answers.*.text' => 'required|string',
            'answers.*.correct' => 'required|boolean',
            'difficulty' => ['required', Rule::in(QuestionDifficultyEnum::values())],
            'type' => ['required', Rule::in(QuestionTypeEnum::values())],
            'points' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'question.required' => 'La question est obligatoire.',
            'question.string' => 'La question doit être une chaîne de caractères.',
            
            'answers.required' => 'Les réponses sont obligatoires.',
            'answers.array' => 'Les réponses doivent être un tableau.',
            'answers.min' => 'Il faut au minimum 2 réponses.',
            
            'answers.*.id.required' => 'L\'ID de la réponse est obligatoire.',
            'answers.*.id.integer' => 'L\'ID de la réponse doit être un nombre entier.',
            'answers.*.id.min' => 'L\'ID de la réponse doit être au minimum 1.',
            
            'answers.*.text.required' => 'Le texte de la réponse est obligatoire.',
            'answers.*.text.string' => 'Le texte de la réponse doit être une chaîne de caractères.',
            
            'answers.*.correct.required' => 'L\'indication de réponse correcte est obligatoire.',
            'answers.*.correct.boolean' => 'L\'indication de réponse correcte doit être vraie ou fausse.',
            
            'difficulty.required' => 'La difficulté est obligatoire.',
            'difficulty.in' => 'La difficulté doit être : ' . implode(', ', QuestionDifficultyEnum::values()),
            
            'type.required' => 'Le type de question est obligatoire.',
            'type.in' => 'Le type de question doit être : ' . implode(', ', QuestionTypeEnum::values()),
            
            'points.required' => 'Les points sont obligatoires.',
            'points.integer' => 'Les points doivent être un nombre entier.',
            'points.min' => 'Les points doivent être au minimum 1.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $answers = $this->input('answers', []);
            
            // Check if at least one answer is marked as correct
            $hasCorrectAnswer = collect($answers)->contains('correct', true);
            
            if (!$hasCorrectAnswer) {
                $validator->errors()->add('answers', 'Au moins une réponse doit être marquée comme correcte.');
            }
            
            // Check for duplicate answer IDs
            $answerIds = collect($answers)->pluck('id')->toArray();
            if (count($answerIds) !== count(array_unique($answerIds))) {
                $validator->errors()->add('answers', 'Les IDs des réponses doivent être uniques.');
            }
        });
    }
}