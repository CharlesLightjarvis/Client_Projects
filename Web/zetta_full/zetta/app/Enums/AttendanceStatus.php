<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case PRESENT = 'present';
    case ABSENT = 'absent';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
