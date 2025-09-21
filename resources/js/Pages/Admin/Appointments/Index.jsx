import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";
import AppPaginator from "@/Components/AppPaginator.jsx";
import Search from "@/Components/Search.jsx";
import Header from "@/Components/Header.jsx";
import ServiceDialog from "./ServiceDialog.jsx";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button.jsx";
import DataTable from "@/Components/DataTable.jsx";
import { Edit, Trash, Ban, Eye } from "lucide-react";
import { trans } from "@/lib/utils.js";
import SearchResultCount from "@/Components/SearchResultCount.jsx";
import { useSort } from "@/hooks/use-sort.js";
import {usePermissions} from "@/hooks/use-permissions.js";
import PageHeader from "@/Components/PageHeader.jsx";
import AppointmentDetailsDialog from "./AppointmentDetailsDialog.jsx";
export default function Index({ appointments }) {

    const { url } = usePage();
    const { hasPermission } = usePermissions();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const { toast } = useToast();

    function handleCreate() {
        setIsEditing(false);
        setEditAppointmentId(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    }

    function handleEdit(appointment) {
        router.visit(route("appointments.edit", appointment.id));
    }

    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("appointments.index")
    );
    function handleCancel(appointment) {
        toast({ title: "Appointment Canceled Successfully" });
        router.post(route("appointments.cancel", appointment.id));
    }
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    function handleView(appointment) {
        setSelectedAppointmentId(appointment.id);
        setDetailsOpen(true);
    }
    const validLinks = appointments.meta?.links?.filter(link => link !== null && link.url !== null) ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex gap-x-4">
                        <Header text="Appointments" />
                        <Search
                            url={route("appointments.index")}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <SearchResultCount
                            searchTerm={searchTerm}
                            count={appointments.meta.total}
                        />
                    </div>
                    {/* <div className="flex justify-end">
                        <Button variant="default" onClick={handleCreate}>
                            Create Service
                        </Button>
                    </div> */}
                </div>
            }
        >
            <Head title="Appointments" />
            <div className="flex flex-col items-center justify-center px-12">
                <DataTable
                    data={appointments.data}
                    columns={[
                        { key: "code", header: "Code" },
                        {
                            key: "service.name",
                            header: "Service",
                            render: (row) => row.service.name,
                            isSortable: false,
                        },
                        { key: "type", header: "Type" },
                        { key: "status", header: "Status" },
                        { key: "scheduled_date", header: "Scheduled date" },
                        { key: "start_time", header: "Start time" },
                        { key: "end_time", header: "End time" },
                    ]}
                    actions={[
                        {
                            icon: <Edit className="text-indigo-700" />,
                            onClick: (row) => handleEdit(row),
                            can: hasPermission("edit_appointments"),
                        },
                        {
                            type: "view",
                            icon: <Eye className="text-gray-700" />,
                            onClick: (row) => handleView(row),
                            can: true,
                        },
                        {
                            type: "delete",
                            icon: <Trash className="text-red-600" />,
                            deleteUrl: (row) =>
                                route("appointments.destroy", row.id),
                            onSuccess: () => {
                                toast({
                                    title: deletedMessage,
                                });
                            },
                            can: hasPermission("delete_appointments"),
                        },
                        {
                            type: "cancel",
                            icon: <Ban className="text-red-600" size={10}/>,
                            onClick: (row) => handleCancel(row),
                            can: hasPermission("delete_appointments"),
                        },

                    ]}
                    links={validLinks}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
                <AppointmentDetailsDialog
                    isOpen={detailsOpen}
                    onOpenChange={setDetailsOpen}
                    appointmentId={selectedAppointmentId}
                />
            </div>

        </AuthenticatedLayout>
    );
}
