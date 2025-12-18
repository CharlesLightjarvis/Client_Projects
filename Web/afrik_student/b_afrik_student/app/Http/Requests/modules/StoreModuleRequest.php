<?php

namespace App\Http\Requests\modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuleRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'formation_id' => 'required|uuid|exists:formations,id',
            'order' => 'nullable|integer|min:1',
            'lessons' => 'nullable|array',
            'lessons.*.title' => 'required|string|max:255',
            'lessons.*.content' => 'nullable|string',
            'lessons.*.order' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du module est requis.',
            'formation_id.required' => 'L\'ID de la formation est requis.',
            'formation_id.exists' => 'La formation spécifiée n\'existe pas.',
            'lessons.*.title.required' => 'Le titre de la leçon est requis.',
        ];
    }
}
