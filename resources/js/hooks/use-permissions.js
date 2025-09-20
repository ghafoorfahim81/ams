import { usePage } from "@inertiajs/react";

export function usePermissions() {
    const { auth } = usePage().props;

    return {
        hasPermission: (permission) =>
            auth.user_permissions?.includes(permission),
        hasAnyPermission: (permissions) =>
            permissions.some((p) => auth.user_permissions?.includes(p)),
    };
}
