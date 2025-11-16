<?php

namespace App\Http\Requests\course_sessions;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseSessionRequest extends FormRequest
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
            // Course session basic info
            'formation_id' => 'required|uuid|exists:formations,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'nullable|string|in:scheduled,ongoing,completed,cancelled',
            'max_students' => 'nullable|integer|min:1',
            'location' => 'nullable|string|max:255',

            // Module instructor assignments (optional - if not provided, uses default instructors)
            'module_instructors' => 'nullable|array',
            'module_instructors.*.module_id' => 'required|uuid|exists:modules,id',
            'module_instructors.*.instructor_id' => 'required|uuid|exists:users,id',
        ];
    }
}
