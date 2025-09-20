<?php

namespace App\Http\Controllers\RolePermission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    // List all permissions
    public function index()
    {
        $permissions = Permission::latest()->get();

        return response()->json(['data' => $permissions->map(fn ($permission): array => [
            'id' => $permission->id,
            'name' => $permission->name,
        ])]);
    }

    // Create a new permission
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->name]);

        return response()->json([
            'message' => 'Record created successfully',
            'data' => [
                'permission' => $permission->name,
            ],
        ], 200);
    }

    // Update a permission
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,'.$permission->id,
        ]);

        $permission->name = $request->name;
        $permission->save();

        return response()->json([
            'message' => 'Record updated successfully',
            'data' => [
                'permission' => $permission->name,
            ],
        ], 200);
    }

    // Delete a permission
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return response()->json(['message' => 'Record deleted successfully']);
    }
}
