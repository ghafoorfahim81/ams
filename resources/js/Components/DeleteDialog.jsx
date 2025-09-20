import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Delete } from "lucide-react";
import { trans } from "@/lib/utils";

const DeleteDialog = ({
    triggerText = "Delete",
    title = trans("Are you sure"),
    description = trans("Action cannot be undone"),
    deleteUrl,
    onSuccess,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { delete: deleteRequest, processing } = useForm();

    const handleDelete = () => {
        deleteRequest(deleteUrl, {
            onSuccess: () => {
                setIsOpen(false);
                onSuccess?.();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="destructive">
                        <Delete />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="rtl:text-right">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        className="rtl:ml-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {trans("Cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? trans("Deleting") : trans("Delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
