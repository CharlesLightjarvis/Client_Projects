<?php

namespace App\Enums;

enum SessionStatus: string
{
    case SCHEDULED = 'scheduled';
    case ONGOING = 'ongoing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::SCHEDULED => 'Planifié',
            self::ONGOING => 'En cours',
            self::COMPLETED => 'Terminé',
            self::CANCELLED => 'Annulé',
        };
    }
}
