import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AppPaginator from "@/Components/AppPaginator";
import Search from "@/Components/Search";
import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import DataTable from "@/Components/DataTable";
import { Edit, Trash, View } from "lucide-react";
import { locale, trans, translatePermission } from "@/lib/utils";
import SearchResultCount from "@/Components/SearchResultCount";
import { useTranslation } from "react-i18next";
import { useSort } from "@/hooks/use-sort";
import PageHeader from "@/Components/PageHeader";
import { usePermissions } from "@/hooks/use-permissions";

export default function Index({ roles }) {
    const { url } = usePage();

    const { hasPermission } = usePermissions();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const { toast } = useToast();

    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("roles.index")
    );

    const translatedTitle = trans("List", { name: trans("admin:Role") });

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={translatedTitle}
                    route={route("roles.create")}
                    routeText={trans("Create", { name: trans("admin:Role") })}
                    canCreate={hasPermission("create_administration")}
                    canEdit={hasPermission("edit_administration")}
                    canView={hasPermission("view_administration")}
                >
                    <Search
                        url={route("roles.index")}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <SearchResultCount
                        searchTerm={searchTerm}
                        count={roles.meta.total}
                    />
                </PageHeader>
            }
        >
            <div className="flex flex-col items-center justify-center px-12">
                <DataTable
                    data={roles.data}
                    columns={[
                        {
                            key: "name",
                            header: trans("admin:Name"),
                        },
                        {
                            key: "permissions",
                            header: trans("Permissions"),
                            isSortable: false,
                        },
                    ]}
                    actions={[
                        {
                            icon: <Edit className="text-indigo-700" />,
                            onClick: (row) => {},
                            url: (row) => route("roles.edit", row),
                            can: hasPermission("edit_administration"),
                        },
                        {
                            type: "delete",
                            icon: <Trash className="text-red-600" />,
                            deleteUrl: (row) => route("roles.destroy", row.id),
                            onSuccess: () => {
                                toast({
                                    title: "Fc1 deleted successfully.",
                                });
                            },
                            can: hasPermission("delete_administration"),
                        },
                    ]}
                    links={[]}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
        </AuthenticatedLayout>
    );
}
