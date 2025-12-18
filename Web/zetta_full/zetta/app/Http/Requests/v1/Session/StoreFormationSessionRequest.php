<?php

namespace App\Http\Requests\v1\Session;

use App\Enums\CourseTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormationSessionRequest extends FormRequest
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
            'formation_id' => 'required|uuid|exists:formations,id',
            'teacher_id' => 'nullable|uuid|exists:users,id',
            'course_type' => ['required', 'string', Rule::enum(CourseTypeEnum::class)],
            'start_date' => [
                'required',
                'date',
                'after_or_equal:today',
                Rule::unique('formation_sessions')
                    ->where(function ($query) {
                        return $query->where('formation_id', $this->formation_id)
                            ->where('start_date', $this->start_date);
                    })
            ],
            'end_date' => 'required|date|after:start_date',
            'capacity' => 'required|integer|min:1',
            'status' => 'nullable|string|in:active,cancelled,completed',
        ];
    }
}
