<?php

namespace App\Http\Requests\v1\Attendance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceRequest extends FormRequest
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
            'session_id' => 'required|uuid|exists:formation_sessions,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => [
                'required',
                'uuid',
                'exists:users,id',
                Rule::exists('session_student', 'student_id')  // Correction ici
                    ->where(function ($query) {
                        $query->where('session_id', $this->input('session_id'));
                    })
            ],
            'attendances.*.status' => 'required|in:present,absent',
            'attendances.*.notes' => 'nullable|string|max:1000',
            // 'date' => 'required|date|before_or_equal:today',
            'date' => [
                'required',
                'date',
                'before_or_equal:' . now()->addDay()->format('Y-m-d'), // Ajoute un jour pour tenir compte du décalage
            ],
        ];
    }
}
