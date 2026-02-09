import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "../../icons";
import { useNavigate, useParams } from "react-router";
import { fuelService } from "../../services/fuelService";

interface Fuel {
    id: number;
    vehicle_id: number;
    vendor_id: number;
    fuel_type: string;
    unit_type: string;
    units: number;
    price_per_volume_unit: number;
    vehicle_meter: string;
    notes?: string;
    date: string;
    vehicle?: {
        id: number;
        vehicle_name: string;
    };
    vendor?: {
        id: number;
        name: string;
    };
    created_at?: string;
}

export default function FuelDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fuel, setFuel] = useState<Fuel | null>(null);
    const calculateTotalCost = (units: number, pricePerUnit: number) => {
        return (units * pricePerUnit).toFixed(2);
    };
    useEffect(() => {
        const fetchFuels = async () => {
            const response = await fuelService.getById(parseInt(id || '0'));
            setFuel(response.data.fuel);
        };
        fetchFuels();
    }, [id]);

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/fuels")}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Fuel Detail
                    </h1>
                </div>
            </div>

            <div className="flex md:flex-nowrap flex-wrap gap-6 mt-6">
                <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 max-w-[767px]:max-w-full lg:max-w-[387px] max-w-full w-full">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">All Details</h3>
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4 md:block" key={fuel?.id}>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.vehicle?.vehicle_name || `Vehicle #${fuel?.vehicle_id}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vendor</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.vendor?.name || `Vendor #${fuel?.vendor_id}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.fuel_type || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.date || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Unit Type</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.unit_type || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Units</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.units || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Price Per Unit</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.price_per_volume_unit || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle Meter Reading</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {fuel?.vehicle_meter || `--`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Cost</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${calculateTotalCost(fuel?.units || 0, fuel?.price_per_volume_unit || 0)}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Notes</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel?.notes || '--'}
                            </span>
                        </div>

                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 w-full lg:p-6 p-3">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <span className="text-sm text-gray-500">Volume</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">143.127</span>
                                <span className="text-xs text-gray-400">gallons (US)</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Fuel Price</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    ${fuel?.price_per_volume_unit || 0}
                                    </span>
                                <span className="text-xs text-gray-400">/gallon</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Total</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                ${calculateTotalCost(fuel?.units || 0, fuel?.price_per_volume_unit || 0)}
                                    </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Usage</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {fuel?.vehicle_meter || 0}
                                    </span>
                                <span className="text-xs text-gray-400">miles</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Fuel Economy</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">0.78</span>
                                <span className="text-xs text-gray-400">mpg (US)</span>
                            </div>
                            <div className="text-xs text-success-600 flex items-center mt-1">
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Cost</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">6.75</span>
                                <span className="text-xs text-gray-400">/ mile</span>
                            </div>
                            <div className="text-xs text-success-600 flex items-center mt-1">
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Notes</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {fuel?.notes || '--'}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
