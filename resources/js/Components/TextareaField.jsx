import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { trans } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import Error from "./Error";

const TextareaField = ({
    id,
    label,
    value,
    placeholder = trans("Enter", { text: trans("Text") }),
    error,
    handleChange,
    errorExtraSmallText = false,
    isRequired = false,
}) => {
    return (
        <div className="flex flex-col space-y-1 min-w-[150px]">
            <Label htmlFor={id} className="mb-1 cursor-pointer text-nowrap">
                {label}
                {isRequired && <span className="text-red-600 ms-[2px]">*</span>}
            </Label>
            <Textarea
                id={id}
                value={value}
                placeholder={placeholder}
                className=""
                onChange={handleChange}
            />
            <Error error={error} extraSmallText={errorExtraSmallText} />
        </div>
    );
};

export default TextareaField;
