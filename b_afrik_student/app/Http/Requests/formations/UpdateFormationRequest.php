<?php

namespace App\Http\Requests\formations;

use App\Enums\FormationLevel;
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
            // Formation basic info (all optional for partial updates)
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'learning_objectives' => 'sometimes|nullable|string',
            'target_skills' => 'sometimes|nullable|array',
            'target_skills.*' => 'string',
            'level' => ['sometimes', 'required', 'string', Rule::enum(FormationLevel::class)],
            'duration' => 'sometimes|required|integer|min:1',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10 MB = 10240 KB
            'price' => 'sometimes|nullable|numeric|min:0',
        ];
    }
}
