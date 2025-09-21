<?php

namespace App\Enums;

enum Type: string
{
    case Regular = 'regular';
    case Emergency = 'emergency';

    public function getLabel(): string
    {
        return match ($this) {
            self::Regular => 'regular',
            self::Emergency => 'emergency',
        };
    }

    public static function fromBool(bool $type): self
    {
        return $type ? self::Regular : self::Emergency;
    }
}
