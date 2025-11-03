<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgressResource extends JsonResource
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
            'lesson' => new LessonResource($this->whenLoaded('lesson')),
            'completed' => $this->completed,
            'completed_at' => $this->completed_at,
            'score' => $this->score,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
