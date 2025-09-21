import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";
import Search from "@/Components/Search.jsx";
import Header from "@/Components/Header.jsx";
import { Button } from "@/Components/ui/button.jsx";
import DataTable from "@/Components/DataTable.jsx";
import { Edit, Trash } from "lucide-react";
import SearchResultCount from "@/Components/SearchResultCount.jsx";
import { useSort } from "@/hooks/use-sort.js";
import { usePermissions } from "@/hooks/use-permissions.js";
import HolidayDialog from "./HolidayDialog.jsx";

export default function Index({ holidays }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { url } = usePage();
    const { hasPermission } = usePermissions();

    const searchParams = useMemo(() => new URLSearchParams(url.split("?")[1]), [url]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
    const { toast } = useToast();

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        date: "",
        reason: "",
    });

    const createdMessage = "Holiday Created Successfully";
    const updatedMessage = "Holiday Updated Successfully";
    const deletedMessage = "Holiday Deleted Successfully";

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

        const url = isEditing ? route("holidays.update", editId) : route("holidays.store");
        const method = isEditing ? "put" : "post";

        const handleSuccess = () => {
            setIsDialogOpen(false);
            reset();
            clearErrors();
            toast({ title: isEditing ? updatedMessage : createdMessage });
        };

        method === "put" ? put(url, { onSuccess: handleSuccess }) : post(url, { onSuccess: handleSuccess });
    }

    function handleCreate() {
        setIsEditing(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    }

    function handleEdit(row) {
        setIsEditing(true);
        setEditId(row.id);
        setData({
            date: row.date,
            reason: row.reason,
        });
        setIsDialogOpen(true);
    }

    function handleDelete(row) {
        router.delete(route("holidays.destroy", row.id), {
            onSuccess: () => {
                toast({ title: deletedMessage });
            },
        });
    }

    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("holidays.index")
    );
    const validLinks = holidays.meta?.links?.filter((link) => link !== null && link.url !== null) ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex gap-x-4">
                        <Header text="Holidays" />
                        <Search url={route("holidays.index")} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <SearchResultCount searchTerm={searchTerm} count={holidays.meta.total} />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="default" onClick={handleCreate}>
                            Create Holiday
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Holidays" />
            <div className="flex flex-col items-center justify-center px-12">
                <DataTable
                    data={holidays.data}
                    columns={[
                        { key: "date", header: "Date" },
                        { key: "reason", header: "Reason" },
                    ]}
                    actions={[
                        {
                            icon: <Edit className="text-indigo-700" />,
                            onClick: (row) => handleEdit(row),
                            can: hasPermission("edit_holidays"),
                        },
                        {
                            type: "delete",
                            icon: <Trash className="text-red-600" />,
                            deleteUrl: (row) => route("holidays.destroy", row.id),
                            onSuccess: () => {
                                toast({ title: deletedMessage });
                            },
                            can: hasPermission("delete_holidays"),
                        },
                    ]}
                    links={validLinks}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
            <HolidayDialog
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setIsEditing(false);
                        setEditId(null);
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
            />
        </AuthenticatedLayout>
    );
}


