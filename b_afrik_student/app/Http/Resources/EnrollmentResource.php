<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student' => new UserResource($this->whenLoaded('student')),
            'enrollment_date' => $this->enrollment_date,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'payment_status' => [
                'value' => $this->payment_status->value,
                'label' => $this->payment_status->label(),
            ],
            'payment_amount' => $this->payment_amount,
            'is_paid' => $this->isPaid(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
