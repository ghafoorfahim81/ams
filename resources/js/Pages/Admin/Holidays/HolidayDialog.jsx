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

export default function HolidayDialog({
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
                        {isEditing ? "Edit Holiday" : "Create Holiday"}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <div className="grid gap-4">
                    <InputField
                        id="date"
                        name="date"
                        className="col-span-3"
                        label="Date"
                        type="date"
                        value={data.date}
                        placeholder="YYYY-MM-DD"
                        error={errors.date}
                        handleChange={handleChange}
                        isRequired
                    />
                </div>
                <div className="grid gap-4">
                    <InputField
                        id="reason"
                        name="reason"
                        className="col-span-3"
                        label="Reason"
                        type="text"
                        value={data.reason}
                        placeholder="Enter Reason"
                        error={errors.reason}
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


