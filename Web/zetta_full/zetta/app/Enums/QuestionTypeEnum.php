<?php

namespace App\Enums;

enum QuestionTypeEnum: string
{
    case NORMAL = 'normal';
    case CERTIFICATION = 'certification';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
