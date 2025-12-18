<?php

namespace App\Http\Requests\v1\Formation;

use App\Enums\CourseTypeEnum;
use App\Enums\LevelEnum;
use App\Models\FormationSession;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormationRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Modifié
            'level' => ['required', Rule::enum(LevelEnum::class)],
            'duration' => 'required|integer|min:1',
            'price' => 'required|integer|min:0',
            'category_id' => 'required|uuid|exists:categories,id',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'nullable|string',
            'objectives' => 'nullable|array',
            'objectives.*' => 'nullable|string',
            'module_ids' => 'nullable|array',
            'module_ids.*' => 'required|uuid|exists:modules,id',
            'certification_ids' => 'nullable|array',
            'certification_ids.*' => 'required|uuid|exists:certifications,id',
            // Ajout des règles pour les sessions
            'sessions' => 'nullable|array',
            'sessions.*.teacher_id' => 'nullable|uuid|exists:users,id',
            'sessions.*.course_type' => ['required', 'string', Rule::enum(CourseTypeEnum::class)],
            'sessions.*.start_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) {
                    $formationId = $this->formation_id;
                    $exists = FormationSession::where('formation_id', $formationId)
                        ->where('start_date', $value)
                        ->exists();
                    if ($exists) {
                        $fail('A session already exists for this formation on this date.');
                    }
                }
            ],
            'sessions.*.end_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $startDate = $this->input("sessions.{$index}.start_date");
                    if ($startDate && $value <= $startDate) {
                        $fail('End date must be after start date.');
                    }
                }
            ],
            'sessions.*.capacity' => 'required|integer|min:1',
            'discount_price' => 'sometimes|integer|min:0|lte:price',
        ];
    }
}
