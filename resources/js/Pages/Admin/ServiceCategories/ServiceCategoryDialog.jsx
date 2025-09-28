import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog.jsx";
import InputField from "@/Components/InputField.jsx";
import TextareaField from "@/Components/TextareaField.jsx";
import { Button } from "@/Components/ui/button.jsx";

export default function ServiceCategoryDialog({
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
                        {isEditing ? "Edit Category" : "Create Category"}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>

                <div className="grid gap-4">
                    <InputField
                        id="name"
                        name="name"
                        className="col-span-3"
                        label="Name"
                        type="text"
                        value={data.name}
                        placeholder="Enter Name"
                        error={errors.name}
                        handleChange={handleChange}
                    />
                </div>

                <div className="grid gap-4">
                    <InputField
                        id="slug"
                        name="slug"
                        className="col-span-3"
                        label="Slug (optional)"
                        type="text"
                        value={data.slug}
                        placeholder="auto-generated from name if empty"
                        error={errors.slug}
                        handleChange={handleChange}
                    />
                </div>

                <div className="grid gap-4">
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

                <DialogFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={processing}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


