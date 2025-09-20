import { router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { trans } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const Search = ({ url = "", searchTerm, setSearchTerm }) => {
    const [query, setQuery] = useState(searchTerm);
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery !== searchTerm) {
            const params = debouncedQuery ? { q: debouncedQuery } : {};
            router.get(url, params, { preserveState: true });
            setSearchTerm(debouncedQuery);
        }
    }, [debouncedQuery, searchTerm, url, setSearchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    const resetSearch = (e) => {
        e.preventDefault();
        setQuery("");
        setSearchTerm("");
        router.get(url);
    };

    return (
        <div className="flex">
            <Input
                type="text"
                placeholder={trans("Search")}
                className="pl-5 sm:w-[300px] md:w-[200px] lg:w-[300px] rounded-full"
                value={query}
                onChange={handleSearch}
            />
            {query && (
                <Button
                    className="text-gray-600 rounded-full -ms-12 hover:text-gray-800"
                    variant="icon"
                    onClick={resetSearch}
                >
                    <X className="w-4 h-4 hover:scale-110" />
                </Button>
            )}
        </div>
    );
};

export default Search;
