<?php

namespace App\Http\Requests\v1\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'fullName' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($this->route('user')), // Ignorer l'email actuel
            ],
            'role' => 'sometimes|string|exists:roles,name',
            'phone' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
        ];
    }
}
