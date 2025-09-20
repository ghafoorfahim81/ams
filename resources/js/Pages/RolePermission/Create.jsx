import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { trans, translatePermission } from "@/lib/utils";
import { Label } from "@/Components/ui/label";
import InputField from "@/Components/InputField";
import { Separator } from "@/Components/ui/separator";
import Error from "@/Components/Error";
import PageHeader from "@/Components/PageHeader";

import { Checkbox } from "@/Components/ui/checkbox";

export default function Create({ permissions }) {
    permissions;

    const { toast } = useToast();

    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            name: "",
            permissions: [],
        });

    function handleSubmit() {
        post(route("roles.store"), {
            onSuccess: () =>
                toast({
                    title: translatedMessage,
                }),
        });
    }

    const translatedMessage = trans("Create_success", {
        name: trans("fc1:Fc1"),
    });

    const translatedTitle = trans("Create", {
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
            <div className="mb-5">
                <div className="grid grid-cols-3 mb-3 gap-x-2 gap-y-5">
                    <InputField
                        id="name"
                        label={trans("admin:Name")}
                        type="text"
                        placeholder={"Enter name"}
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
                {<Error error={errors.permissions}></Error>}
            </div>
            <Button className="mt-5" onClick={handleSubmit}>
                {trans("Save")}
            </Button>
        </AuthenticatedLayout>
    );
}
