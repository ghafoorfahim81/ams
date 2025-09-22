import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { trans } from "@/lib/utils";
import PageHeader from "@/Components/PageHeader";
import DataTable from "@/Components/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import Search from "@/Components/Search";
import SearchResultCount from "@/Components/SearchResultCount";
import { useSort } from "@/hooks/use-sort";
import { Edit, Trash, View } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

export default function Index({ users }) {
    const { toast } = useToast();
    const { url } = usePage();

    const { hasPermission } = usePermissions();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("users.index")
    );

    const columns = [

        {
            key: "full_name",
            header: trans("admin:Name"),
            cell: ({ row }) => {
                const name = row.name;
                return <span className="font-medium">{name}</span>;
            },
        },
        {
            key: "email",
            header: trans("admin:Email"),
        },
        {
            key: "status",
            header: trans("admin:Status"),
            cell: ({ row }) => {
                const status = row.status;
                return (
                    <span
                        className={`px-2 py-1 text-sm rounded-md ${
                            status === trans("Active")
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            key: "avatar",
            header: trans("admin:Avatar"),
            isImage: true,
            isSortable: false,
        },
        {
            key: "role",
            header: trans("admin:Role"),
            isSortable: false,
            cell: ({ row }) => {
                const role = row.role;
                return (
                    <span className="px-2 py-1 text-sm bg-gray-100 rounded-md">
                        {role}
                    </span>
                );
            },
        },

    ];

    const validLinks =
        users.meta?.links?.filter(
            (link) => link !== null && link.url !== null
        ) ?? [];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={trans("List", {
                        name: trans("admin:Users"),
                    })}
                    route={route("users.create")}
                    routeText={trans("Create", { name: trans("admin:User") })}
                    canCreate={hasPermission("create_user_management")}
                    canEdit={hasPermission("edit_user_management")}
                    canView={hasPermission("view_user_management")}
                >
                    <Search
                        url={route("users.index")}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <SearchResultCount
                        searchTerm={searchTerm}
                        count={users.meta.total ?? ""}
                    />
                </PageHeader>
            }
        >
            <Head title={trans("admin:Users")} />

            <DataTable
                columns={columns}
                data={users.data}
                links={validLinks}
                searchTerm={searchTerm}
                onSort={handleSort}
                sortBy={sortBy}
                actions={[
                    {
                        icon: <View className="text-blue-600" />,
                        onClick: (row) => {},
                        url: (row) => route("users.show", row.id),
                        can: hasPermission("view_user_management"),
                    },
                    {
                        icon: <Edit className="text-indigo-700" />,
                        onClick: (row) => {},
                        url: (row) => route("users.edit", row.id),
                        can: hasPermission("edit_user_management"),
                    },
                    {
                        type: "delete",
                        icon: <Trash className="text-red-600" />,
                        deleteUrl: (row) => route("users.destroy", row.id),
                        onSuccess: () => {
                            toast({
                                title: trans("Delete_success", {
                                    name: trans("admin:User"),
                                }),
                            });
                        },
                        can: hasPermission("delete_user_management"),
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
}
