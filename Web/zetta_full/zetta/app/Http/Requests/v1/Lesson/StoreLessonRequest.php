<?php

namespace App\Http\Requests\v1\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return  true;
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
            'module_id' => 'sometimes|nullable|uuid|exists:modules,id',
            'description' => 'nullable|string|max:1000',
            'duration' => 'required|integer|min:0',
        ];
    }
}
