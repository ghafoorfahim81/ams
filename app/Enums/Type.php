<?php

namespace App\Enums;

enum Type: string
{
    case Internal = 'internal';
    case External = 'external';

    public function getLabel(): string
    {
        return match ($this) {
            self::Internal => __('enums.internal'),
            self::External => __('enums.external'),
        };
    }

    public static function fromBool(bool $type): self
    {
        return $type ? self::Internal : self::External;
    }
}
