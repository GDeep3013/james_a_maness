import React from 'react';

type BadgeVariant = "light" | "solid" | "outline";
type BadgeSize = "sm" | "md";
type BadgeColor =
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "light"
    | "dark"
    |"high";

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    color?: BadgeColor;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    variant = "light",
    color = "primary",
    size = "md",
    startIcon,
    endIcon,
    children,
}) => {
    const baseStyles =
        "inline-flex min-w-[106px] min-h-[28px] items-center px-2.5 text-sm justify-center gap-1 border-[0.79px] border-[#E2E8F0]";

    const sizeStyles = {
        sm: "text-theme-xs",
        md: "text-sm",
    };

    const variants = {
        light: {
            primary:
                "bg-brand-50 text-brand-500 rounded-full",
            success:
                "bg-success-50 text-success-600 rounded-full",
            error:
                "bg-error-50 text-error-600 rounded-full",
            warning: "bg-[#FEF9C3] text-warning-600 rounded-full",
            high: "bg-[#FFEDD4] text-[#CA3500] rounded-full",
            info: "bg-blue-light-50 text-blue-light-500 rounded-full",
            light: "bg-gray-100 text-gray-700 rounded-full",
            dark: "bg-gray-500 text-white rounded-full",
        },
        solid: {
            primary: "bg-brand-500 text-white dark:text-white rounded-full",
            success: "bg-success-500 text-white dark:text-white rounded-full",
            error: "bg-error-500 text-white dark:text-white rounded-full",
            warning: "bg-warning-500 text-white dark:text-white rounded-full",
            high: "bg-[#CA3500] text-white rounded-full",
            info: "bg-blue-light-500 text-white dark:text-white rounded-full",
            light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80 rounded-full",
            dark: "bg-gray-700 text-white dark:text-white rounded-full",
        },
        outline: {
            primary: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            success: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            error: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            warning: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            info: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            light: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            dark: "bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded-lg",
            high: "bg-white border border-[#CA3500] text-[#CA3500] rounded-lg",
        },
    };

    const sizeClass = sizeStyles[size];
    const colorStyles = variants[variant][color];

    return (
        <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
            {startIcon && <span className="mr-1">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-1">{endIcon}</span>}
        </span>
    );
};

export default Badge;
