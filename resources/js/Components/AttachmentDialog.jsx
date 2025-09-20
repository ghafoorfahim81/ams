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
import { Button } from "@/Components/ui/button";
import Error from "@/Components/Error";
import { trans } from "@/lib/utils";
import DatePicker from "@/Components/DatePicker.jsx";
import InputField from "@/Components/InputField.jsx";
import {Separator} from "@/Components/ui/separator.jsx";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {CircleX} from "lucide-react";

export default function AttachmentDialog({
                                             isOpen,
                                             onOpenChange,
                                             isEditing,
                                             attachments,
                                             setAttachments,
                                             handleSubmit,
                                         }) {

    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            title: "",
            attachment: "",

        });

    function handleChange(e, id = "") {
        if (id === "attachment") {
            setData("attachment", e.target.files[0]);
        } else if (id !== "") {
            setData(id, e);
        } else {
            const { id: fieldId, value } = e.target;
            setData(fieldId, value);
        }
    }
    const addAttachment = () => {
       setAttachments([...attachments, data]);
        reset();
    }

    const removeItem = (index) => {
        setAttachments(
            attachments.filter((_, i) => i !== index)
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? trans("Edit", { name: trans("admin:Province") })
                            :  trans("Upload_Attachments")
                        }
                    </DialogTitle>
                </DialogHeader>
                <Separator/>
                <DialogDescription></DialogDescription>
                <div className="grid">
                    <div className="grid grid-cols-2 mb-3 gap-x-2  ">
                        <InputField
                            id="title"  // Changed from "number"
                            label={trans("Title")}
                            placeholder={trans("Enter", { text: trans("Title") })}
                            type="text"
                            error={errors.title}  // Changed from errors.number
                            handleChange={handleChange}
                        />
                        <InputField
                            id="attachment"  // Changed from "number"
                            label={trans("Attachment")}
                            type="file"
                            error={errors.attachment}  // Changed from errors.number
                            handleChange={handleChange}
                        />
                    </div>
                    <div>
                        <Button
                            onClick={addAttachment}
                        >
                            {trans("Add")}
                        </Button>
                    </div>

                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">
                                {trans("Title")}
                            </th>
                            <th className="px-4 py-2 text-left">
                                {trans("Attachment")}
                            </th>
                            <th className="px-4 py-2 text-left">
                                {trans("Action")}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {attachments.map((attachment, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    {attachment.title}
                                </td>
                                <td className="px-4 py-2">
                                    {attachment.attachment}
                                </td>
                                <td className="px-4 py-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-600 hover:scale-105"
                                    >
                                        <CircleX />
                                    </Button>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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
