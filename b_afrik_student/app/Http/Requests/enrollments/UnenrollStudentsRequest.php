<?php

namespace App\Http\Requests\enrollments;

use Illuminate\Foundation\Http\FormRequest;

class UnenrollStudentsRequest extends FormRequest
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
            // Support both single and bulk unenrollment
            'enrollment_id' => [
                'required_without:enrollment_ids',
                'uuid',
                'exists:enrollments,id',
            ],
            'enrollment_ids' => [
                'required_without:enrollment_id',
                'array',
                'min:1',
            ],
            'enrollment_ids.*' => [
                'uuid',
                'exists:enrollments,id',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'enrollment_id.required_without' => 'Either enrollment_id or enrollment_ids is required.',
            'enrollment_id.exists' => 'The selected enrollment does not exist.',
            'enrollment_ids.required_without' => 'Either enrollment_id or enrollment_ids is required.',
            'enrollment_ids.*.exists' => 'One or more selected enrollments do not exist.',
        ];
    }
}
