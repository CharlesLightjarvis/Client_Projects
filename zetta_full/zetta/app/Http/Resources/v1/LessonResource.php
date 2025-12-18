<?php

namespace App\Http\Resources\v1;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read Lesson $resource
 */
class LessonResource extends JsonResource
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
            "duration" => $this->resource->duration,
            "resources" => $this->whenLoaded('resources', fn() => ResourceResource::collection($this->resource->resources)),
            "module" => $this->whenLoaded('module', fn(): array => $this->getModuleData()),
            "created_at" => $this->resource->created_at->format('Y-m-d H:i'),
            "updated_at" => $this->resource->updated_at->format('Y-m-d H:i'),
        ];
    }

    /**
     * Get formatted module data
     */

    public function getModuleData(): array
    {
        /** @var Module $module */
        $module = $this->resource->module;

        return [
            'id' => $module->id,
            'name' => $module->name
        ];
    }
}
