import React from "react";
import { HighlightBadge } from "./ui/HighlitText";
import { trans } from "@/lib/utils";

const SearchResultCount = ({ searchTerm, count }) => {
    return searchTerm ? (
        <div className="flex items-center justify-center text-sm gap-x-2">
            <span className="font-bold">{count}</span>
            <span>{trans("searchResults", { count, term: searchTerm })}</span>
            <HighlightBadge>{searchTerm}</HighlightBadge>
        </div>
    ) : null;
};

export default SearchResultCount;
