import { trans } from "@/lib/utils";
import React from "react";

const ItemsHeader = ({ title, grandTotal, isAuction=false }) => {
    return (
        <div className="flex justify-between me-20">
            <h2 className="font-bold">{title}:</h2>
            <div className="flex">
                <h3>
                    { !isAuction?trans("Grand_Total"):trans('auction:Fc1_Price') }

                    :</h3>
                <span className="ms-2">{grandTotal}</span>
            </div>
        </div>
    );
};

export default ItemsHeader;
