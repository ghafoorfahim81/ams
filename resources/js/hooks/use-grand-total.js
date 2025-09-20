import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";

const useGrandTotal = (items) => {
    const grandTotal = useMemo(() => {
        return items?.reduce(
            (total, item) =>
                total +
                (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.price??item.bill_based_price) || 0),
            0
        );
    }, [items]);

    return formatNumber(grandTotal);
};

export default useGrandTotal;
