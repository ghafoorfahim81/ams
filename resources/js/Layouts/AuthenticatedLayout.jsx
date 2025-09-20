import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/Components/AppSidebar";
import { Separator } from "@/Components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { House } from "lucide-react";
import { Toaster } from "@/Components/ui/toaster";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/Components/ThemeProvider";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { toast } = useToast();

    const { i18n } = useTranslation();

    useEffect(() => {
        // Echo.private(`document-overdue.${user.id}`)
        //     .listen('DocumentOverdue',event =>{
        //     })

        document.documentElement.lang = i18n.language;
        document.documentElement.dir =
            i18n.language === "fa" || i18n.language === "ps" ? "rtl" : "ltr";
    }, [i18n.language, user?.id]);

    return (
        <div className="min-h-screen bg-gray-100">
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <SidebarProvider>
                    <div className="relative bg-background">
                        <AppSidebar className="absolute" />
                    </div>
                    <SidebarInset>
                        <Navbar user={user} />
                        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
                            <div className="">
                                {header && (
                                    <header className="border-gray-200 bg-background p4-10 border-y">
                                        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                            {header}
                                        </div>
                                    </header>
                                )}
                            </div>
                            <main>{children}</main>
                            <Toaster />
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider>
        </div>
    );
}
