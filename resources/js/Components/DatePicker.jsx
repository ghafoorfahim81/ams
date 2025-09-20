import React, { useState } from "react";
import {cn, locale, trans} from "@/lib/utils.js";
import transition from "react-element-popper/animations/transition";
import opacity from "react-element-popper/animations/opacity";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { DateObject } from "react-multi-date-picker";
import Error from "./Error";
import {Label} from "@/Components/ui/label.jsx";

const afghanLocale = {
    name: "afghan",
    months: [
        ["حمل"],
        ["ثور"],
        ["جوزا"],
        ["سرطان"],
        ["اسد"],
        ["سنبله"],
        ["میزان"],
        ["عقرب"],
        ["قوس"],
        ["جدی"],
        ["دلو"],
        ["حوت"],
    ],
    weekDays: [
        ["Shanbe", "شن"],
        ["Yekshanbe", "یک"],
        ["Doshanbe", "دو"],
        ["Seshanbe", "سه"],
        ["Chaharshanbe", "چه"],
        ["Panjshanbe", "پن"],
        ["Jom'a", "جم"],
    ],
    digits: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    meridiem: ["ق.ظ", "ب.ظ"],
};

const ReactDatePicker = ({
    id,
    label,
    placeholder,
    error,
    value,
    onChange,
}) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        if (onChange) {
            onChange(date, id); // Pass the date to the parent's onChange handler
        }
    };
    const parsedValue = value
        ? new DateObject({ date: new Date(value), calendar: persian })
        : null;

    return (
        <div className='flex flex-col space-y-1 min-w-[150px]'>

            <Label
                htmlFor={id}
                className={cn("mb-1 cursor-pointer text-nowrap")}
            >
                {label || trans("Date")}
            </Label>
            <DatePicker
                value={parsedValue}
                id={id}
                inputClass="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                onChange={handleDateChange}
                calendar={persian}
                locale={afghanLocale}
                calendarPosition="bottom-right"
                placeholder={
                    placeholder || trans("Enter", { text: trans("Date") })
                }
                format="YYYY/MM/DD"
                animations={[
                    opacity(),
                    transition({ from: 35, duration: 800 }),
                ]}

            />
            <Error error={error} />
        </div>
    );
};

export default ReactDatePicker;
