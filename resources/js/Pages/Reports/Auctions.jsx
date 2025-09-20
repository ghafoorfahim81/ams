import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";
import { Button } from "@/Components/ui/button.jsx";
import DataTable from "@/Components/DataTable.jsx";
import { locale, trans } from "@/lib/utils.js";
import { useSort } from "@/hooks/use-sort.js";
import DatePicker from "@/Components/DatePicker.jsx";
export default function Index({ auctions, filters }) {

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
        route("reports.auction")
    );

    const translatedTitle = trans("report:Report", { name: trans("auction:Auction") });

    const { data, setData, get, errors } = useForm({
        from_date:  null,
        to_date: null,
    });

    const handleDateChange = (date, id) => {
        const formattedDate = date ? date.toDate().toISOString().split("T")[0] : "";
        setData(id, formattedDate);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('reports.auction'));
    };

    const handleExport = (e) => {
        e.preventDefault();
        get(route('reports.auction.export'));
    };
    return (
        <AuthenticatedLayout
        >
            <Head title={translatedTitle} />
            <div className="flex items-end gap-3">
                <DatePicker
                    width="full"
                    id="from_date"
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
                <Button onClick={handleSubmit}>{trans("Search")}</Button>
                <Button onClick={handleExport}>{trans("Export")}</Button>
            </div>
            <div className="mt-6">
                <DataTable
                    data={auctions.data}
                    columns={[
                        {
                            key: `organization`,
                            isSortable: false,
                            header: trans("auction:Auction_Organization"),
                            render: (row) => row.organization,
                        },
                        {
                            key: "date",
                            header: trans("Date"),
                        },
                        {
                            key: "buyer_name",
                            header: trans("auction:Buyer_Name"),
                        },
                        {
                            key: "buyer_nic",
                            header: trans("auction:Buyer_NIC"),
                        },
                        {
                            key: "amount",
                            header: trans("report:Amount"),
                        },
                        {
                            key: "increased_amount",
                            header: trans("report:Increased_Amount"),
                        },
                    ]}
                    links={auctions.meta.links}
                    searchTerm={searchTerm}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            </div>
        </AuthenticatedLayout>
    );
}
