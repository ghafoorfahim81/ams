<?php

namespace App\Enums;

enum InoutFlag: string
{
    case In = 'in';
    case Out = 'out';

    public function getLabel(): string
    {
        return match ($this) {
            self::In => __('enums.in'),
            self::Out => __('enums.out'),
        };
    }

    public static function fromBool(bool $type): self
    {
        return $type ? self::In : self::Out;
    }
}
