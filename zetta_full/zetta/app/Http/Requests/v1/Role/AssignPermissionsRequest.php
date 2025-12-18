<?php

namespace App\Http\Requests\v1\Role;

use Illuminate\Foundation\Http\FormRequest;

class AssignPermissionsRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'permission_ids.required' => 'Permission IDs are required',
            'permission_ids.array' => 'Permission IDs must be an array',
            'permission_ids.*.exists' => 'One or more permissions do not exist'
        ];
    }
}