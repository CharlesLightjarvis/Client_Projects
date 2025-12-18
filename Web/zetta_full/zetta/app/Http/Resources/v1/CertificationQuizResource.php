<?php

namespace App\Http\Resources\v1;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read Certification $resource
 */
class CertificationQuizResource extends JsonResource
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
            'certification_id' => $this->resource['certification']->id,
            'certification_name' => $this->resource['certification']->name,
            'question_ids' => $this['question_ids'], // <-- AJOUT ICI

            'time_limit' => $this->resource['time_limit'],
            'questions' => $this->resource['questions']->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'answers' => $question->answers, // Changé 'options' en 'answers'
                    'difficulty' => $question->difficulty,
                ];
            }),
            'total_questions' => $this->resource['questions']->count(),
            'passing_score' => $this->resource['certification']->quizConfiguration->passing_score,
        ];
    }
}
