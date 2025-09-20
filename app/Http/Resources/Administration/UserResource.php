<?php

namespace App\Http\Resources\Administration;

use App\Enums\UserStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_name' => $this->user_name,
            'email' => $this->email,
            'status' => UserStatus::fromBool($this->status)->getLabel(),
            'avatar' => $this->avatar,
            'created_by' => $this->createdBy?->user_name ?? $this->created_by,
            'updated_by' => $this->updatedBy?->user_name ?? $this->updated_by,
            'role' => $this->roles?->first()?->name,
            'role_id' => $this->roles?->first()?->id,
            'permissions' => $this->getAllPermissions()->pluck('name'),
        ];
    }
}
