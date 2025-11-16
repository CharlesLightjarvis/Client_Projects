<?php

namespace App\Http\Requests\formations;

use App\Enums\FormationLevel;
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
            // Formation basic info
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'learning_objectives' => 'nullable|string',
            'target_skills' => 'nullable|array',
            'target_skills.*' => 'string',
            'level' => ['required', 'string', Rule::enum(FormationLevel::class)],
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
        ];
    }
}
