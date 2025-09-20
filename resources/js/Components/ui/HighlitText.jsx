import React from "react";

const HighlightText = ({ text = "", searchTerm = "" }) => {
    const parts = text
        ?.toString()
        .split(new RegExp(`(${searchTerm})`, "gi")) ?? [""];

    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() &&
                searchTerm ? (
                    <HighlightBadge key={index}>{part}</HighlightBadge>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export default HighlightText;

export const HighlightBadge = ({ children }) => {
    return (
        <span className="p-[2px] text-xs font-semibold text-white bg-indigo-500 rounded-[2px]">
            {children}
        </span>
    );
};
