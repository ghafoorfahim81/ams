"use client";

import { ChevronRight } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/Components/ui/sidebar";
import { Link } from "@inertiajs/react";

function isActive(url) {
    return url.slice(1) === route().current();
}

export function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.sidebarLinks.map(
                    (item) =>
                        item.canView && (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton
                                    tooltip={item.name}
                                    isActive={isActive(item.url)}
                                    asChild
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                )}
            </SidebarMenu>
            <SidebarMenu>
                {items.navMain.map(
                    (item) =>
                        item.canView && (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isActive(item.url)}
                                            className=""
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ms-auto rtl:rotate-180 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isActive(
                                                            subItem.url
                                                        )}
                                                    >
                                                        <Link
                                                            href={subItem.url}
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
