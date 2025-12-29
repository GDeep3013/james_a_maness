import React, { useState, useEffect } from 'react';
import { fuelService } from '../../services/fuelService';
import { formatCurrency } from '../../utilites';

interface FuelStatistics {
    total_fuel_cost: number;
    total_volume: number;
    avg_fuel_economy_distance: number;
    total_distance: number;
}
interface FuelOverviewProps {
    importSuccess?: boolean;
    isRefersh: boolean;
    setIsRefersh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FuelOverview({
    importSuccess,
    isRefersh,
    setIsRefersh,
}: FuelOverviewProps) {
    const [statistics, setStatistics] = useState<FuelStatistics>({
        total_fuel_cost: 0,
        total_volume: 0,
        avg_fuel_economy_distance: 0,
        total_distance: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const fetchStatistics = async () => {
        setLoading(true);
        setError('');
        try {
            const fuelsResponse = await fuelService.getStatistics();

            const fuelsData = fuelsResponse.data;

            if (fuelsData.status && fuelsData.data) {
                setStatistics({
                    total_fuel_cost: fuelsData.data.total_fuel_cost ?? 0,
                    total_volume: fuelsData.data.total_volume ?? 0,
                    avg_fuel_economy_distance: fuelsData.data.avg_fuel_economy_distance ?? 0,
                    total_distance: fuelsData.data.totalDistance ?? 0,
                });
            } else {
                setError('Failed to load fuel statistics');
            }
        } catch {
            setError('An error occurred while loading statistics');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isRefersh) {
            fetchStatistics();
            setIsRefersh(false)
        }
    }, [isRefersh]);
    useEffect(() => {
        fetchStatistics();
    }, [importSuccess]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
                    >
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    const formatNumber = (value: number, decimals: number = 2): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    const formatVolume = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <span className="text-base font-medium text-black mb-2">Total Fuel Cost</span>
                <span className="text-[40px] font-medium text-[#1D2939]">
                    {formatCurrency(statistics.total_fuel_cost)}
                </span>
                <span className="mt-2 text-sm text-[#595959]">
                    Overall fuel expenses
                </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <span className="text-base font-medium text-black mb-2">Total Volume</span>
                <span className="text-[40px] font-medium text-[#155DFC]">
                    {formatVolume(statistics.total_volume)}
                </span>
                <span className="mt-2 text-sm text-[#595959]">gallons</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <span className="text-base font-medium text-black mb-2">Avg. Fuel Economy (Distance)</span>
                <span className="text-[40px] font-medium text-[#D08700]">
                    {formatNumber(statistics.avg_fuel_economy_distance)}
                </span>
                <span className="mt-2 text-sm text-[#595959]">mpg (US)</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <span className="text-base font-medium text-black mb-2">Total Distance</span>
                <span className="text-[40px] font-medium text-[#00A63E]">
                    {formatVolume(statistics.total_distance)}
                </span>
                <span className="mt-2 text-sm text-[#595959]">miles</span>
            </div>
        </div>
    );
}

