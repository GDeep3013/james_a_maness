import React from 'react'
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function TotalCostMap() {
    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            height: 280,
            toolbar: { show: false },
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
        colors: ["#3C247D"],
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "45%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: "#eee",
        },
    };

    const chartSeries = [
        {
            name: "Total Cost",
            data: [5000,
                16000,
                7000,
                16000,
                12000,
                7000,
                5000,
                7000,
                16000,
                12000,
                7000,
                5000],
        },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 min-h-[422px]">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Total Costs
                    </h3>

                </div>
                <div className="flex items-start w-full gap-3 sm:justify-end">
                    <p className="mt-1 text-[#5321B1] text-base font-bold dark:text-gray-400">
                        $126,400 <small className='text-sm text-[#595959] font-normal'>Year to date</small>
                    </p>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="bar"
                        height={280}
                    />
                </div>
            </div>
        </div>
        // <div className="total-costs-card">
        //     <div className="card-header">
        //         <h3>Total Costs</h3>
        //         <span className="total-amount">
        //             $126,400 <small>Year to date</small>
        //         </span>
        //     </div>

        //     <Chart
        //         options={chartOptions}
        //         series={chartSeries}
        //         type="bar"
        //         height={280}
        //     />
        // </div>
    );
}
