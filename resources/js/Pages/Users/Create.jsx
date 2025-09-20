import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { trans, translatePermission } from "@/lib/utils";
import InputField from "@/Components/InputField";
import SelectField from "@/Components/SelectField";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import Error from "@/Components/Error";
import PageHeader from "@/Components/PageHeader";
import { usePage } from "@inertiajs/react";

export default function Create({ roles, permissions, employees }) {
    const { toast } = useToast();
    const { locale } = usePage().props;
    const isRTL = locale === "fa" || locale === "ps";

    // Extract all translations to variables
    const translatedUser = trans("admin:User");
    const translatedUserEnter = trans("Enter", { text: translatedUser });
    const translatedEmail = trans("admin:Email");
    const translatedPassword = trans("admin:Password");
    const translatedPasswordConfirmation = trans("admin:Password_confirmation");
    const translatedAvatar = trans("admin:Avatar");
    const translatedRole = trans("admin:Role");
    const translatedEmployee = trans("admin:Employee");
    const translatedRoleSelect = trans("Select", { name: translatedRole });
    const translatedEmployeeSelect = trans("Select", {
        name: translatedEmployee,
    });
    const translatedStatus = trans("admin:Status");
    const translatedPermissions = trans("admin:Permissions");
    const translatedSelectAll = trans("admin:Select_All");
    const translatedSave = trans("admin:Save");
    const translatedBackToList = trans("Back_To_List");
    const translatedCreateTitle = trans("Create", { name: translatedUser });
    const translatedCreateSuccess = trans("Create_success", {
        name: translatedUser,
    });
    const translatedCreateError = trans("Create_error");

    const { data, setData, post, processing, errors } = useForm({
        user_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        avatar: null,
        role: "",
        permissions: [],
        status: true,
        employee_id: "",
    });

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

    function handleAvatarChange(e) {
        if (e.target.files && e.target.files[0]) {
            setData("avatar", e.target.files[0]);
        }
    }

    function handleRoleChange(value) {
        setData("role", value);
    }

    function handleEmployeeChange(value) {
        setData("employee_id", value);
    }

    function handlePermissionChange(newPermissions) {
        setData("permissions", newPermissions);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        // Find the role name from the roles array
        const selectedRole = roles.find((role) => role.id === data.role);
        if (!selectedRole) {
            toast({
                title: translatedCreateError,
                variant: "destructive",
            });
            return;
        }

        // Append all form fields
        formData.append("user_name", data.user_name);
        formData.append("employee_id", data.employee_id);
        formData.append("email", data.email);
        formData.append("role", selectedRole.name); // Send role name instead of ID
        formData.append("status", data.status ? "1" : "0");

        // Append each permission individually to create an array
        data.permissions.forEach((permission, index) => {
            formData.append(`permissions[${index}]`, permission);
        });

        // Only include password fields if they're not empty
        if (data.password) {
            formData.append("password", data.password);
            formData.append(
                "password_confirmation",
                data.password_confirmation
            );
        }

        // Append avatar if it exists
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }

        router.post(route("users.store"), formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: translatedCreateSuccess,
                });
            },
            onError: (errors) => {
                console.error("Create errors:", errors);
                toast({
                    title: translatedCreateError,
                    variant: "destructive",
                });
            },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={translatedCreateTitle}
                    route={route("users.index")}
                    routeText={translatedBackToList}
                />
            }
        >
            <Head title={translatedCreateTitle} />

            <div className="mb-5">
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        id="user_name"
                        name="user_name"
                        label={translatedUser}
                        type="text"
                        value={data.user_name}
                        placeholder={translatedUserEnter}
                        error={errors.user_name}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="email"
                        name="email"
                        label={translatedEmail}
                        type="email"
                        value={data.email}
                        placeholder={translatedUserEnter}
                        error={errors.email}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="password"
                        name="password"
                        label={translatedPassword}
                        type="password"
                        value={data.password}
                        placeholder={translatedUserEnter}
                        error={errors.password}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="password_confirmation"
                        name="password_confirmation"
                        label={translatedPasswordConfirmation}
                        type="password"
                        value={data.password_confirmation}
                        placeholder={translatedUserEnter}
                        error={errors.password_confirmation}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="avatar"
                        name="avatar"
                        label={translatedAvatar}
                        type="file"
                        error={errors.avatar}
                        handleChange={handleAvatarChange}
                    />
                    <SelectField
                        id="role"
                        items={roles}
                        placeholder={translatedRoleSelect}
                        label={translatedRole}
                        value={data.role}
                        error={errors.role}
                        errorExtraSmallText
                        handleChange={handleRoleChange}
                    />
                    <SelectField
                        id="employee_id"
                        items={employees}
                        placeholder={translatedEmployeeSelect}
                        label={translatedEmployee}
                        value={data.employee_id}
                        error={errors.employee_id}
                        errorExtraSmallText
                        handleChange={handleEmployeeChange}
                        searchResource="employees"
                    />
                    <div
                        className={`flex items-center ${
                            isRTL
                                ? "flex-row-reverse space-x-reverse"
                                : "space-x-2"
                        }`}
                    >
                        <Label
                            htmlFor="status"
                            className="text-sm font-medium me-2"
                        >
                            {translatedStatus}
                        </Label>
                        <input
                            type="checkbox"
                            id="status"
                            name="status"
                            checked={data.status}
                            onChange={(e) =>
                                setData("status", e.target.checked)
                            }
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded hover:cursor-pointer focus:ring-indigo-600"
                        />
                    </div>
                </div>

                <Separator className="my-6" />

                <h2 className="mb-5 font-bold">{translatedPermissions}:</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Checkbox
                            id="select-all"
                            checked={
                                data.permissions?.length === permissions?.length
                            }
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    handlePermissionChange(permissions);
                                } else {
                                    handlePermissionChange([]);
                                }
                            }}
                            className="me-2"
                        />
                        <Label
                            htmlFor="select-all"
                            className="text-sm font-medium leading-none"
                        >
                            {translatedSelectAll}
                        </Label>
                    </div>
                    {permissions?.map((permission) => (
                        <div key={permission} className="flex items-center">
                            <Checkbox
                                id={`permission-${permission}`}
                                checked={data.permissions?.includes(permission)}
                                onCheckedChange={(checked) => {
                                    const newPermissions = checked
                                        ? [
                                              ...(data.permissions || []),
                                              permission,
                                          ]
                                        : (data.permissions || []).filter(
                                              (p) => p !== permission
                                          );
                                    handlePermissionChange(newPermissions);
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
                {translatedSave}
            </Button>
        </AuthenticatedLayout>
    );
}
