<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'amount' => $this->amount,
            'remaining_amount' => $this->remaining_amount,
            'payment_method' => $this->payment_method,
            'session' => $this->whenLoaded('session', function () {
                $session = $this->session;
                return [
                    'id' => $session->id,
                    'formation_id' => $session->formation_id,
                    'teacher_id' => $session->teacher_id,
                    'course_type' => $session->course_type,
                    'start_date' => $session->start_date->format('Y-m-d'),
                    'end_date' => $session->end_date->format('Y-m-d'),
                    'capacity' => $session->capacity,
                    'status' => $session->status,
                    'enrolled_students' => $session->enrolled_students,
                    'price' => $session->price,
                    'name' => $session->name ?? null,
                    'formation' => $session->formation ? [
                        'id' => $session->formation->id,
                        'name' => $session->formation->name,
                        'slug' => $session->formation->slug,
                        'description' => $session->formation->description,
                        'image' => $session->formation->image,
                        'level' => $session->formation->level,
                        'duration' => $session->formation->duration,
                        'price' => $session->formation->price,
                    ] : null,
                ];
            }),
            'status' => $this->status,
            'notes' => $this->notes,
            'payment_date' => $this->payment_date->format('Y-m-d'),
            'student' => new UserResource($this->whenLoaded('student')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s')
        ];
    }
}
