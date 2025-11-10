import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MaintenanceCostChart() {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            toolbar: { show: false },
        },

        labels: ["Preventive", "Repair", "Other"],

        colors: ["#3D007A", "#F2994A", "#BCC3D1"],

        legend: {
            show: false, // We are using custom text rows under chart
        },

        stroke: {
            width: 2,
            colors: ["#fff"],
        },

        dataLabels: {
            enabled: false,
        },

        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                },
            },
        },

        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: { width: 240 }
                }
            }
        ]
    };

    const series = [50, 20, 30]; // 50% / 20% / 30% affect display

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3">
                Maintenance Cost
            </h3>

            {/* Chart */}
            <div className="flex justify-center mb-5">
                <Chart options={options} series={series} type="donut" height={240} />
            </div>

            {/* Footer Text */}
            <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Preventive vs. Repair</span>
                <span className="font-medium">75% / 25%</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700">
                <span>Cost per Mile</span>
                <span className="font-medium">
                    $0.12 <span className="text-blue-500 text-xs">−8% YTD</span>
                </span>
            </div>
        </div>
    );
}
