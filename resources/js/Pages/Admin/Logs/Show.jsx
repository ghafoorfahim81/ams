import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header.jsx";

export default function Show({ log }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Header text={`Log #${log.id}`} />
                    <Link href={route('logs.index')} className="text-sm underline">Back to Logs</Link>
                </div>
            }
        >
            <Head title={`Log #${log.id}`} />

            <div className="px-12 w-full">
                <div className="bg-white rounded-md shadow p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-gray-500 text-xs">User</div>
                            <div className="font-medium">{log.user?.full_name ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Action</div>
                            <div className="font-medium">{log.action}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Created at</div>
                            <div className="font-medium">{log.created_at}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Updated at</div>
                            <div className="font-medium">{log.updated_at}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-500 text-xs mb-2">Details</div>
                        <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
{JSON.stringify(log.details, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


