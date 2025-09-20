<?php

namespace App\Enums;

enum SaderaWareda: string
{
    case Sadera = 'sadera';
    case Wareda = 'wareda';

    public function getLabel(): string
    {
        return match ($this) {
            self::Sadera => __('enums.sadera'),
            self::Wareda => __('enums.wareda'),
        };
    }

    public static function fromBool(bool $type): self
    {
        return $type ? self::Sadera : self::Wareda;
    }
}
