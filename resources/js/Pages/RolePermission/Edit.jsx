import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { locale, trans, translatePermission } from "@/lib/utils";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputField from "@/Components/InputField";
import { Separator } from "@/Components/ui/separator";
import { Checkbox } from "@/Components/ui/checkbox";
import Error from "@/Components/Error";
import PageHeader from "@/Components/PageHeader";

export default function Edit({ role, permissions }) {
    const { toast } = useToast();

    // Initialize the form with the role's current data
    const { data, setData, put, processing, errors, reset } = useForm({
        name: role.name,
        permissions: role.permissions,
    });

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        put(route("roles.update", role.id), {
            onSuccess: () => {
                toast({
                    title: trans("Update_success", {
                        name: trans("Role:Role"),
                    }),
                });
            },
            onError: () => {
                toast({
                    title: trans("Update_error"),
                    variant: "destructive",
                });
            },
        });
    }

    const translatedTitle = trans("Edit", {
        name: trans("Role:Role"),
    });

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={translatedTitle}
                    route={route("roles.index")}
                    routeText={trans("Back_To_List")}
                />
            }
        >
            <Head title={translatedTitle} />

            <div className="mb-5">
                <div className="grid grid-cols-3 mb-3 gap-x-2 gap-y-5">
                    <InputField
                        id="name"
                        label={trans("admin:Name")}
                        type="text"
                        placeholder={"Enter name"}
                        value={data.name}
                        error={errors.name}
                        handleChange={(e) => setData("name", e.target.value)}
                    />
                </div>

                <Separator className="my-6" />

                <h2 className="mb-5 font-bold">{trans("Permissions")}:</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <Checkbox
                            id="select-all"
                            checked={
                                data.permissions.length === permissions.length
                            }
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setData("permissions", [...permissions]);
                                } else {
                                    setData("permissions", []);
                                }
                            }}
                            className="me-2"
                        />
                        <Label
                            htmlFor="select-all"
                            className="text-sm font-medium leading-none"
                        >
                            {trans("permission:Select_All")}
                        </Label>
                    </div>

                    {permissions.map((permission) => (
                        <div key={permission} className="flex items-center">
                            <Checkbox
                                id={`permission-${permission}`}
                                checked={data.permissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                    const newPermissions = checked
                                        ? [...data.permissions, permission]
                                        : data.permissions.filter(
                                              (id) => id !== permission
                                          );
                                    setData("permissions", newPermissions);
                                }}
                                className="me-2"
                            />
                            <Label
                                htmlFor={`permission-${permission}`}
                                className="text-sm font-medium leading-none"
                            >
                                {translatePermission(permission)}
                            </Label>
                        </div>
                    ))}
                </div>

                {errors.permissions && <Error error={errors.permissions} />}
            </div>

            <Button onClick={handleSubmit} disabled={processing}>
                {trans("Update")}
            </Button>
        </AuthenticatedLayout>
    );
}
