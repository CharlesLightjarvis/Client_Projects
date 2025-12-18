<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'unpaid';
    case PAID = 'paid';
    case PARTIAL = 'partial';
    case REFUNDED = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::UNPAID => 'Non payé',
            self::PAID => 'Payé',
            self::PARTIAL => 'Partiel',
            self::REFUNDED => 'Remboursé',
        };
    }
}
