<?php

namespace App\Enums;

enum UserStatus :string
{
    case ACTIVE = "active";
    case INACTIVE = "inactive";
    case PENDING = "pending";
    case DELETED = "deleted";
    case SUSPENDED = "suspended";

      // send readable role to the frontend
      public function label(): string
      {
          return match ($this) {
              self::ACTIVE => 'Actif',
              self::INACTIVE => 'Inactif',
              self::PENDING => 'En attente',
              self::DELETED => 'Supprimé',
              self::SUSPENDED => 'Suspendu',
          };
      }

        // get role from string value and cast as UserRoleEnum
    public static function fromString(?string $value): ?self
    {
        return $value ? self::tryFrom($value) : null;
    }
}
