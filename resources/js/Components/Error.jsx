import { cn } from "@/lib/utils";
import React from "react";

const Error = ({ error, extraSmallText = false }) => {
    return (
        <span
            className={cn(
                "-mt-3 text-sm text-red-600",
                extraSmallText && "text-xs"
            )}
        >
            {error}
        </span>
    );
};

export default Error;
