import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/Components/ui/sidebar";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Handshake,
    HeartHandshake,
    LayoutDashboard,
    Map,
    PieChart,
    Receipt,
    Settings2,
    SquareTerminal,
    User,
    Users,
    FileChartColumn,
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
                name: "Services",
                url: "/services",
                icon: FileChartColumn,
                canView: true,
            },
            {
                name:  "Appointments" ,
                url: "/appointments",
                icon: FileChartColumn,
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
