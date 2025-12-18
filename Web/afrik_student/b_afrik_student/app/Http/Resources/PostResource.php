<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = $request->user();

        return [
            "id" => $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "user" => UserResource::make($this->whenLoaded('user')),
            "policies" => [
                "can_update" => $user ? Gate::forUser($user)->allows('update', $this->resource) : false,
                "can_delete" => $user ? Gate::forUser($user)->allows('delete', $this->resource) : false,
            ],
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
        
    }
}
