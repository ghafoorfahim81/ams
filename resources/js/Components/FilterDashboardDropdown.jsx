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
import {trans} from "@/lib/utils.js";


export default function DashboardFilterDropdown({ onSelect }) {
    const [position, setPosition] = React.useState("0")
    const options = [
        { label: trans("doc:Today"), value: "0"  },
        { label: trans("doc:Last_Week"), value: "7"  },
        { label: trans("doc:Last_Month"), value: "30"  },
        { label: trans("doc:Last_3_Month"), value: "90" },
        { label: trans("doc:Last_6_Month"), value: "180"  },
        { label: trans("doc:Last_Year"), value: "365"  },
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Timer className="mr-2 h-4 w-4" />
                    {trans("doc:Filter_Dashboard")}
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
