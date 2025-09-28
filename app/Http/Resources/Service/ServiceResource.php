<?php

namespace App\Http\Resources\Service;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'duration' => $this->duration,
            'capacity_per_slot' => $this->capacity_per_slot,
            'is_active' => $this->is_active ? trans("Active") : trans("Inactive"),
            'description' => $this->description,
            'is_emergency' => $this->is_emergency ? trans("Yes") : trans("No"),
            'service_category_id' => $this->service_category_id,
            'service_category' => $this->whenLoaded('serviceCategory', fn() => [
                'id' => $this->serviceCategory?->id,
                'name' => $this->serviceCategory?->name,
            ]),
            'service_category_name' => $this->whenLoaded('serviceCategory', fn() => $this->serviceCategory?->name),
        ];
    }
}
