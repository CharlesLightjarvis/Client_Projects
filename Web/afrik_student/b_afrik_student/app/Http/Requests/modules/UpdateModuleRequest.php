<?php

namespace App\Http\Requests\modules;

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
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'formation_id' => 'sometimes|required|uuid|exists:formations,id',
            'order' => 'sometimes|required|integer|min:1',

            // Lessons array (optional, for updating lessons with the module)
            'lessons' => 'sometimes|nullable|array',
            'lessons.*.id' => 'sometimes|uuid|exists:lessons,id', // If ID provided, update existing lesson
            'lessons.*.title' => 'required|string|max:255',
            'lessons.*.content' => 'nullable|string',
            'lessons.*.order' => 'required|integer|min:1',

            // Lessons to delete
            'delete_lessons' => 'sometimes|nullable|array',
            'delete_lessons.*' => 'uuid|exists:lessons,id',
        ];
    }
}
