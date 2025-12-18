<?php

namespace App\Http\Requests\course_sessions;

use App\Enums\SessionStatus;
use App\Enums\UserRoleEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSessionRequest extends FormRequest
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
            'formation_id' => ['sometimes', 'uuid', 'exists:formations,id'],
            'instructor_id' => [
                'sometimes',
                'uuid',
                'exists:users,id',
            ],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'status' => ['sometimes', Rule::enum(SessionStatus::class)],
            'max_students' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'formation_id.exists' => 'The selected formation does not exist.',
            'instructor_id.exists' => 'The selected instructor does not exist or is not an instructor.',
            'end_date.after' => 'The end date must be after the start date.',
            'max_students.min' => 'The maximum number of students must be at least 1.',
            'max_students.max' => 'The maximum number of students cannot exceed 100.',
        ];
    }

     /**
     * Additional validation logic after default rules.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->instructor_id) {
                $instructor = User::find($this->instructor_id);

                // Vérifie que l'utilisateur existe et qu'il a bien le rôle "Instructor"
                if (! $instructor || ! $instructor->hasRole(UserRoleEnum::INSTRUCTOR->value)) {
                    $validator->errors()->add(
                        'instructor_id',
                        'The selected instructor must have the Instructor role.'
                    );
                }
            }
        });
    }
}
