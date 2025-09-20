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
        // --- FIX IS HERE (Line 22) ---
        // 1. Check if $this->status is null. If it is, default to false.
        // 2. Explicitly cast the result to (bool) to satisfy the Enum's type hint.
        $userStatus = (bool) ($this->status ?? false); 

        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'status' => UserStatus::fromBool($userStatus)->getLabel(), // Use the safely cast variable
            'avatar' => $this->avatar,
            'created_by' => $this->createdBy?->full_name ?? $this->created_by,
            'updated_by' => $this->updatedBy?->full_name ?? $this->updated_by,
            'role' => $this->roles?->first()?->name,
            'role_id' => $this->roles?->first()?->id,
            'permissions' => $this->getAllPermissions()->pluck('name'),
        ];
    }
}