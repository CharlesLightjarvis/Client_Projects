<?php

namespace App\Http\Resources;

use App\Enums\UserRoleEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

          // Récupère le nom du rôle Spatie (ex: "student", "admin", etc.)
          $role = $this->getRoleNames()->first();

          // Convertit cette chaîne en Enum (si elle correspond à une case de ton Enum)
          $roleEnum = UserRoleEnum::fromString($role);

        return [
            "id"=> $this->id,
            "first_name"=> $this->first_name,
            "last_name"=> $this->last_name,
            "email"=> $this->email,
            "role" => $roleEnum ? [
                'value' => $roleEnum->value,
                'label' => $roleEnum->label(),
            ]: null,
            "permissions" => $this->getAllPermissions()->pluck('name'),
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
        ];
    }
}
