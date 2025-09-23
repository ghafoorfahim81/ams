import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, usePage } from "@inertiajs/react";
import DataTable from "@/Components/DataTable.jsx";
import Search from "@/Components/Search.jsx";
import Header from "@/Components/Header.jsx";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";

export default function Index({ logs }) {
    const { url } = usePage();

    const searchParams = useMemo(
        () => new URLSearchParams(url.split("?")[1]),
        [url]
    );

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    const validLinks = logs.meta?.links?.filter(link => link !== null && link.url !== null) ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-x-4">
                            <Header text="Audit Logs" />
                            <Search
                                url={route("logs.index")}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Audit Logs" />
            <div className="flex flex-col items-center justify-center px-12 w-full">
                <DataTable
                    data={logs.data}
                    columns={[
                        { key: "user.full_name", header: "User", render: row => row.user?.full_name ?? "-" },
                        { key: "action", header: "Action" },
                        { key: "created_at", header: "Created at" },
                        { key: "updated_at", header: "Updated at" },
                    ]}
                    actions={[
                        {
                            type: "view",
                            icon: <Eye className="text-gray-700" />,
                            onClick: (row) => window.location = route('logs.show', row.id),
                            can: true,
                        },
                    ]}
                    links={validLinks}
                    searchTerm={searchTerm}
                />
            </div>
        </AuthenticatedLayout>
    );
}


