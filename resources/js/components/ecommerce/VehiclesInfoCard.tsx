import React from "react";

export default function VehiclesInfoCard() {
    const fuelValue = 92; // %

    const stats = [
        { value: 7, label: "Active Vehicles", color: "text-[#3C247D]" },
        { value: 2, label: "Maintenance Vehicles", color: "text-[#F2994A]" },
        { value: 1, label: "Available Vehicles", color: "text-[#3C247D]" },
        { value: 0, label: "Out of Service", color: "text-[#F2994A]" }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-10 dark:border-gray-800 dark:bg-white/[0.03]">

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
                Vehicles Info
            </h3>

            {/* ✅ Stats Box Group — Height Increased */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl bg-gray-50 p-6 min-h-[140px] flex flex-col justify-center text-center dark:bg-white/[0.06]"
                    >
                        <p className={`text-3xl font-semibold mb-2 ${item.color}`}>
                            {item.value}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-white/80 leading-tight">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <hr className="mb-6" />

            {/* ✅ Increased gap between Stats group and Progress bar */}
            <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white/90 mb-3">
                <span>Fuel Efficiency</span>
                <span className="text-[#F2994A]">{fuelValue}%</span>
            </div>

            {/* Progress Bar — thicker */}
            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#0D0A25]"
                    style={{ width: `${fuelValue}%` }}
                ></div>
            </div>

        </div>
    );
}
