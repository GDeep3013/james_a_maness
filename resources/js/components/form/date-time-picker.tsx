import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
    id: string;
    onChange?: Hook | Hook[];
    defaultDate?: DateOption;
    label?: string;
    placeholder?: string;
    enableTime?: boolean;
    time_24hr?: boolean;
    dateFormat?: string;
    minDate?: boolean;
};

export default function DateTimePicker({
    id,
    onChange,
    label,
    defaultDate,
    placeholder,
    enableTime = true,
    time_24hr = false,
    dateFormat = "Y-m-d H:i",
    minDate = false,
}: PropsType) {
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Normalize saved date
        const savedDate =
            defaultDate instanceof Date
                ? new Date(defaultDate.getTime())
                : null;

        if (savedDate) savedDate.setHours(0, 0, 0, 0);

        const flatPickr = flatpickr(`#${id}`, {
            mode: "single",
            static: true,
            monthSelectorType: "static",
            enableTime,
            time_24hr,
            dateFormat,
            defaultDate,
            onChange,

            disable: minDate
                ? [
                    (date: Date) => {
                        date.setHours(0, 0, 0, 0);

                        // Disable all dates before savedDate if exists, else before today
                        if (savedDate) {
                            if (date < savedDate) return true;

                            // Disable all dates between savedDate and today (inclusive)
                            if (date > savedDate && date <= today) return true;
                        } else {
                            // No savedDate → disable all dates before today
                            if (date < today) return true;
                        }

                        return false; // enable all other dates
                    },
                ]
                : [],
        });

        return () => {
            if (!Array.isArray(flatPickr)) {
                flatPickr.destroy();
            }
        };
    }, [onChange, id, defaultDate, enableTime, time_24hr, dateFormat, minDate]);

    return (
        <div className="flatpickr-wrapper">
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <input
                    id={id}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"
                />

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                </span>
            </div>
        </div>
    );
}

