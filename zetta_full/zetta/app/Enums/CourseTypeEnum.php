<?php

namespace App\Enums;

enum CourseTypeEnum: string
{
    case DAY = "day course";
    case NIGHT = "night course";

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
