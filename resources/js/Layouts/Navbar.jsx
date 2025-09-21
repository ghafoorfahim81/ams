import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Separator } from "@/Components/ui/separator";
import { SidebarTrigger } from "@/Components/ui/sidebar";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { useState } from "react";
import { trans } from "@/lib/utils";
import NavbarHeader from "./NavbarHeader";
import { ModeToggle } from "@/Components/ModeToggle";
import { Bell } from "lucide-react";
import Notification from "@/Components/Notification.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Link } from "@inertiajs/react";

const Navbar = ({ user }) => {
    // We no longer need this state as the sidebar handles mobile responsiveness
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false); 
        
    // --- FIX: Use user.full_name as per the database schema
    const name = user?.full_name ?? user?.email ?? 'User';
    
    return (
        <nav className="flex items-center justify-between h-16 md:h-20 gap-2 ease-linear shrink-0 p-4 bg-background border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4 me-2 hidden md:block" />
                <NavbarHeader />
            </div>
            
            <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-4 px-2">
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>
                    <ModeToggle />
                </div>
                <div className="flex justify-between items-center h-16">
                    <Notification />
                    <div className="relative ms-3">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-300 transition duration-150 ease-in-out bg-white dark:bg-zinc-800 border border-transparent rounded-full hover:text-gray-700 focus:outline-none"
                                >
                                    <Avatar className="w-8 h-8">
                                        {/* You can use a URL for the avatar if available */}
                                        <AvatarImage src={`https://placehold.co/150x150/1d4ed8/FFFFFF?text=${name.charAt(0)}`} alt={name} />
                                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden lg:inline-block">
                                        {name}
                                    </span>
                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4 hidden lg:inline-block"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link
                                    href={route("profile.edit")}
                                >
                                    {trans("Profile")}
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    {trans("Logout")}
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>
            
            {/* The mobile navigation dropdown is now part of the AppSidebar component */}
            <div
                className={
                    (showingNavigationDropdown ? "block" : "hidden") +
                    " sm:hidden"
                }
            >
                {/* This section is now deprecated, its functionality is handled by the sidebar */}
            </div>
        </nav>
    );
};

export default Navbar;
