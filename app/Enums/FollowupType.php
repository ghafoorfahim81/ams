<?php

namespace App\Enums;

enum FollowupType: string
{
    case Actions = 'actions';
    case Respond = 'respond';
    case Followup = 'followup';

    public function getLabel(): string
    {
        return match ($this) {
            self::Actions => __('enums.actions'),
            self::Respond => __('enums.respond'),
            self::Followup => __('enums.followup'),
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
