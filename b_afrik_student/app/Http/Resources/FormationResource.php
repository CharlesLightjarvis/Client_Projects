<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormationResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'learning_objectives' => $this->learning_objectives,
            'target_skills' => $this->target_skills,
            'level' => [
                'value' => $this->level?->value,
                'label' => $this->level?->label()
            ],
            'duration' => $this->duration,
            'image_url' => $this->image_url
            ? asset('storage/' . $this->image_url)
            : null,
            'price' => $this->price,
            'modules' => ModuleResource::collection($this->whenLoaded('modules')),
            // 'course_sessions' => CourseSessionResource::collection($this->whenLoaded('courseSessions')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
