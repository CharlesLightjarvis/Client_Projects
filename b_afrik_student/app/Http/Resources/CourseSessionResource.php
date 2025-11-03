<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSessionResource extends JsonResource
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
            'formation' => new FormationResource($this->whenLoaded('formation')),
            'instructor' => new UserResource($this->whenLoaded('instructor')),
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'max_students' => $this->max_students,
            'enrolled_count' => $this->whenLoaded('enrollments', fn() => $this->enrollments->count(), 0),
            'available_spots' => $this->availableSpots(),
            'is_full' => $this->isFull(),
            'location' => $this->location,
            'enrollments' => EnrollmentResource::collection($this->whenLoaded('enrollments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
