import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import api from '../../services/api';
import Select from '../form/Select';
import { vehicleService } from '../../services/vehicleService';

interface MaintenanceCostsResponse {
    status: boolean;
    data: {
        labor_cost: number;
        parts_cost: number;
        fuel_cost: number;
    };
    year: number;
    vehicle_id?: number;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
}

export default function MaintenanceCostChart() {
    const [loading, setLoading] = useState(true);
    const [costs, setCosts] = useState({
        labor_cost: 0,
        parts_cost: 0,
        fuel_cost: 0,
    });
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

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

    const vehicleOptions = useMemo(() => {
        const options = [
            { value: "", label: "All Vehicles" }
        ];
        return options.concat(
            vehicles.map((vehicle) => ({
                value: vehicle.id.toString(),
                label: vehicle.vehicle_name,
            }))
        );
    }, [vehicles]);

    const fetchVehicles = useCallback(async () => {
        try {
            const response = await vehicleService.getAll({ page: 1 });
            if (response.data?.status && response.data?.vehical?.data) {
                setVehicles(response.data.vehical.data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const fetchMaintenanceCosts = useCallback(async () => {
        setLoading(true);
        try {
            const params: { year: number; vehicle_id?: string } = { year: currentYear };
            if (selectedVehicleId) {
                params.vehicle_id = selectedVehicleId;
            }

            const response = await api.get<MaintenanceCostsResponse>('/get-maintenance-costs', {
                params
            });

            if (response.data.status && response.data.data) {
                setCosts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching maintenance costs:', error);
        } finally {
            setLoading(false);
        }
    }, [currentYear, selectedVehicleId]);

    useEffect(() => {
        fetchMaintenanceCosts();
    }, [fetchMaintenanceCosts]);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const totalCost = useMemo(() => {
        return costs.labor_cost + costs.parts_cost + costs.fuel_cost;
    }, [costs]);

    const series = useMemo(() => {
        if (totalCost === 0) return [0, 0, 0];
        return [
            costs.labor_cost,
            costs.parts_cost,
            costs.fuel_cost,
        ];
    }, [costs, totalCost]);

    const percentages = useMemo(() => {
        if (totalCost === 0) return { labor: 0, parts: 0, fuel: 0 };
        return {
            labor: Math.round((costs.labor_cost / totalCost) * 100),
            parts: Math.round((costs.parts_cost / totalCost) * 100),
            fuel: Math.round((costs.fuel_cost / totalCost) * 100),
        };
    }, [costs, totalCost]);

    const options: ApexOptions = {
        chart: {
            type: "donut",
            toolbar: { show: false },
        },
        labels: ["Labor Cost", "Parts Cost", "Fuel Cost"],
        colors: ["#34c394", "#F2994A", "#BCC3D1"],
        legend: {
            show: false,
        },
        stroke: {
            width: 4,
            colors: ["#fff"],
        },
        dataLabels: {
            enabled: true,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "60%",
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

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-gray-800">
                    Maintenance Cost
                </h3>

                <div className="flex flex-row sm:flex-row gap-2">

                        <Select
                            variant="outline"
                            options={vehicleOptions}
                            placeholder="Select Vehicle"
                            onChange={(value) => setSelectedVehicleId(value)}
                        defaultValue={selectedVehicleId}
                        className="min-w-[115px]"
                        />
                        <Select
                            variant="outline"
                            options={availableYears}
                            placeholder="Select Year"
                            onChange={(value) => setCurrentYear(parseInt(value))}
                            defaultValue={currentYear.toString()}
                        />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-[240px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            Loading...
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-center mb-5">
                        <Chart options={options} series={series} type="donut" height={240} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                            <span>Labor Cost</span>
                            <span className="font-medium">
                                {formatCurrency(costs.labor_cost)}
                                <span className="text-gray-500 ml-1">({percentages.labor}%)</span>
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                            <span>Parts Cost</span>
                            <span className="font-medium">
                                {formatCurrency(costs.parts_cost)}
                                <span className="text-gray-500 ml-1">({percentages.parts}%)</span>
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                            <span>Fuel Cost</span>
                            <span className="font-medium">
                                {formatCurrency(costs.fuel_cost)}
                                <span className="text-gray-500 ml-1">({percentages.fuel}%)</span>
                            </span>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <div className="flex justify-between text-sm font-semibold text-gray-800 dark:text-white/90">
                                <span>Total</span>
                                <span>{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
