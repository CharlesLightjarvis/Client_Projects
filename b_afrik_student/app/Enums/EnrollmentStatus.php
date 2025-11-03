<?php

namespace App\Enums;

enum EnrollmentStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'En attente',
            self::CONFIRMED => 'Confirmé',
            self::CANCELLED => 'Annulé',
            self::COMPLETED => 'Terminé',
        };
    }
}
