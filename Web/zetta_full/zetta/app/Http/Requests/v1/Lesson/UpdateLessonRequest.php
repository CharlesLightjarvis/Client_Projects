<?php

namespace App\Http\Requests\v1\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
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
            'module_id' => 'sometimes|uuid|exists:modules,id',
            'description' => 'sometimes|nullable|string|max:1000',
            'duration' => 'sometimes|integer|min:0',
        ];
    }
}
