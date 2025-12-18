<?php

namespace App\Http\Requests\v1\Formation;

use App\Enums\CourseTypeEnum;
use App\Enums\LevelEnum;
use App\Models\FormationSession;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormationRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Modifié
            'level' => ['sometimes', Rule::enum(LevelEnum::class)],
            'duration' => 'sometimes|integer|min:1',
            'price' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|required|uuid|exists:categories,id',
            'prerequisites' => 'sometimes|nullable|array',
            'prerequisites.*' => 'sometimes|nullable|string',
            'objectives' => 'sometimes|nullable|array',
            'objectives.*' => 'sometimes|nullable|string',
            'module_ids' => 'sometimes|nullable|array',
            'module_ids.*' => 'uuid|exists:modules,id',
            'certification_ids' => 'sometimes|nullable|array',
            'certification_ids.*' => 'uuid|exists:certifications,id',
            // Ajout des règles pour les sessions
            'sessions' => 'sometimes|nullable|array',
            'sessions.*.teacher_id' => 'nullable|uuid|exists:users,id',
            'sessions.*.course_type' => ['required', 'string', Rule::enum(CourseTypeEnum::class)],
            'sessions.*.start_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) {
                    $formationId = $this->route('formation');
                    $sessionIndex = explode('.', $attribute)[1];
                    $sessionId = $this->input("sessions.{$sessionIndex}.id"); // Récupère l'ID de la session si elle existe

                    $query = FormationSession::where('formation_id', $formationId)
                        ->where('start_date', $value);

                    // Si nous modifions une session existante, excluons-la de la vérification
                    if ($sessionId) {
                        $query->where('id', '!=', $sessionId);
                    }

                    if ($query->exists()) {
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
