<?php

namespace App\Http\Resources\v1;

use App\Models\Formation;
use App\Models\FormationSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read FormationSession $resource
 */
class FormationSessionResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->resource->id,
            "course_type" => $this->resource->course_type,
            "start_date" => $this->resource->start_date->format('Y-m-d'),
            "end_date" => $this->resource->end_date->format('Y-m-d'),
            "capacity" => $this->resource->capacity,
            "status" => $this->resource->status,
            "enrolled_students" => $this->resource->enrolled_students,
            "formation" => $this->whenLoaded('formation', fn(): array => $this->getFormationData()),
            "teacher" => $this->whenLoaded('teacher', fn(): UserResource => new UserResource($this->resource->teacher)),
            "students" => $this->whenLoaded('students', fn(): array => UserResource::collection($this->resource->students)->toArray($request)),
            "created_at" => $this->resource->created_at->format('Y-m-d H:i'),
            "updated_at" => $this->resource->updated_at->format('Y-m-d H:i'),
        ];
    }

    /**
     * Get formatted formation data
     */
    private function getFormationData(): array
    {
        /** @var Formation $formation */
        $formation = $this->resource->formation;

        return [
            'id' => $formation->id,
            'name' => $formation->name
        ];
    }
}
