<?php

namespace App\Http\Requests\enrollments;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
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
            'student_id' => [
                'required',
                'uuid',
                'exists:users,id',
            ],
            'course_session_id' => ['required', 'uuid', 'exists:course_sessions,id'],
            'enrollment_date' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::enum(EnrollmentStatus::class)],
            'payment_status' => ['sometimes', Rule::enum(PaymentStatus::class)],
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'student_id.required' => 'The student field is required.',
            'student_id.exists' => 'The selected student does not exist.',
            'course_session_id.required' => 'The course session field is required.',
            'course_session_id.exists' => 'The selected course session does not exist.',
            'payment_amount.min' => 'The payment amount must be at least 0.',
        ];
    }
}
