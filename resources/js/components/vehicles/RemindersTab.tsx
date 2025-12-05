import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { serviceReminderService } from '../../services/serviceReminderService';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import { formatDate, getStatusBadgeColor } from '../../utilites';
import { ServiceReminder } from '../../types/ServiceReminderTypes';
import { PaginationData } from '../common/TableFooter';

interface RemindersTabProps {
    activeTab: string;
}

export default function RemindersTab({ activeTab }: RemindersTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingReminders, setLoadingReminders] = useState(false);
    const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
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
        const fetchServiceReminders = async () => {
            if (!id || activeTab !== 'reminders') return;

            setLoadingReminders(true);
            try {
                const response = await serviceReminderService.getAll({
                    page: remindersCurrentPage,
                    search: '',
                    status: '',
                });

                const data = response.data;

                if (data.status && data.service_reminders) {
                    setServiceReminders(data.service_reminders.data);
                    setRemindersPagination({
                        current_page: data.service_reminders.current_page,
                        last_page: data.service_reminders.last_page,
                        per_page: data.service_reminders.per_page,
                        total: data.service_reminders.total,
                    });
                } else {
                    setServiceReminders([]);
                }
            } catch (error) {
                console.error("Failed to load service reminders:", error);
                setServiceReminders([]);
            } finally {
                setLoadingReminders(false);
            }
        };

        fetchServiceReminders();
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
                ) : serviceReminders.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-gray-600">No service reminders found</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Service Task
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Time Interval
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Meter Interval
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Next Due Date
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Next Due Meter
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100">
                                {serviceReminders.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.service_task?.name || "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.time_interval_value
                                                    ? `${record.time_interval_value} ${record.time_interval_unit}`
                                                    : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.primary_meter_interval_value
                                                    ? `${record.primary_meter_interval_value} ${record.primary_meter_interval_unit}`
                                                    : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.next_due_date
                                                    ? formatDate(record.next_due_date)
                                                    : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {record.next_due_meter || "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <Badge size="sm" color={getStatusBadgeColor(record.status)}>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {serviceReminders.length > 0 && renderPagination(remindersPagination, remindersCurrentPage, setRemindersCurrentPage, loadingReminders)}
                    </>
                )}
            </div>
        </div>
    );
}

