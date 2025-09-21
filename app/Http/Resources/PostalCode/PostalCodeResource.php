<?php

namespace App\Http\Resources\PostalCode;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostalCodeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'region_name' => $this->region_name,
            'is_permitted' => $this->is_permitted,
        ];
    }
}
