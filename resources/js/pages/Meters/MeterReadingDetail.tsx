import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "../../icons";
import { useNavigate, useParams } from "react-router";
import { meterReadingService } from "../../services/meterReadingService";

interface MeterReading {
    id: number;
    user_id: number;
    vehicle_id: number;
    vehicle_meter: string;
    date: string;
    vehicle?: {
        id: number;
        vehicle_name: string;
    };
    user?: {
        id: number;
        name: string;
    };
    created_at?: string;
}

export default function MeterReadingDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [meterReading, setMeterReading] = useState<MeterReading | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMeterReading = async () => {
            setIsLoading(true);
            try {
                const response = await meterReadingService.getById(parseInt(id || '0'));
                setMeterReading(response.data.meterReading);
            } catch (error) {
                console.error("Failed to load meter reading:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMeterReading();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Loading meter history details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/meter-history")}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Meter History Detail
                    </h1>
                </div>
            </div>

            <div className="flex md:flex-nowrap flex-wrap gap-6 mt-6">
                <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 max-w-[767px]:max-w-full lg:max-w-[387px] max-w-full w-full">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">All Details</h3>
                    <div className="space-y-4" key={meterReading?.id}>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Reading ID</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                #{meterReading?.id}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {meterReading?.vehicle?.vehicle_name || `Vehicle #${meterReading?.vehicle_id}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Meter Reading</span>
                            <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                                {meterReading?.vehicle_meter || '--'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {meterReading?.date ? formatDate(meterReading.date) : '--'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Recorded By</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {meterReading?.user?.name || `User #${meterReading?.user_id}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Recorded At</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {meterReading?.created_at ? formatDateTime(meterReading.created_at) : '--'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 w-full lg:p-6 p-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Information</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Vehicle Odometer</span>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="md:text-3xl text-2xl font-semibold text-gray-900 dark:text-white">
                                    {meterReading?.vehicle_meter || '0'}
                                </span>
                                <span className="text-sm text-gray-400 mb-1">miles</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Reading Date</span>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="md:text-lg text-base font-medium text-gray-900 dark:text-white">
                                    {meterReading?.date ? formatDate(meterReading.date) : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Vehicle</span>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="md:text-lg text-base font-medium text-gray-900 dark:text-white">
                                    {meterReading?.vehicle?.vehicle_name || `Vehicle #${meterReading?.vehicle_id}`}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Recorded By</span>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="md:text-lg text-base font-medium text-gray-900 dark:text-white">
                                    {meterReading?.user?.name || `User #${meterReading?.user_id}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">About Meter Readings</h4>
                                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                                    Regular meter readings help track vehicle usage and maintenance schedules. This reading was recorded on {meterReading?.created_at ? formatDateTime(meterReading.created_at) : 'an unknown date'}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
