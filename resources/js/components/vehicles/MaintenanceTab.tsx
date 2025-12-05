import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { maintenanceService } from '../../services/maintenanceService';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from '../ui/button/Button';
import { formatDate, formatCurrency } from '../../utilites';
import { Maintenance } from '../../types/MaintenanceTypes';
import { PaginationData } from '../common/TableFooter';

interface MaintenanceTabProps {
    activeTab: string;
}

export default function MaintenanceTab({ activeTab }: MaintenanceTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);
    const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
    const [maintenancePagination, setMaintenancePagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1);

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
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200">
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
            try {
                const response = await maintenanceService.getAll({
                    page: maintenanceCurrentPage,
                    search: '',
                    vehicle_id: Number(id),
                });
                const data = response.data;

                if (data.status && data.maintenance) {
                    setMaintenanceRecords(data.maintenance.data || []);
                    setMaintenancePagination({
                        current_page: data.maintenance.current_page,
                        last_page: data.maintenance.last_page,
                        per_page: data.maintenance.per_page,
                        total: data.maintenance.total,
                    });
                } else {
                    setMaintenanceRecords([]);
                }
            } catch (error) {
                console.error('Failed to load maintenance records:', error);
                setMaintenanceRecords([]);
            } finally {
                setLoadingMaintenance(false);
            }
        };

        fetchMaintenanceRecords();
    }, [id, activeTab, maintenanceCurrentPage]);

    if (activeTab !== 'maintenance') {
        return null;
    }

    const getTotalAmount = (maintenance: Maintenance): number => {
        if (!maintenance.maintenance_items || maintenance.maintenance_items.length === 0) {
            return 0;
        }
        return maintenance.maintenance_items.reduce((sum, item) => {
            return sum + (item.total_amount || 0);
        }, 0);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                {loadingMaintenance ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading maintenance records...</p>
                        </div>
                    </div>
                ) : maintenanceRecords.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-gray-600">No maintenance records found</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Date
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Vehicle
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Expense Type
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Items Count
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Total Amount
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100">
                                {maintenanceRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.vehicle_date ? formatDate(record.vehicle_date) : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.vehicle?.vehicle_name || record.vehicle_model || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.expense_type?.name || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.maintenance_items?.length || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {formatCurrency(getTotalAmount(record))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {maintenanceRecords.length > 0 && renderPagination(maintenancePagination, maintenanceCurrentPage, setMaintenanceCurrentPage, loadingMaintenance)}
                    </>
                )}
            </div>
        </div>
    );
}

