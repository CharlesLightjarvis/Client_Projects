<?php

namespace App\Http\Requests\v1\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'sometimes|required|uuid|exists:users,id',
            'session_id' => 'sometimes|required|uuid|exists:formation_sessions,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'payment_method' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'payment_date' => 'sometimes|required|date'
        ];
    }
}
