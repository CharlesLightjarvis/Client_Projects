<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizConfigurationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isCertification = str_contains($this->configurable_type, 'Certification');
        
        $data = [
            'id' => $this->id,
            'configurable_type' => $this->configurable_type,
            'configurable_id' => $this->configurable_id,
            'total_questions' => $this->total_questions,
            'difficulty_distribution' => [
                'easy' => $this->difficulty_distribution['easy'],
                'medium' => $this->difficulty_distribution['medium'],
                'hard' => $this->difficulty_distribution['hard']
            ],
            'passing_score' => $this->passing_score,
            'time_limit' => $this->time_limit,
            'configurable' => $this->when($this->configurable, function () use ($isCertification) {
                return $isCertification
                    ? new CertificationResource($this->configurable)
                    : new LessonResource($this->configurable);
            }),
        ];
        
        // N'inclure module_distribution que pour les certifications
        if ($isCertification) {
            $data['module_distribution'] = $this->module_distribution;
        }
        
        return $data;
    }
}
