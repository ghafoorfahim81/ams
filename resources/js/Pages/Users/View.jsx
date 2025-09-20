import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { trans } from "@/lib/utils";
import PageHeader from "@/Components/PageHeader";
import { Separator } from "@/Components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

export default function View({ user }) {
    const userData = user.data;
    const translatedTitle = trans("View", { name: trans("admin:User") });
    const showUpdatedBy = userData.created_by !== userData.updated_by;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={translatedTitle}
                    route={route("users.index")}
                    routeText={trans("Back_To_List")}
                    editRoute={route("users.edit", userData.id)}
                />
            }
        >
            <Head title={translatedTitle} />

            <div className="mb-5">
                <div className="grid grid-cols-3 mb-3 gap-x-2 gap-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Name")}
                        </label>
                        <p className="mt-1">{userData.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Email")}
                        </label>
                        <p className="mt-1">{userData.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Status")}
                        </label>
                        <p className="mt-1">
                            <span className={`px-2 py-1 text-sm rounded-md ${
                                userData.status === trans("Active") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                                {userData.status}
                            </span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Avatar")}
                        </label>
                        <div className="mt-1">
                            <Avatar>
                                <AvatarImage src={userData.avatar} alt={userData.name} />
                                <AvatarFallback>{userData.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Role")}
                        </label>
                        <p className="mt-1">
                            <span className="px-2 py-1 text-sm rounded-md">
                                {userData.role}
                            </span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {trans("Created_By")}
                        </label>
                        <p className="mt-1">{userData.created_by}</p>
                    </div>
                    {showUpdatedBy && userData.updated_by && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {trans("Updated_By")}
                            </label>
                            <p className="mt-1">{userData.updated_by}</p>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                <div>
                    <h3 className="text-lg font-medium mb-2">{trans("Permissions")}</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {userData.permissions.map((permission, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-sm bg-gray-100 rounded-md"
                            >
                                {permission}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 