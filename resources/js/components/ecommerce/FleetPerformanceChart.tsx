import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import api from '../../services/api';
import Select from '../form/Select';

interface MonthlyPerformanceData {
    month: number;
    issues_count: number;
    work_orders_count: number;
}

interface FleetPerformanceResponse {
    status: boolean;
    data: MonthlyPerformanceData[];
    year: number;
}

export default function FleetPerformanceChart() {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<MonthlyPerformanceData[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 10; i++) {
            years.push({
                value: (currentYear - i).toString(),
                label: (currentYear - i).toString(),
            });
        }
        return years;
    }, []);

    const fetchFleetPerformance = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<FleetPerformanceResponse>('/get-fleet-performance', {
                params: {
                    year: currentYear
                }
            });

            if (response.data.status && response.data.data) {
                setMonthlyData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching fleet performance:', error);
        } finally {
            setLoading(false);
        }
    }, [currentYear]);

    useEffect(() => {
        fetchFleetPerformance();
    }, [fetchFleetPerformance]);

    const issuesData = useMemo(() => {
        return monthlyData.map(item => item.issues_count);
    }, [monthlyData]);

    const workOrdersData = useMemo(() => {
        return monthlyData.map(item => item.work_orders_count);
    }, [monthlyData]);

    const options: ApexOptions = {
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
        colors: ["#EB5757", "#3C247D"],
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
            name: "Issues",
            data: issuesData,
        },
        {
            name: "Work Orders",
            data: workOrdersData,
        },
    ];
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6 min-h-[422px]">
            <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">

                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                        Fleet Management
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <div className="">
                            <Select
                                variant="outline"
                                options={availableYears}
                                placeholder="Select Year"
                                onChange={(value) => setCurrentYear(parseInt(value))}
                                defaultValue={currentYear.toString()}
                            />
                        </div>
                    </div>


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
