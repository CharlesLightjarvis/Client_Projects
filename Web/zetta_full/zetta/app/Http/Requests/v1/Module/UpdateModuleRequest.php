<?php

namespace App\Http\Requests\v1\Module;

use Illuminate\Foundation\Http\FormRequest;

class UpdateModuleRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'existing_lesson_ids' => 'sometimes|nullable|array',
            'existing_lesson_ids.*' => 'required|string|exists:lessons,id',
            'new_lessons' => 'sometimes|nullable|array',
            'new_lessons.*.name' => 'required|string|max:255',
            'new_lessons.*.description' => 'nullable|string|max:1000',
            'new_lessons.*.duration' => 'required|integer|min:0',
        ];
    }
}
