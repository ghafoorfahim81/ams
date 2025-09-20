import React from "react";

const Header = ({ text }) => {
    return (
        <h2 className="flex items-center text-xl font-semibold leading-tight text-primary">
            {text}
        </h2>
    );
};

export default Header;
