<?php

namespace App\Http\Resources\v1;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read User $resource
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Récupérer le rôle une seule fois avec ->value() pour éviter pluck()->first()
        $roleName = $this->resource->roles()->value('name');

        $data = [
            'id' => $this->resource->id,
            'fullName' => $this->resource->fullName,
            'email' => $this->resource->email,
            'status' => $this->resource->status,
            'imageUrl' => $this->resource->imageUrl,
            'phone' => $this->resource->phone,
            'role' => $roleName,
            'created_at' => $this->resource->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->resource->updated_at?->format('Y-m-d H:i'),
        ];

        if ($roleName === RoleEnum::TEACHER->value) {
            $data['bio'] = $this->resource->bio;
            $data['title'] = $this->resource->title;
        }

        return $data;
    }
}
