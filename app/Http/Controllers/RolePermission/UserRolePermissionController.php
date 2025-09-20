<?php

namespace App\Http\Controllers\RolePermission;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserRolePermissionController extends Controller
{
    // Get user roles and permissions
    public function getUserRolesAndPermissions(User $user)
    {
        $roles = $user->getRoleNames();
        $permissions = $user->getAllPermissions();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions->pluck('name'),
        ]);
    }

    // Assign a role to a user
    public function assignRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|exists:roles,name']);
        $user->assignRole($request->role);

        return response()->json(['message' => 'Role assigned successfully']);
    }

    // Remove a role from a user
    public function revokeRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|exists:roles,name']);
        $user->removeRole($request->role);

        return response()->json(['message' => 'Role revoked successfully']);
    }

    // Assign a permission to a user
    public function assignPermission(Request $request, User $user)
    {
        $request->validate(['permission' => 'required|exists:permissions,name']);
        $user->givePermissionTo($request->permission);

        return response()->json(['message' => 'Permission assigned successfully']);
    }

    // Remove a permission from a user
    public function revokePermission(Request $request, User $user)
    {
        $request->validate(['permission' => 'required|exists:permissions,name']);
        $user->revokePermissionTo($request->permission);

        return response()->json(['message' => 'Permission revoked successfully']);
    }
}
