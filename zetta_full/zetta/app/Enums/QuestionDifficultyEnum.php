<?php

namespace App\Enums;

enum QuestionDifficultyEnum: string
{
    case EASY = 'easy';
    case MEDIUM = 'medium';
    case HARD = 'hard';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
