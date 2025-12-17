import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import api from '../../services/api';
import Select from '../form/Select';

interface MonthlyData {
    month: number;
    work_orders_total: number;
    fuels_total: number;
    total: number;
}

interface TotalCostsResponse {
    status: boolean;
    data: MonthlyData[];
    year_to_date_total: number;
    year: number;
}

export default function TotalCostMap() {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [yearToDateTotal, setYearToDateTotal] = useState(0);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    // const showWorkOrders = false;
    // const showFuels = false;
    const showTotal = true;

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

    const fetchTotalCosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<TotalCostsResponse>('/get-total-costs', {
                params: { year: currentYear }
            });

            if (response.data.status && response.data.data) {
                setMonthlyData(response.data.data);
                setYearToDateTotal(response.data.year_to_date_total || 0);
            }
        } catch (error) {
            console.error('Error fetching total costs:', error);
        } finally {
            setLoading(false);
        }
    }, [currentYear]);

    useEffect(() => {
        fetchTotalCosts();
    }, [fetchTotalCosts]);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartSeries = useMemo(() => {
        const series = [];

        // if (showWorkOrders) {
        //     series.push({
        //         name: "Work Orders",
        //         data: monthlyData.map(item => item.work_orders_total),
        //     });
        // }

        // if (showFuels) {
        //     series.push({
        //         name: "Fuels",
        //         data: monthlyData.map(item => item.fuels_total),
        //     });
        // }

        if (showTotal) {
            series.push({
                name: "Total",
                data: monthlyData.map(item => item.total ? Math.round(item.total) : 0),
            });
        }

        return series;
    }, [monthlyData, showTotal]);

    const chartColors = useMemo(() => {
        const colors = [];
        // if (showWorkOrders) colors.push("#F59E0B");
        // if (showFuels) colors.push("#10B981");
        if (showTotal) colors.push("#3C247D");
        return colors.length > 0 ? colors : ["#3C247D"];

    }, [showTotal]);

    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            height: 280,
            toolbar: { show: false },
            stacked: false,
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
        colors: chartColors,
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: chartSeries.length > 1 ? "60%" : "67%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: "#eee",
        },
        legend: {
            show: chartSeries.length > 1,
            position: "top",
            horizontalAlign: "right",
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6 min-h-[422px]">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
                       Total Cost  <small className='text-sm text-[#595959] font-normal'>     {formatCurrency(yearToDateTotal)}</small>
                    </h3>
                </div>
                <div className="flex items-start w-full gap-2 sm:justify-end">

                    <div className="w-full sm:w-48 text-end">
                        <Select
                            variant='outline'
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
                        <div className="flex items-center justify-center h-[280px]">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Loading chart data...
                                </p>
                            </div>
                        </div>
                    ) : chartSeries.length === 0 ? (
                        <div className="flex items-center justify-center h-[280px]">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Please select at least one expense type to display
                            </p>
                        </div>
                    ) : (
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="bar"
                            height={280}
                        />
                    )}
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
