import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { maintenanceService } from '../../services/maintenanceService';
import Button from '../ui/button/Button';
import { formatDate, formatCurrency } from '../../utilites';
import { PaginationData } from '../common/TableFooter';
import Badge from '../ui/badge/Badge';

interface MaintenanceTabProps {
    activeTab: string;
}

interface Issue {
    id: number;
    summary: string;
    description?: string;
    priority?: string;
    status?: string;
    labels?: string;
    work_order_id?: number | null;
    vehicle_id?: number;
    reported_by?: string;
    reported_date?: string;
    due_date?: string;
}

interface ServiceItem {
    id: number;
    name: string;
    type: string;
    value: string;
    label: string;
    labor_cost: number;
}

interface Vendor {
    id: number;
    name: string;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
    make?: string;
    model?: string;
    year?: string;
    license_plate?: string;
}

interface WorkOrderMaintenance {
    id: number;
    user_id?: number;
    vehicle_id: number;
    vendor_id?: number;
    status: string;
    actual_start_date?: string;
    actual_completion_date?: string;
    scheduled_start_date?: string;
    expected_completion_date?: string;
    invoice_number?: string;
    po_number?: string;
    total_value?: string | number;
    repair_priority_class?: string;
    service_items?: ServiceItem[];
    issues?: Issue[];
    vendor?: Vendor | null;
    vehicle?: Vehicle | null;
    created_at?: string;
    updated_at?: string;
}

export default function MaintenanceTab({ activeTab }: MaintenanceTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);
    const [maintenanceRecords, setMaintenanceRecords] = useState<WorkOrderMaintenance[]>([]);
    const [maintenancePagination, setMaintenancePagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

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
        const fetchMaintenanceRecords = async () => {
            if (!id || activeTab !== 'maintenance') return;
            setLoadingMaintenance(true);
            setError(null);

            try {
                const response = await maintenanceService.getAll({
                    page: maintenanceCurrentPage,
                    search: '',
                    vehicle_id: Number(id),
                });
                console.log('Response Data:', response.data);

                const data = response.data;

                if (data.status) {
                    setMaintenanceRecords(data.maintenance?.data || []);
                    setMaintenancePagination({
                        current_page: data.maintenance?.current_page || 1,
                        last_page: data.maintenance?.last_page || 1,
                        per_page: data.maintenance?.per_page || 10,
                        total: data.maintenance?.total || 0,
                    });
                } else {
                    setMaintenanceRecords([]);
                    setError(data.message || 'Failed to fetch maintenance records');
                }
            } catch (error: any) {
                console.error('Failed to load maintenance records:', error);
                setMaintenanceRecords([]);
                setError(error.response?.data?.message || 'An error occurred while fetching maintenance records');
            } finally {
                setLoadingMaintenance(false);
            }
        };

        fetchMaintenanceRecords();
    }, [id, activeTab, maintenanceCurrentPage]);

    if (activeTab !== 'maintenance') {
        return null;
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Open":
                return "warning";
            case "In Progress":
                return "info";
            case "Completed":
                return "success";
            case "Cancelled":
                return "error";
            default:
                return "warning";
        }
    };

    return (
        <>
            {loadingMaintenance ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading maintenance records...</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-red-600">{error}</p>
                                <p className="mt-2 text-sm text-gray-600">Vehicle ID: {id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : maintenanceRecords.length === 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-gray-600">No maintenance records found</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {maintenanceRecords.map((record) => {
                            const primaryService =
                                record.service_items && record.service_items.length > 0
                                    ? record.service_items.map(item => item.name).join(', ')
                                    : 'Service';
                            return (
                                <div
                                    key={record.id}
                                    className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className='w-full flex'>
                                            <p className="w-full text-base font-medium text-[#1D2939] mb-1">
                                                {primaryService}
                                            </p>
                                            <div className='w-full flex justify-end'>
                                                <Badge
                                                    size="sm"
                                                    color={getStatusColor(record.status)}
                                                >
                                                    {record.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className='w-full'>
                                            <p className="text-sm text-gray-500 mb-1">Start Date</p>
                                            <p className="text-sm text-gray-800">
                                                {record.actual_start_date ? formatDate(record.actual_start_date) : 'N/A'}
                                            </p>
                                        </div>

                                        <div className='w-full'>
                                            <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                                            <p className="text-sm text-gray-800">
                                                {record.actual_completion_date ? formatDate(record.actual_completion_date) : 'N/A'}
                                            </p>
                                        </div>

                                        <div className='w-full'>
                                            <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
                                            <p className="text-sm text-gray-800">
                                                {record.invoice_number || 'N/A'}
                                            </p>
                                        </div>

                                        <div className='w-full'>
                                            <p className="text-sm text-gray-500 mb-1">Total Cost</p>
                                            <p className="text-base text-gray-800">
                                                {record.total_value ? formatCurrency(Number(record.total_value)) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* {record.vendor && (
                                        <div className="w-full">
                                            <p className="text-sm text-gray-500">Vendor: <span className="text-gray-800 font-medium">{record.vendor.name}</span></p>
                                        </div>
                                    )} */}
                                </div>
                            );
                        })}
                    </div>
                    {maintenanceRecords.length > 0 && renderPagination(maintenancePagination, maintenanceCurrentPage, setMaintenanceCurrentPage, loadingMaintenance)}
                </>
            )}
        </>
    );
}
