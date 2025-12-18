<?php

namespace App\Http\Requests\formations;

use App\Enums\FormationLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

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
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        Log::info('=== STORE FORMATION REQUEST - RAW DATA ===');
        Log::info('All input keys:', array_keys($this->all()));
        Log::info('Has file image_url:', [$this->hasFile('image_url')]);

        if ($this->hasFile('image_url')) {
            $file = $this->file('image_url');
            Log::info('✅ image_url FILE RECEIVED:', [
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
                'is_valid' => $file->isValid(),
            ]);
        } else {
            Log::warning('❌ NO FILE for image_url');
            if ($this->has('image_url')) {
                Log::warning('But image_url exists in input:', [
                    'type' => gettype($this->input('image_url')),
                    'value' => $this->input('image_url'),
                ]);
            }
        }

        Log::info('All request data:', $this->except(['image_url']));
        Log::info('=== END RAW DATA ===');
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
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10 MB = 10240 KB
            'price' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image_url.image' => 'Le fichier doit être une image.',
            'image_url.mimes' => 'L\'image doit être au format : jpeg, png, jpg, gif ou webp.',
            'image_url.max' => 'L\'image ne doit pas dépasser 10 MB.',
        ];
    }
}