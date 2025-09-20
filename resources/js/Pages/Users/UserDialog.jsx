import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import Error from "@/Components/Error";
import { trans } from "@/lib/utils";
import InputField from "@/Components/InputField";
import SelectField from "@/Components/SelectField";
import { Checkbox } from "@/Components/ui/checkbox";
import { Separator } from "@/Components/ui/separator";

export default function UserDialog({
    isOpen,
    onOpenChange,
    isEditing,
    data,
    errors,
    handleChange,
    handleAvatarChange,
    handleRoleChange,
    handlePermissionChange,
    handleSubmit,
    processing,
    roles,
    permissions,
}) {
    const translatedUser = trans("admin:User");
    const translatedUserEnter = trans("Enter", { text: translatedUser });
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="flex items-start justify-between mr-6">
                    <DialogTitle>
                        {isEditing
                            ? trans("Edit", {
                                  name: translatedUser,
                              })
                            : trans("Create", {
                                  name: translatedUser,
                              })}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <InputField
                        id="name"
                        label={translatedUser}
                        type="text"
                        value={data.name}
                        placeholder={translatedUserEnter}
                        error={errors.name}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="email"
                        label={"Email"}
                        type="email"
                        value={data.email}
                        placeholder={translatedUserEnter}
                        error={errors.email}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="password"
                        label={"Password"}
                        type="password"
                        placeholder={translatedUserEnter}
                        error={errors.password}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="password_confirmation"
                        label={"Password confirmation"}
                        type="password"
                        placeholder={translatedUserEnter}
                        error={errors.password_confirmation}
                        handleChange={handleChange}
                    />
                    <InputField
                        id="avatar"
                        label={"Avatar"}
                        type="file"
                        placeholder={translatedUserEnter}
                        error={errors.avatar}
                        handleChange={handleAvatarChange}
                    />
                    <SelectField
                        id="role"
                        items={roles}
                        placeholder="Choose Role"
                        label={"Role"}
                        value={data.role}
                        error={errors.role}
                        errorExtraSmallText
                        handleChange={handleRoleChange}
                    />
                    {data.old_avatar && (
                        <img
                            className="rounded-md size-14"
                            src={data.old_avatar}
                            alt={data.name.charAt(0).toString()}
                        />
                    )}
                </div>
                
                <Separator className="my-4" />
                
                <h2 className="mb-3 font-bold">{trans("Permissions")}:</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <Checkbox
                            id="select-all"
                            checked={data.permissions?.length === permissions?.length}
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
                            Select All
                        </Label>
                    </div>
                    
                    {permissions?.map((permission) => (
                        <div key={permission} className="flex items-center">
                            <Checkbox
                                id={`permission-${permission}`}
                                checked={data.permissions?.includes(permission)}
                                onCheckedChange={(checked) => {
                                    const newPermissions = checked
                                        ? [...(data.permissions || []), permission]
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
                                {permission}
                            </Label>
                        </div>
                    ))}
                </div>
                
                {errors.permissions && <Error error={errors.permissions} />}
                
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={processing}
                    >
                        {isEditing ? trans("Update") : trans("Save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
