<?php

namespace App\Http\Resources\Administration;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecurityLevelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_fa' => $this->name_fa,
            'name_en' => $this->name_en,
            'name_ps' => $this->name_ps,
            'name' => $this->{'name_'.app()->getLocale()},
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? Carbon::parse($this->updated_at)->format('Y-m-d') : null,
        ];
    }
}
