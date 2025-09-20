<?php

namespace App\Http\Controllers\RolePermission;

use App\Http\Controllers\Controller;
use App\Http\Resources\RolePermission\RoleResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $roles = Role::with('permissions')
            ->when($request->q, fn ($query, $q) => $query->where('name', 'LIKE', "%{$q}%"))
            ->when($request->sort_by, fn ($query, $sortBy) => str_starts_with((string) $sortBy, '-')
                ? $query->orderBy(ltrim((string) $sortBy, '-'), 'desc')
                : $query->orderBy($sortBy, 'asc'), fn ($query) => $query->latest())
            ->paginate();

        return inertia('RolePermission/Index', [
            'roles' => $roles->toResourceCollection(RoleResource::class),
        ]);
    }

    public function create()
    {

        return inertia('RolePermission/Create', [
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->givePermissionTo($request->permissions);
        }

        return to_route('roles.index');
    }

    public function show()
    {
        return inertia('RolePermission/Create');
    }

    public function edit(Role $role)
    {
        $role->load('permissions');

        return inertia('RolePermission/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,'.$role->id,
            'permissions' => 'array|exists:permissions,name',
        ]);

        if ($request->has('name')) {
            $role->name = $request->name;
            $role->save();
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return to_route('roles.index');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return to_route('roles.index');
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'required|array|exists:permissions,name',
        ]);

        $role->givePermissionTo($request->permissions);

        return response()->json([
            'message' => 'Permissions assigned successfully',
            'data' => [
                'role' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
        ], 200);
    }

    public function getRolePermissions(Role $role)
    {
        $permissions = $role->permissions;

        return response()->json([
            'permissions' => $permissions->pluck('name'),
        ]);
    }
}
