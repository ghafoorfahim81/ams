import { trans } from "@/lib/utils";
import React from "react";
import { Link } from "@inertiajs/react";
import { GraduationCap } from "lucide-react";

const NavbarHeader = () => {
    return (
        <div className="flex items-center gap-2">
            <Link href={route("dashboard")}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-600 text-white shadow-lg shrink-0">
                    <GraduationCap size={28} />
                </div>
            </Link>
            <h1 className="text-lg font-bold text-primary hidden sm:block">
                {trans("app:Navbar_Text")}
            </h1>
        </div>
    );
};

export default NavbarHeader;