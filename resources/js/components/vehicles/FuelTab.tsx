import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { fuelService } from '../../services/fuelService';
import Button from '../ui/button/Button';
import { formatDate, capitalizeFirst } from '../../utilites';
import { FuelRecord } from '../../types/FuelRecordTypes';
import { PaginationData } from '../common/TableFooter';

interface FuelTabProps {
    activeTab: string;
}

export default function FuelTab({ activeTab }: FuelTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingFuel, setLoadingFuel] = useState(false);
    const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
    const [fuelPagination, setFuelPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [fuelCurrentPage, setFuelCurrentPage] = useState(1);

    const renderPagination = (
        pagination: PaginationData,
        currentPage: number,
        setCurrentPage: (page: number) => void,
        loading: boolean
    ) => {
        const pages: number[] = [];
        const maxPages = 5;
        let startPage = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
        const endPage = Math.min(pagination.last_page, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="min-height-[34px] !leading-[34px]"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.last_page || loading}
                        className="min-height-[34px] !leading-[34px]"
                    >
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                                {pagination.total === 0
                                    ? 0
                                    : (pagination.current_page - 1) * pagination.per_page + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(
                                    pagination.current_page * pagination.per_page,
                                    pagination.total
                                )}
                            </span>{" "}
                            of <span className="font-medium">{pagination.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="rounded-r-none min-height-[34px] !leading-[34px]"
                            >
                                Previous
                            </Button>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    disabled={loading}
                                    className="rounded-none border-l-0 min-height-[34px] !leading-[34px]"
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === pagination.last_page || loading}
                                className="rounded-l-none border-l-0 min-height-[34px] !leading-[34px]"
                            >
                                Next
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchFuelRecords = async () => {
            if (!id || activeTab !== 'fuel') return;

            setLoadingFuel(true);
            try {
                const response = await fuelService.getAll({
                    page: fuelCurrentPage,
                    search: '',
                });
                const data = response.data;

                if (data.status && data.fuel) {
                    setFuelRecords(data.fuel.data || []);
                    setFuelPagination({
                        current_page: data.fuel.current_page,
                        last_page: data.fuel.last_page,
                        per_page: data.fuel.per_page,
                        total: data.fuel.total,
                    });
                } else {
                    setFuelRecords([]);
                }
            } catch (error) {
                console.error('Failed to load fuel records:', error);
                setFuelRecords([]);
            } finally {
                setLoadingFuel(false);
            }
        };

        fetchFuelRecords();
    }, [id, activeTab, fuelCurrentPage]);

    if (activeTab !== 'fuel') {
        return null;
    }

    const getUnitLabel = (unitType: string) => {
        if (unitType === 'us_gallons') return 'gal';
        if (unitType === 'liters') return 'L';
        if (unitType === 'uk_gallons') return 'gal (UK)';
        return 'gal';
    };

    return (
            <>
                {loadingFuel ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    <p className="mt-2 text-sm text-gray-600">Loading fuel records...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : fuelRecords.length === 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-600">No fuel records found</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4">
                            {fuelRecords.map((record) => {
                                const totalCost = record.units * record.price_per_volume_unit;
                                const unitLabel = getUnitLabel(record.unit_type);
                                
                                return (
                                    <div
                                        key={record.id}
                                        className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className='w-full'>
                                                <p className="text-base font-medium text-[#1D2939] mb-1">
                                                Vendor - {record.vendor?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className='w-full'>
                                                <p className="text-sm text-gray-500 mb-1">Date</p>
                                                <p className="text-sm text-gray-800">
                                                    {formatDate(record.date)}
                                                </p>
                                            </div>

                                            <div className='w-full'>
                                                <p className="text-sm text-gray-500 mb-1">Gallons</p>
                                                <p className="text-base text-gray-800">
                                                    {record.units} {unitLabel}
                                                </p>
                                            </div>
                                            <div className='w-full'>
                                                <p className="text-sm text-gray-500 mb-1">Cost</p>
                                                <p className="text-base text-gray-800">
                                                    ${totalCost.toFixed(2)}
                                                </p>
                                            </div>
                                        
                                            <div className='w-full'>
                                                <p className="text-sm text-gray-500 mb-1">Fuel Type</p>
                                                <p className="text-sm text-gray-800">
                                                    {capitalizeFirst(record.fuel_type) || 'N/A'}
                                                </p>
                                            </div>
                                            <div className='w-full'>
                                                <p className="text-sm text-gray-500 mb-1">Odometer</p>
                                                <p className="text-sm text-gray-800">
                                                    {record.vehicle_meter || 'N/A'}
                                                </p>
                                            </div>

                                            {record.price_per_volume_unit && (
                                                <div className='w-full'>
                                                    <p className="text-sm text-gray-500 mb-1">Price/Unit</p>
                                                    <p className="text-sm text-gray-800">
                                                        ${Number(record.price_per_volume_unit).toFixed(2)}/{unitLabel}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        
                                    </div>
                                );
                            })}
                        </div>
                        {fuelRecords.length > 0 && renderPagination(fuelPagination, fuelCurrentPage, setFuelCurrentPage, loadingFuel)}
                    </>
                )}
            </>
    );
}

