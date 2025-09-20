import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { trans } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import Error from "./Error";
import { useDebounce } from "@/hooks/use-debounce";

const SelectField = ({
    id,
    label,
    value,
    items: initialItems,
    placeholder = "",
    error,
    handleChange,
    errorExtraSmallText = false,
    disabled = false,
    searchResource,
    isRequired = false,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentItems, setCurrentItems] = useState(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setCurrentItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        if (!searchResource || !debouncedSearchTerm) {
            setCurrentItems(initialItems);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setSearchError(null);
            try {
                const response = await axios.get(route("search.items"), {
                    params: {
                        resource: searchResource,
                        q: debouncedSearchTerm,
                    },
                });

                setCurrentItems(response.data);
            } catch (err) {
                setSearchError("Failed to load search results");
                console.error("Search error:", err);
                setCurrentItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearchTerm, searchResource, initialItems]);

    const translatedLoading = trans("Loading");
    const translatedNoResultFound = trans("Result_Not_Found");

    return (
        <div className="flex flex-col space-y-1 min-w-[150px]">
            <Label htmlFor={id} className="mb-1 cursor-pointer text-nowrap">
                {label}
                {isRequired && <span className="text-red-600 ms-[2px]">*</span>}
            </Label>

            <Select
                id={id}
                onValueChange={(e) => handleChange(e, id)}
                defaultValue={value}
                disabled={disabled}
            >
                <SelectTrigger className="px-2 rtl:flex-row-reverse">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                    {searchResource && (
                        <div className="sticky top-0 z-10 p-2 bg-background">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="h-8"
                            />
                        </div>
                    )}
                    {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                            {translatedLoading}
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                            {translatedNoResultFound}
                        </div>
                    ) : (
                        currentItems.map((item) => (
                            <SelectItem
                                className="rtl:flex-row-reverse rtl:text-right"
                                value={item.id}
                                key={item.id}
                            >
                                {item.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
            <Error
                error={error || searchError}
                extraSmallText={errorExtraSmallText}
            />
        </div>
    );
};

export default SelectField;
