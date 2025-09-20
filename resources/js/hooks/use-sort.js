import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";

export function useSort(initialSortBy, searchTerm, url) {
    const [sortBy, setSortBy] = useState(initialSortBy);

    const handleSort = useCallback(
        (columnKey) => {
            const newSortBy =
                sortBy === columnKey ? `-${columnKey}` : columnKey;
            setSortBy(newSortBy);

            router.get(
                url,
                {
                    q: searchTerm,
                    sort_by: newSortBy,
                },
                {
                    preserveScroll: true,
                }
            );
        },
        [sortBy, searchTerm, url]
    );

    return { sortBy, handleSort };
}
