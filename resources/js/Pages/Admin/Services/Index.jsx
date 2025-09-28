import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";
import AppPaginator from "@/Components/AppPaginator.jsx";
import Search from "@/Components/Search.jsx";
import Header from "@/Components/Header.jsx";
import ServiceDialog from "./ServiceDialog.jsx";
import { Button } from "@/Components/ui/button.jsx";
import DataTable from "@/Components/DataTable.jsx";
import { Edit, Trash } from "lucide-react";
import { trans } from "@/lib/utils.js";
import SearchResultCount from "@/Components/SearchResultCount.jsx";
import { useSort } from "@/hooks/use-sort.js";
import {usePermissions} from "@/hooks/use-permissions.js";
import PageHeader from "@/Components/PageHeader.jsx";

export default function Index({ services, service_categories }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editServiceId, setEditServiceId] = useState(null);

    const { url } = usePage();
    const { hasPermission } = usePermissions();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const { toast } = useToast();

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            name: "",
            duration: "",
            capacity_per_slot: "",
            is_active: true,
            description: "",
            is_emergency: false,
            service_category_id: "",
        });

        const createdMessage = "Service Created Successfully";
        const updatedMessage = "Service Updated Successfully";
        const deletedMessage = "Service Deleted Successfully";

        function handleChange(e, id = "") {
            let key;
            let value;
            if (id !== "") {
                key = id;
                value = e;
            } else {
                key = e.target.id;
                value = e.target.value;
            }
            setData((values) => ({
                ...values,
                [key]: value,
            }));
        }

    function handleSubmit(e) {
        e.preventDefault();

        const url = isEditing
            ? route("services.update", editServiceId)
            : route("services.store");
        const method = isEditing ? "put" : "post";

        const handleSuccess = () => {
            setIsDialogOpen(false);
            reset();
            clearErrors();
            toast({
                title: isEditing
                    ? updatedMessage
                    : createdMessage,
            });
        };

        method === "put"
            ? put(url, { onSuccess: handleSuccess })
            : post(url, { onSuccess: handleSuccess });
    }

    function handleCreate() {
        setIsEditing(false);
        setEditServiceId(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    }

    function handleEdit(service) {
        setIsEditing(true);
        setEditServiceId(service.id);
        setData({
            name: service.name,
            duration: service.duration,
            capacity_per_slot: service.capacity_per_slot,
            is_active: service.is_active,
            description: service.description,
            is_emergency: service.is_emergency,
            service_category_id: service.service_category_id ?? "",
        });
        setIsDialogOpen(true);
    }

    function handleDelete(service) {
        router.delete(route("services.destroy", service.id), {
            onSuccess: () => {
                toast({ title: deletedMessage });
            },
        });
    }

    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("services.index")
    );
    const validLinks = services.meta?.links?.filter(link => link !== null && link.url !== null) ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex gap-x-4">
                        <Header text="Services" />
                        <Search
                            url={route("services.index")}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <SearchResultCount
                            searchTerm={searchTerm}
                            count={services.meta.total}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="default" onClick={handleCreate}>
                            Create Service
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Services" />
            <div className="flex flex-col items-center justify-center px-12">
                <DataTable
                    data={services.data}
                    columns={[
                        { key: "name", header: "Name" },
                        { key: "duration", header: "Duration" },
                        { key: "capacity_per_slot", header: "Capacity" },
                        { key: "is_active", header: "Status" },
                        { key: "description", header: "Description" },
                        { key: "is_emergency", header: "Emergency?" },
                        { key: "service_category_name", header: "Category" },
                    ]}
                    actions={[
                        {
                            icon: <Edit className="text-indigo-700" />,
                            onClick: (row) => handleEdit(row),
                            can: hasPermission("edit_services"),
                        },
                        {
                            type: "delete",
                            icon: <Trash className="text-red-600" />,
                            deleteUrl: (row) =>
                                route("services.destroy", row.id),
                            onSuccess: () => {
                                toast({
                                    title: deletedMessage,
                                });
                            },
                            can: hasPermission("delete_services"),
                        },

                    ]}
                    links={validLinks}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
            <ServiceDialog
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setIsEditing(false);
                        setEditServiceId(null);
                        reset();
                        clearErrors();
                    }
                }}
                isEditing={isEditing}
                data={data}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                processing={processing}
                serviceCategories={service_categories.data}
            />
        </AuthenticatedLayout>
    );
}
