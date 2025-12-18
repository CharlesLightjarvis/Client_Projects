<?php

namespace App\Http\Resources\v1;

use App\Models\Category;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $fullName
 * @property string $email
 * @property string|null $phone
 * @property string|null $message
 * @property string $status
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Formation|null $formation
 * @property-read \App\Models\Category|null $category
 */
class FormationInterestResource extends JsonResource
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
            "fullName" => $this->fullName,
            "email" => $this->email,
            "phone" => $this->phone,
            "message" => $this->message,
            "status" => $this->status,
            "formation" => $this->whenLoaded('formation', function () {
                /** @var Formation|null $formation */
                $formation = $this->formation;

                if ($formation === null) {
                    return null;
                }

                $categoryData = null;
                /** @var Category|null $category */
                $category = $formation->category;

                if ($category !== null) {
                    $categoryData = [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                }

                return [
                    'id' => $formation->id,
                    'slug' => $formation->slug,
                    'image' => $formation->image,
                    'description' => $formation->description,
                    'duration' => $formation->duration,
                    'level' => $formation->level,
                    'price' => $formation->price,
                    'name' => $formation->name,
                    'category' => $categoryData,
                ];
            }),
            "created_at" => $this->created_at->format('Y-m-d H:i'),
            "updated_at" => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
