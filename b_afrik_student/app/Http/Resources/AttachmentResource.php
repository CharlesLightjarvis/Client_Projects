<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Check if URL is external (starts with http/https) or local file path
        $isExternalUrl = filter_var($this->url, FILTER_VALIDATE_URL) !== false;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $isExternalUrl ? $this->url : ($this->url ? asset('storage/' . $this->url) : null),
            'type' => $this->type,
            'is_external' => $isExternalUrl,
            'created_at' => $this->created_at,
        ];
    }
}
