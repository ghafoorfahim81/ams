import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { Button } from "@/Components/ui/button.jsx";
import InputField from "@/Components/InputField.jsx";

export default function PostalCodeDialog({
    isOpen,
    onOpenChange,
    isEditing,
    data,
    errors,
    handleChange,
    handleSubmit,
    processing,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Postal Code" : "Create Postal Code"}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <div className="grid gap-4">
                    <InputField
                        id="code"
                        name="code"
                        className="col-span-3"
                        label="Code"
                        type="text"
                        value={data.code}
                        placeholder="Enter Code"
                        error={errors.code}
                        handleChange={handleChange}
                        isRequired
                    />
                </div>
                <div className="grid gap-4">
                    <InputField
                        id="region_name"
                        name="region_name"
                        className="col-span-3"
                        label="Region Name"
                        type="text"
                        value={data.region_name}
                        placeholder="Enter Region Name"
                        error={errors.region_name}
                        handleChange={handleChange}
                    />
                </div>
                <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="is_permitted" className="text-sm font-medium me-2">
                            Is Permitted
                        </Label>
                        <input
                            type="checkbox"
                            id="is_permitted"
                            name="is_permitted"
                            checked={data.is_permitted}
                            onChange={(e) => handleChange(e.target.checked, "is_permitted")}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded hover:cursor-pointer focus:ring-indigo-600"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={processing}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


