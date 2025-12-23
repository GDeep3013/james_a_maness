import type React from "react";
import type { FC } from "react";

interface InputProps {
    type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    min?: string;
    max?: string;
    maxLength?: number;
    step?: number;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string;
}

const Input: FC<InputProps> = ({
    type = "text",
    size = "md",
    id,
    name,
    placeholder,
    value,
    onChange,
    className = "",
    min,
    max,
    maxLength,
    step,
    disabled = false,
    success = false,
    error = false,
    hint,
}) => {


    const sizeClasses = {
        xs: "h-6",
        sm: "h-10",
        md: "h-12",
        lg: "h-14",
        xl: "h-16",
        xxl: "h-18",
    };


    let inputClasses = ` ${sizeClasses[size]} w-full rounded-[4px] border appearance-none px-4 py-0 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-0  ${className}`;

    if (disabled) {
        inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed opacity-40`;
    } else if (error) {
        inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 `;
    } else if (success) {
        inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20`;
    } else {
        inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20`;
    }

    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                maxLength={maxLength}
                step={step}
                disabled={disabled}
                className={inputClasses}
            />

            {hint && (
                <p
                    className={`text-xs ${error
                            ? "text-error-500"
                            : success
                                ? "text-success-500"
                                : "text-gray-500"
                        }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;
