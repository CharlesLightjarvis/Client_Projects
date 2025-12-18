<?php

namespace App\Http\Requests\v1\Session;

use App\Enums\CourseTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormationSessionRequest extends FormRequest
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
            'formation_id' => 'sometimes|required|uuid|exists:formations,id',
            'teacher_id' => 'sometimes|nullable|uuid|exists:users,id',
            'course_type' => ['sometimes', 'required', 'string', Rule::enum(CourseTypeEnum::class)],
            'start_date' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:today',
                Rule::unique('formation_sessions')
                    ->where(fn($query) => $query->where('formation_id', $this->formation_id)
                        ->where('start_date', $this->start_date))
                    ->ignore($this->route('session')) // Exclut l'ID actuel
            ],
            'end_date' => 'sometimes|required|date|after:start_date',
            'capacity' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|nullable|string|in:active,cancelled,completed',
        ];
    }
}
