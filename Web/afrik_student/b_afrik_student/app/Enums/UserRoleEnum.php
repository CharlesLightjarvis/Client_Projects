<?php

namespace App\Enums;

enum UserRoleEnum : string
{
    case ADMIN = "admin";
    case STUDENT = "student";
    case INSTRUCTOR = "instructor";

    // send readable role to the frontend
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrateur',
            self::STUDENT => 'Étudiant',
            self::INSTRUCTOR => 'Instructeur',
        };
    }

    // get role from string value and cast as UserRoleEnum
    public static function fromString(?string $value): ?self
    {
        return $value ? self::tryFrom($value) : null;
    }
}

