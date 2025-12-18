<?php

namespace App\Http\Requests\v1\Module;

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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            // 'formation_ids' => 'nullable|array',
            // 'formation_ids.*' => 'required|uuid|exists:formations,id',
            'existing_lesson_ids' => 'nullable|array',
            'existing_lesson_ids.*' => 'required|string|exists:lessons,id',
            'new_lessons' => 'nullable|array',
            'new_lessons.*.name' => 'required|string|max:255',
            'new_lessons.*.description' => 'nullable|string|max:1000',
            'new_lessons.*.duration' => 'required|integer|min:0',
        ];
    }
}
