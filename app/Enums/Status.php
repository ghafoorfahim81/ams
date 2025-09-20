<?php

namespace App\Enums;

enum Status: string
{
    case Pending = 'pending';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
    case Rejected = 'rejected';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => __('enums.pending'),
            self::Ongoing => __('enums.ongoing'),
            self::Completed => __('enums.completed'),
            self::Rejected => __('enums.rejected'),
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
