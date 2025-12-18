<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $image
 * @property string|null $provider
 * @property string|null $validity_period
 * @property string|null $level
 * @property string|null $benefits
 * @property string|null $link
 * @property string|null $prerequisites
 * @property string|null $skills
 * @property string|null $best_for
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Formation|null $formations
 */
class CertificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "slug" => $this->slug,
            "description" => $this->description,
            "image" => $this->image ? config('app.url') . Storage::url($this->image) : null,
            "provider" => $this->provider,
            "validity_period" => $this->validity_period,
            "level" => $this->level,
            "benefits" => $this->benefits,
            "link" => $this->link,
            "formations" => $this->whenLoaded('formations', function () {
                return $this->formations->map(function ($formation) {
                    return [
                        'id' => $formation->id,
                        'name' => $formation->name,
                        'category' => $formation->category?->name,
                    ];
                });
            }),
            "chapters" => $this->whenLoaded('chapters', function () {
                return $this->chapters->map(function ($chapter) {
                    return [
                        'id' => $chapter->id,
                        'name' => $chapter->name,
                        'description' => $chapter->description,
                        'order' => $chapter->order,
                        'questions_count' => $chapter->questions_count
                    ];
                });
            }),
            "prerequisites" => $this->prerequisites,
            "skills" => $this->skills,
            "best_for" => $this->best_for,
            "created_at" => $this->created_at->format('Y-m-d H:i'),
            "updated_at" => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
