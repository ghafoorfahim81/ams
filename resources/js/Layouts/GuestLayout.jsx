import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import React from "react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex items-center justify-center min-h-screen pt-4 background3 sm:pt-0">
            {children}
        </div>
    );
}
