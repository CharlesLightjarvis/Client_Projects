<?php

namespace App\Http\Resources\v1;

use App\Models\Certification;
use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\v1\ResourceResource;

/**
 * @property-read Formation $resource
 * @method HasMany sessions()
 * @method HasMany modules()
 * @method HasMany certifications()
 */
class FormationResource extends JsonResource
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
            "name" => $this->resource->name,
            "slug" => $this->resource->slug,
            "description" => $this->resource->description,
            "image" => $this->resource->image ? config('app.url') . Storage::url($this->resource->image) : null,
            "level" => $this->resource->level,
            "duration" => $this->resource->duration,
            "price" => $this->resource->price,
            "discount_price" => $this->resource->discount_price,
            "resources" => $this->whenLoaded('resources', fn() => ResourceResource::collection($this->resource->resources)),
            "category" => new CategoryResource($this->resource->category),
            "link" => $this->resource->link,
            "prerequisites" => $this->resource->prerequisites,
            "objectives" => $this->resource->objectives,
            "certifications" => $this->whenLoaded('certifications', fn(): array => $this->getCertificationsData()),
            "modules" => $this->whenLoaded('modules', fn(): array => $this->getModulesData()),
            "sessions" => $this->whenLoaded('sessions', fn(): array => $this->formatSessions()),
            "created_at" => $this->resource->created_at->format('Y-m-d H:i'),
            "updated_at" => $this->resource->updated_at->format('Y-m-d H:i'),
        ];
    }

    /**
     * Get formatted certifications data
     * 
     * @return array<int, array<string, mixed>>
     */
    private function getCertificationsData(): array
    {
        return $this->resource->getRelation('certifications')->map(function (Model $certification, int $key): array {
            /** @var Certification $certification */
            return [
                'id' => $certification->id,
                'name' => $certification->name,
                "image" => $certification->image ? config('app.url') . Storage::url($certification->image) : null,
            ];
        })->toArray();
    }

    /**
     * Get formatted modules data
     * 
     * @return array<int, array<string, mixed>>
     */
    private function getModulesData(): array
    {
        return $this->resource->getRelation('modules')->map(function (Model $module, int $key): array {
            /** @var Module $module */
            return [
                'id' => $module->id,
                'name' => $module->name,
                'description' => $module->description,
                'lessons' => $module->lessons->map(function (Model $lesson, int $key): array {
                    /** @var Lesson $lesson */
                    return [
                        'id' => $lesson->id,
                        'name' => $lesson->name,
                        'description' => $lesson->description,
                        'resources' => isset($lesson->resources) ? ResourceResource::collection($lesson->resources)->toArray(request()) : []
                    ];
                })
            ];
        })->toArray();
    }

    /**
     * Format sessions collection
     * 
     * @return array<int, array<string, mixed>>
     */
    private function formatSessions(): array
    {
        return $this->resource->getRelation('sessions')
            ->sortByDesc(function (FormationSession $session) {
                return $session->start_date->diffInSeconds(now());
            })
            ->values() // Ceci va réindexer le tableau séquentiellement
            ->map(function (FormationSession $session) {
                return [
                    'id' => $session->id,
                    'course_type' => $session->course_type,
                    'start_date' => $session->start_date->format('Y-m-d'),
                    'end_date' => $session->end_date->format('Y-m-d'),
                    'capacity' => $session->capacity,
                    'enrolled_students' => $session->enrolled_students,
                    'teacher' => $session->teacher ? new UserResource($session->teacher) : null
                ];
            })->toArray();
    }
}
