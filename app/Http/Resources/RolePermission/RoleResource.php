<?php

namespace App\Http\Resources\RolePermission;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isIndexRoute = $request->routeIs('roles.index');

        $permissions = $this->permissions->pluck('name');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'permissions' => $isIndexRoute ? Str::limit($permissions->join(', ', ' and ')) : $permissions,
        ];
    }
}
