import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  variant?: "default" | "outline";
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  variant="default",
  disabled = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
  };

  const variantClass = {
    default: "w-full border border-gray-300 focus:border-brand-300 focus:ring-0 px-4 py-2.5",
    outline: "w-auto border-b border-gray-300 focus:border-brand-300 focus:outline-hidden focus:ring-0 rounded-none",
    none: "border-none focus:border-brand-300 focus:outline-hidden focus:ring-0",
  };

  return (
    <select
      className={`h-11  rounded-lg ${variantClass[variant]} text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-0 ${
        selectedValue
          ? "text-gray-800"
          : "text-gray-400"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
