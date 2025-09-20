<?php

namespace App\Enums;

enum UserStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public function getLabel(): string
    {
        return match ($this) {
            self::Active => __('enums.active'),
            self::Inactive => __('enums.inactive'),
        };
    }

    public static function fromBool(bool $status): self
    {
        return $status ? self::Active : self::Inactive;
    }
}
