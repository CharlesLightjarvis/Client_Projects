<?php

namespace App\Http\Requests\course_sessions;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseSessionRequest extends FormRequest
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
            // Course session basic info (all optional for partial updates)
            'formation_id' => 'sometimes|required|uuid|exists:formations,id',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|nullable|string|in:scheduled,ongoing,completed,cancelled',
            'max_students' => 'sometimes|nullable|integer|min:1',
            'location' => 'sometimes|nullable|string|max:255',

            // Module instructor assignments (optional - if provided, will replace all existing assignments)
            'module_instructors' => 'sometimes|nullable|array',
            'module_instructors.*.module_id' => 'required|uuid|exists:modules,id',
            'module_instructors.*.instructor_id' => 'required|uuid|exists:users,id',
        ];
    }
}
