import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { serviceService } from '../../services/serviceService';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import { formatDate, formatTypeModel, formatNextDue, calculateServiceStatus, getServiceReminderStatusBadgeColor } from '../../utilites';
import { Service } from '../../types/serviceTypes';
import { PaginationData } from '../common/TableFooter';

interface RemindersTabProps {
    activeTab: string;
}

export default function RemindersTab({ activeTab }: RemindersTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingReminders, setLoadingReminders] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [remindersPagination, setRemindersPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [remindersCurrentPage, setRemindersCurrentPage] = useState(1);

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
        const fetchServices = async () => {
            if (!id || activeTab !== 'reminders') return;

            setLoadingReminders(true);
            try {
                const response = await serviceService.getAll({
                    page: remindersCurrentPage,
                    search: '',
                });

                const data = response.data;

                if (data.status && data.services) {
                    const filteredServices = data.services.data.filter((service: Service) => 
                        service.vehicle_id === parseInt(id)
                    );
                    setServices(filteredServices);
                    setRemindersPagination({
                        current_page: data.services.current_page,
                        last_page: data.services.last_page,
                        per_page: data.services.per_page,
                        total: filteredServices.length,
                    });
                } else {
                    setServices([]);
                }
            } catch {
                setServices([]);
            } finally {
                setLoadingReminders(false);
            }
        };

        fetchServices();
    }, [id, activeTab, remindersCurrentPage]);

    if (activeTab !== 'reminders') {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                {loadingReminders ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading service reminders...</p>
                        </div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-gray-600">No services found</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell isHeader >
                                        Vehicle
                                    </TableCell>
                                    <TableCell isHeader >
                                        Service Task
                                    </TableCell>
                                    <TableCell isHeader >
                                        Status
                                    </TableCell>
                                    <TableCell isHeader >
                                        Next Due
                                    </TableCell>
                                    <TableCell isHeader >
                                        Incomplete Work Order
                                    </TableCell>
                                    <TableCell isHeader >
                                        Last Completed
                                    </TableCell>
                                    <TableCell isHeader >
                                        Compliance
                                    </TableCell>
                                    <TableCell isHeader >
                                        Watchers
                                    </TableCell>
                                    <TableCell isHeader >
                                        Assignee
                                    </TableCell>
                                   
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100">
                                { services.map((record) => {
                                    
                                    const BadgeStatus =calculateServiceStatus(record.primary_meter,record.vehicle?.current_mileage);

                                    const BadgeColor = getServiceReminderStatusBadgeColor(BadgeStatus);

                                    return (<TableRow key={record.id}>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {formatTypeModel(record.vehicle)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start w-[300px]">
                                            <div className="text-gray-800 text-theme-sm">
                                            {record.service_items && record.service_items.length > 0
                                            ? record.service_items.map((task, index) => (
                                                <span key={task.id || index}>
                                                    {task.name}
                                                    {index < (record.service_items?.length ?? 0) - 1 && ", "}
                                                </span>
                                                ))
                                            : "N/A"}
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-start">
                                            <Badge size="sm" color={BadgeColor}>
                                                {BadgeStatus}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {formatNextDue(record.start_date)}
                                                <br/>
                                                <span className={`text-${BadgeColor}-500 text-theme-xs`}> {record.primary_meter} miles {BadgeStatus} </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                --
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.last_completed_date
                                                    ? formatDate(record.last_completed_date)
                                                    : "N/A"}
                                                    <br/>
                                                    {record.last_completed_meter && <span className={`text-gray-500 text-theme-xs`}> {record.last_completed_meter} miles completed </span>}
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                --
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                --
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                --
                                            </div>
                                        </TableCell>
                                   
                                    </TableRow>)
                                
                                })}
                            </TableBody>
                        </Table>
                        {services.length > 0 && renderPagination(remindersPagination, remindersCurrentPage, setRemindersCurrentPage, loadingReminders)}
                    </>
                )}
            </div>
        </div>
    );
}

