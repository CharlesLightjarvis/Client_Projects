<?php

namespace App\Http\Requests\users;

use App\Enums\PermissionEnum;
use App\Enums\UserRoleEnum;
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
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'=> 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $this->user->id,
            'role' => ['sometimes','required','string', Rule::enum(UserRoleEnum::class)],
            'permissions' => ['sometimes','nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::enum(PermissionEnum::class), 
            ],
        ];
    }
}
