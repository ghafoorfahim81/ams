import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn, trans } from "@/lib/utils";
import Error from "./Error";

const InputField = ({
    id,
    label,
    type = "text",
    min = 1,
    value,
    ref,
    placeholder = trans("Enter", { text: trans("Text") }),
    error,
    disabled = false,
    handleChange,
    errorExtraSmallText = false,
    isRequired = false,
}) => {
    return (
        <div
            className={cn(
                "flex flex-col space-y-1 min-w-[150px]",
                type === "file" && "hover:cursor-pointer"
            )}
        >
            <Label
                htmlFor={id}
                className={cn("mb-1 cursor-pointer text-nowrap")}
            >
                {label}
                {isRequired && <span className="text-red-600 ms-[2px]">*</span>}
            </Label>
            <Input
                id={id}
                type={type}
                min={type === "number" ? min : undefined}
                defaultValue={value}
                placeholder={placeholder}
                className={type === "file" && "hover:cursor-pointer"}
                onChange={handleChange}
                disabled={disabled}
                ref={ref}
            />
            <Error error={error} extraSmallText={errorExtraSmallText} />
        </div>
    );
};

export default InputField;
