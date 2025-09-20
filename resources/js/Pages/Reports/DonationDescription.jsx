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

export default function Index({ donationDescription, filters, organizations }) {

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
        route("reports.donation_description")
    );

    const translatedTitle = trans("report:Report", { name: trans("donation:Donation_Description") });


    const { data, setData, get, errors } = useForm({
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
        description_date: filters.description_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('reports.donation_description'));
    };

    const handleChange = (e, id = "") => {
        const key = id || e.target.id;
        const value = id ? e : e.target.value;
        setData((values) => ({ ...values, [key]: value }));
    };

    const handleDateChange = (date, id) => {
        const formattedDate = date ? date.toDate().toISOString().split("T")[0] : "";
        setData(id, formattedDate);
    };

    return (
        <AuthenticatedLayout
        >
            <div className="flex gap-2">
                <DatePicker
                    id="from_date"
                    width="250px"
                    label={trans("report:From_Date")}
                    value={data.from_date}
                    onChange={(date) => handleDateChange(date, "from_date")}
                />
                <DatePicker
                    id="to_date"
                    width="250px"
                    label={trans("report:To_Date")}
                    value={data.to_date}
                    onChange={(date) => handleDateChange(date, "to_date")}
                />
                <DatePicker
                    id="description_date"
                    width="250px"
                    label={trans("donation:Description_Date")}
                    value={data.description_date}
                    onChange={(date) => handleDateChange(date, "description_date")}
                />
                    <SelectField
                        id="donated_from_org_id"
                        label={trans("donation:Donor_Organization")}
                        items={organizations.data}
                        placeholder={trans("Select", {
                            name: trans("admin:Organization"),
                        })}
                        error={errors.donated_from_org_id}
                        handleChange={handleChange}
                    />
                <div className="mt-6 mr-2">
                    <Button onClick={handleSubmit}>{trans("Search")}</Button>
                </div>
            </div>
            <Head title={translatedTitle} />
            <div className="   ">
                <DataTable
                    data={donationDescription.data}
                    columns={[
                        {
                            key: `donated_from_org.name_${locale()}`,
                            header: trans("donation:Donor_Organization"),
                            render: (row) => row.donated_from_org?.name,
                        },
                        {
                            key: `donated_to_org.name_${locale()}`,
                            header: trans("donation:Donated_Organization"),
                            render: (row) => row.donated_to_org?.name,
                        },

                        {
                            key: "donated_date",
                            header: trans("donation:Donated_Date"),
                        },
                        {
                            key: "description_date",
                            header: trans("donation:Description_Date"),
                        },
                        {
                            key: "amount",
                            header: trans("report:Amount"),
                        },
                    ]}
                    links={donationDescription.meta.links}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
        </AuthenticatedLayout>
    );
}
