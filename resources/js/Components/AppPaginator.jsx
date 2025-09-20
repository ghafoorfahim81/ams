import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/Components/ui/pagination";
import { cn } from "@/lib/utils";

const AppPaginator = (links) => {
    return (
        <Pagination className="py-3 bg-background">
            <PaginationContent>
                {links.links.map((link, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            className={cn(
                                "w-auto px-4",
                                !link.url &&
                                    "text-muted-foreground hover:text-muted-foreground hover:cursor-not-allowed"
                            )}
                            isActive={link.active}
                            href={link.url}
                            disabled
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></PaginationLink>
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
};

export default AppPaginator;
