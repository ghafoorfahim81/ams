import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";
import { Button } from "@/Components/ui/button.jsx";
import DataTable from "@/Components/DataTable.jsx";
import { locale, trans } from "@/lib/utils.js";
import { useSort } from "@/hooks/use-sort.js";
import SelectField from "@/Components/SelectField.jsx";
import DatePicker from "@/Components/DatePicker.jsx";

export default function Index({ assignments, filters, organizations }) {

    const { url } = usePage();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const { toast } = useToast();


    const { handleSort, sortBy } = useSort(
        searchParams.get("sort_by") ?? null,
        searchTerm,
        route("assignments.index")
    );

    const translatedTitle = trans("report:Report", { name: trans("assign:Assignment") });

    const { data, setData, get, errors } = useForm({
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('reports.assignment'));
    };

    const handleDateChange = (date, id) => {
        const formattedDate = date ? date.toDate().toISOString().split("T")[0] : "";
        setData(id, formattedDate);
    };
    const handleChange = (e, id = "") => {
        const key = id || e.target.id;
        const value = id ? e : e.target.value;
        setData((values) => ({ ...values, [key]: value }));
    };

    const translatedAssignedOrganization = trans(
        "assign:Assigned_Organization"
    );
    const translatedAssignedOrganizationSelect = trans("Select", {
        name: translatedAssignedOrganization,
    });

    return (
        <AuthenticatedLayout
        >
            <div className="flex items-end gap-3">
                <DatePicker
                    id="from_date"
                    width="full"
                    label={trans("report:From_Date")}
                    value={data.from_date}
                    onChange={(date) => handleDateChange(date, "from_date")}
                />
                <DatePicker
                    id="to_date"
                    width="full"
                    label={trans("report:To_Date")}
                    value={data.to_date}
                    onChange={(date) => handleDateChange(date, "to_date")}
                />
                    <SelectField
                        id="assigned_organization_id"
                        label={translatedAssignedOrganization}
                        items={organizations.data}
                        placeholder={translatedAssignedOrganizationSelect}
                        error={errors.assigned_organization_id}
                        handleChange={handleChange}
                    />
                    <Button onClick={handleSubmit}>{trans("Search")}</Button>
                 
            </div>
            <Head title={translatedTitle} />
            <div className="   ">
                <DataTable
                    data={assignments.data}
                    columns={[
                        {
                            key: `assigning_organization.name_${locale()}`,
                            header: trans("assign:Assigning_Organization"),
                            isSortable: false,
                            render: (row) => row.assigningOrganization,
                        },
                        {
                            key: `assignedOrganization.name_${locale()}`,
                            header: trans("assign:Assigned_Organization"),
                            render: (row) => row.assignedOrganization?.name,
                        },
                        {
                            key: "assigned_date",
                            header: trans("assign:Assigned_Date"),
                        },
                        {
                            key: "amount",
                            header: trans("report:Amount"),
                        },
                    ]}
                    links={assignments.meta.links}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
        </AuthenticatedLayout>
    );
}
