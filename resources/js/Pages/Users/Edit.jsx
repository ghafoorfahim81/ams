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
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

export default function Edit({ user, roles, permissions }) {
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
    const translatedRoleSelect = trans("Select", { name: translatedRole });
    const translatedStatus = trans("admin:Status");
    const translatedPermissions = trans("admin:Permissions");
    const translatedSelectAll = trans("admin:Select_All");
    const translatedSave = trans("admin:Save");
    const translatedBackToList = trans("admin:Back_To_List");
    const translatedEditTitle = trans("Edit", { name: translatedUser });

    const translatedUpdateSuccess = trans("Update_success", { name: trans("admin:User") });

    const translatedUpdateError = trans("admin: Update_error");
    const translatedViewCurrentAvatar = trans("View_Current_Avatar");

    // Log the user data to see what we're working with
    "User data:", user;

    const { data, setData, processing, errors } = useForm({
        user_name: user.data.user_name,
        email: user.data.email,
        password: null,
        password_confirmation: null,
        avatar: null,
        old_avatar: user.data.avatar || null,
        role: user.data.role_id,
        permissions: user.data.permissions || [],
        status: user.data.status === "Active",
    });

    // function handleChange(e) {
    //     const { name, value, type, checked } = e.target;
    //     setData(name, type === "checkbox" ? checked : value);
    // }

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

    function handlePermissionChange(newPermissions) {
        setData("permissions", newPermissions);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        // Add the _method field for Laravel to handle PUT request
        formData.append("_method", "PUT");

        // Find the role name from the roles array
        const selectedRole = roles.find((role) => role.id === data.role);
        if (!selectedRole) {
            toast({
                title: translatedUpdateError,
                variant: "destructive",
            });
            return;
        }

        // Append all form fields
        formData.append("user_name", data.user_name);
        formData.append("email", data.email);
        formData.append("role", selectedRole.name);
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

        // Log the form data to see what we're sending
        for (let pair of formData.entries()) {
            pair[0] + ": " + pair[1];
        }

        router.post(route("users.update", user.data.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: translatedUpdateSuccess,
                });
            },
            onError: (errors) => {
                console.error("Update errors:", errors);
                toast({
                    title: translatedUpdateError,
                    variant: "destructive",
                });
            },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={translatedEditTitle}
                    route={route("users.index")}
                    routeText={translatedBackToList}
                />
            }
        >
            <Head title={translatedEditTitle} />

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
                    <div>
                        <InputField
                            id="avatar"
                            name="avatar"
                            label={translatedAvatar}
                            type="file"
                            error={errors.avatar}
                            handleChange={handleAvatarChange}
                        />
                        {data.old_avatar && (
                            <div className="mt-2">
                                <Label className="text-xs text-muted-foreground">
                                    {translatedViewCurrentAvatar}:
                                </Label>
                                <div className="mt-1">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage
                                            src={data.old_avatar}
                                            alt={data.user_name}
                                        />
                                        <AvatarFallback>
                                            {data.user_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        )}
                    </div>
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
