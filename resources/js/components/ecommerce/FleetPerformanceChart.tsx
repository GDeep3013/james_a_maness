import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import api from '../../services/api';

interface MonthlyPerformanceData {
    month: number;
    inactive_count: number;
    available_count: number;
}

interface FleetPerformanceResponse {
    status: boolean;
    data: MonthlyPerformanceData[];
}

export default function FleetPerformanceChart() {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<MonthlyPerformanceData[]>([]);

    const fetchFleetPerformance = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<FleetPerformanceResponse>('/get-fleet-performance');

            if (response.data.status && response.data.data) {
                setMonthlyData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching fleet performance:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFleetPerformance();
    }, [fetchFleetPerformance]);

    const inactiveData = useMemo(() => {
        return monthlyData.map(item => item.inactive_count);
    }, [monthlyData]);

    const availableData = useMemo(() => {
        return monthlyData.map(item => item.available_count);
    }, [monthlyData]);

    const options: ApexOptions = {
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
        colors: ["#EB5757", "#10B981"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "straight",
            width: [2, 2],
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: "category",
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
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
            },
            title: {
                text: "",
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    const series = [
        {
            name: "Inactive (In Maintenance)",
            data: inactiveData,
        },
        {
            name: "Available",
            data: availableData,
        },
    ];
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6 min-h-[422px]">
            <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Fleet Management
                </h3>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-[310px]">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Loading chart data...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Chart options={options} series={series} type="area" height={310} />
                    )}
                </div>
            </div>
        </div>
    );
}
