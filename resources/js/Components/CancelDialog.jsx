import React, { useState } from "react";
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
import { trans } from "@/lib/utils";

const CancelDialog = ({
    title = trans("Are you sure"),
    description = trans("Do you want to cancel the appointment?"),
    onConfirm,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = async () => {
        try {
            await onConfirm?.();
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
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
                        onClick={handleConfirm}
                    >
                        {trans("Confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CancelDialog;
