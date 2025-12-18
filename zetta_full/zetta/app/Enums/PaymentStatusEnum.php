<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case PARTIAL = 'partial';
    case COMPLETED = 'completed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
