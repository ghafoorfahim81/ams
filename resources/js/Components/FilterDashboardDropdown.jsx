import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Timer } from "lucide-react";
import { trans } from "@/lib/utils.js";


export default function DashboardFilterDropdown({ onSelect }) {
    const [position, setPosition] = React.useState("0");
    // Keep values numeric-day offsets to align with frontend filter mapping
    const options = [
        { label: trans("Today") || "Today", value: "0" },
        { label: trans("This Week") || "This Week", value: "7" },
        { label: trans("This Month") || "This Month", value: "30" },
        { label: trans("This Year") || "This Year", value: "365" },
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Timer className="mr-2 h-4 w-4" />
                    {trans("Filter Dashboard") || "Filter Dashboard"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-center ml-3">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    {options.map((option) => (
                        <DropdownMenuRadioItem
                            className="pl-0 text-center flex items-center justify-center gap-1"
                            value={option.value}
                            key={option.value}
                            onClick={() => onSelect && onSelect(option.value)}
                        >
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}

                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    );
}
