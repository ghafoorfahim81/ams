import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/Components/ui/sidebar";
import {
    LayoutDashboard,
    User,
    FileChartColumn,
    MapPinPlus,
    CalendarCog,
    FileText
} from "lucide-react";
import { NavMain } from "./NavMain";
import { trans } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

export function AppSidebar({ ...props }) {
    const { hasPermission } = usePermissions();

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            // {
            //     title: trans("Administration"),
            //     url: "#",
            //     icon: Settings2,
            //     isActive: false,
            //     items: [
            //         {
            //             title: trans("admin:Document_Type"),
            //             url: "/document-types",
            //         },
            //         {
            //             title: trans("admin:Security_Level"),
            //             url: "/security-levels",
            //         },
            //         {
            //             title: trans("admin:External_Organization"),
            //             url: "/external-organizations",
            //         },
            //     ],
            //     canView: hasPermission("view_list_administration"),
            // },
            {
                title: trans("User Management"),
                url: "#",
                icon: User,
                items: [
                    {
                        title: trans("admin:Users"),
                        url: route("users.index"),
                    },
                    {
                        title: trans("Roles"),
                        url: "/roles",
                    },
                ],
                canView: hasPermission("view_list_user_management"),
            },
            // {
            //     title: trans("report:Reports"),
            //     url: "#",
            //     icon: FileChartColumn,
            //     items: [
            //         {
            //             title: trans("report:Report", {
            //                 name: trans("Document"),
            //             }),
            //             url: "/reports/document",
            //         },
            //     ],
            //     canView: hasPermission("view_list_reports"),
            // },
        ],
        sidebarLinks: [
            {
                name: trans("Dashboard"),
                url: "/dashboard",
                icon: LayoutDashboard,
                canView: true,
            },
            {
                name: "Services categories",
                url: "/service-categories",
                icon: FileChartColumn,
                canView: hasPermission("view_list_services"),
            },
            {
                name: "Services",
                url: "/services",
                icon: FileChartColumn,
                canView: true,
            },
            {
                name:  "Appointments" ,
                url: "/appointments",
                icon: CalendarCog,
                canView: true,
            },
            {
                name:  "Postal Codes" ,
                url: "/postal-codes",
                icon: MapPinPlus,
                canView: true,
            },
            {
                name:  "Holidays" ,
                url: "/holidays",
                icon: CalendarCog,
                canView: true,
            },
            {
                name:  "Logs" ,
                url: route('logs.index'),
                icon: FileText,
                canView: true,
            },
        ],
    };
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* <h2 className="m-3 font-bold">Lelam MIS</h2> */}
                {/* <TeamSwitcher teams={data.teams} /> */}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data} />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}