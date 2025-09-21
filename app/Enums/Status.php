<?php

namespace App\Enums;

enum Status: string
{
    case Pending = 'pending';
    case Rescheduled = 'rescheduled';
    case Canceled = 'canceled';
    case Confirmed = 'confirmed';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'pending',
            self::Rescheduled => 'rescheduled',
            self::Canceled => 'canceled',
            self::Confirmed => 'confirmed',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
