<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {

        // Define resources
        $resources = [
            'user_management',
            'reports',
            'services',
            'service_categories',
            'appointments',
            'slots',
            'postal_codes',
            'holidays',
            'audits',
            'logs',
        ];

        // Define actions
        $actions = ['create', 'edit', 'view_list', 'delete', 'view'];

        // Create permissions for each resource
        $permissions = [];

        foreach ($resources as $resource) {
            if ($resource === 'reports') {
                $permissions[] = 'view_list_reports'; // Only this action for reports
            } else if ($resource === 'logs') {
                $permissions[] = 'view_list_logs'; // Only this action for logs
            } else {
                foreach ($actions as $action) {
                    $permissions[] = "{$action}_{$resource}";
                }
            }
        }

        // Insert permissions into the database
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $editor = Role::firstOrCreate(['name' => 'editor']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Assign all permissions to Super Admin
        $superAdmin->givePermissionTo(Permission::all());

        // Assign permissions to Admin (excluding restricted ones)
        $adminPermissions = Permission::whereNotIn('name', [
            'delete_user_management',
            'create_administration',
            'edit_administration',
            'view_list_administration',
            'delete_administration',
            'create_services',
            'edit_services',
            'view_list_services',
            'delete_services',
            'create_service_categories',
            'edit_service_categories',
            'view_list_service_categories',
            'delete_service_categories',
            'create_appointments',
            'edit_appointments',
            'view_list_appointments',
            'delete_appointments',
            'create_slots',
            'edit_slots',
            'view_list_slots',
            'delete_slots',
            'create_postal_codes',
            'edit_postal_codes',
            'view_list_postal_codes',
            'delete_postal_codes',
            'create_holidays',
            'edit_holidays',
            'view_list_holidays',
            'delete_holidays',
            'create_audits',
            'edit_audits',
            'view_list_audits',
            'delete_audits',
        ])->get();
        $admin->syncPermissions($adminPermissions);

        // Assign limited permissions to Editor (only edit, view_list, and view)
        $editorPermissions = Permission::where(function ($query) {
            $query->where('name', 'like', 'edit_%')
                ->orWhere('name', 'like', 'view_list_%')
                ->orWhere('name', 'like', 'view_%');
        })->where('name', '!=', 'view_list_reports')->get();
        $editor->syncPermissions($editorPermissions);

        // Assign minimal permissions to User (only view_list and view)
        $userPermissions = Permission::where(function ($query) {
            $query->where('name', 'like', 'view_list_%')
                ->orWhere('name', 'like', 'view_%');
        })->where('name', '!=', 'view_list_reports')->get();
        $user->syncPermissions($userPermissions);

        // Assign only 'view_list_reports' permission for reports to all roles
        Permission::where('name', 'view_list_reports')->each(function ($permission) use ($admin, $editor, $user) {
            $admin->givePermissionTo($permission);
            $editor->givePermissionTo($permission);
            $user->givePermissionTo($permission);
        });
    }
}
