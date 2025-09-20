import { trans } from "@/lib/utils";
import React from "react";

const NavbarHeader = () => {
    return (
        <div className="flex items-center">
            <h1 className="mx-3 text-lg font-bold text-primary">
                {trans("app:Navbar_Text")}
            </h1>
            <img src=" " alt="logo" className="rounded-md w-14 ms-4" />
        </div>
    );
};

export default NavbarHeader;
