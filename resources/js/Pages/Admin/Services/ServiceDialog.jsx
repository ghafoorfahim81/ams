import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Error from "@/Components/Error.jsx";
import InputField from "@/Components/InputField.jsx";
import TextareaField from "@/Components/TextareaField.jsx";
export default function ServiceDialog({
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
                        {isEditing
                            ? "Edit Service"
                            : "Create Service"
                            }
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <div className="grid gap-4">
                        <InputField
                            id="name"
                            name="name"
                            className="col-span-3"
                            label="Name"
                            type="name"
                            value={data.name}
                            placeholder="Enter Name"
                            error={errors.name}
                            handleChange={handleChange}
                        />
                </div>
                <div className="grid gap-4">
                        <InputField
                            id="capacity_per_slot"
                            name="capacity_per_slot"
                            className="col-span-3"
                            label="Capacity Per Slot"
                            type="number"
                            value={data.capacity_per_slot}
                            placeholder="Enter Capacity Per Slot"
                            error={errors.capacity_per_slot}
                            handleChange={handleChange}
                        />
                </div>
                <div className="grid gap-4">
                        <InputField
                            id="duration"
                            name="duration"
                            className="col-span-3"
                            label="Duration"
                            type="number"
                            value={data.duration}
                            placeholder="Enter Duration"
                            error={errors.duration}
                            handleChange={handleChange}
                        />
                </div>
                <div className="grid gap-4">
                <div className="flex items-center space-x-2">

                        <Label
                            htmlFor="is_active"
                            className="text-sm font-medium me-2"
                        >
                            Is Active
                        </Label>
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                handleChange(e.target.checked, "is_active")
                            }
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded hover:cursor-pointer focus:ring-indigo-600"
                        />
                        <Label
                            htmlFor="is_emergency"
                            className="text-sm font-medium me-2"
                        >
                            Is Emergency
                        </Label>
                        <input
                            type="checkbox"
                            id="is_emergency"
                            name="is_emergency"
                            checked={data.is_emergency}
                            onChange={(e) =>
                                handleChange(e.target.checked, "is_emergency")
                            }
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded hover:cursor-pointer focus:ring-indigo-600"
                        />
                    </div>
                    <div className=" ">
                        <TextareaField
                            id="description"
                            name="description"
                            className="col-span-3"
                            label="Description"
                            value={data.description}
                            placeholder="Enter Description"
                            error={errors.description}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={processing}
                    >
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
