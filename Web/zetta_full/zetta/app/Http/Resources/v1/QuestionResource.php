<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
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
            'question' => $this->question,
            'answers' => $this->answers,
            'difficulty' => $this->difficulty,
            'points' => $this->points,
            'type' => $this->type,
            'questionable_type' => $this->questionable_type,
            'questionable_id' => $this->questionable_id,
            'questionable' => $this->when($this->questionable, function () {
                return $this->questionable_type === 'App\Models\Lesson'
                    ? new LessonResource($this->questionable)
                    : new CertificationResource($this->questionable);
            }),
        ];
    }
}
