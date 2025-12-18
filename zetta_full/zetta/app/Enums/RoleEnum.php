<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super-admin';
    case ADMIN = 'admin';
    case GUEST = 'guest';
    case STUDENT = 'student';
    case TEACHER = 'teacher';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
