import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { serviceReminderService } from '../../services/serviceReminderService';
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

interface ServiceReminderAssignmentsProps {
    contactId: number;
}

interface ServiceReminder {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    service_task_ids?: number[];
    service_tasks?: Array<{
        id?: number;
        name?: string;
    }>;
    time_interval_value?: string;
    time_interval_unit?: string;
    time_due_soon_threshold_value?: string;
    time_due_soon_threshold_unit?: string;
    primary_meter_interval_value?: string;
    primary_meter_interval_unit?: string;
    primary_meter_due_soon_threshold_value?: string;
    primary_meter_due_soon_threshold_unit?: string;
    manually_set_next_reminder?: boolean;
    notifications_enabled?: boolean;
    watchers?: number[];
    next_due_date?: string;
    next_due_meter?: string;
    last_completed_date?: string;
    last_completed_meter?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

interface ServiceRemindersResponse {
    status: boolean;
    service_reminders?: {
        data: ServiceReminder[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ServiceReminderAssignments({ contactId }: ServiceReminderAssignmentsProps) {
    const navigate = useNavigate();
    const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const fetchServiceReminders = useCallback(async () => {
        if (!contactId) return;
        
        setLoading(true);
        setError("");
        try {
            const response = await serviceReminderService.getAll({
                watcher_id: contactId,
                status: "active",
            });
            const data = response.data as ServiceRemindersResponse;

            if (data.status && data.service_reminders) {
                setServiceReminders(data.service_reminders.data || []);
            } else {
                setError("Failed to load service reminders");
                setServiceReminders([]);
            }
        } catch {
            setError("An error occurred while loading service reminders");
            setServiceReminders([]);
        } finally {
            setLoading(false);
        }
    }, [contactId]);

    useEffect(() => {
        fetchServiceReminders();
    }, [fetchServiceReminders]);

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "success";
            case "inactive":
                return "warning";
            case "completed":
                return "info";
            default:
                return "warning";
        }
    };

    const handleServiceReminderClick = (id: number) => {
        navigate(`/service-reminders/${id}`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Loading service reminders...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                </div>
            </div>
        );
    }

    if (serviceReminders.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        No service reminders assigned to this contact
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100">
                        <TableRow className="bg-[#E5E7EB]">
                            <TableCell isHeader>
                                ID
                            </TableCell>
                            <TableCell isHeader>
                                Vehicle
                            </TableCell>
                            <TableCell isHeader>
                                Service Task
                            </TableCell>
                            <TableCell isHeader>
                                Next Due Date
                            </TableCell>
                            <TableCell isHeader>
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100">
                        {serviceReminders.map((reminder) => (
                            <TableRow key={reminder.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <button
                                        onClick={() => handleServiceReminderClick(reminder.id)}
                                        className="font-medium text-purple-600 hover:text-purple-700 hover:underline text-theme-sm transition-colors"
                                    >
                                        #{reminder.id}
                                    </button>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-gray-800 text-theme-sm">
                                        {reminder.vehicle?.vehicle_name || "N/A"}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start w-[300px]">
                                    <div className="text-gray-800 text-theme-sm">
                                        {reminder.service_tasks && reminder.service_tasks.length > 0
                                            ? reminder.service_tasks.map((task, index) => (
                                                <span key={task.id || index}>
                                                    {task.name}
                                                    {index < (reminder.service_tasks?.length ?? 0) - 1 && ", "}
                                                </span>
                                            ))
                                            : "N/A"}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-gray-800 text-theme-sm">
                                        {formatDate(reminder.next_due_date)}
                                    </div>
                                    {reminder.next_due_meter && (
                                        <div className="text-gray-500 text-theme-xs">
                                            Meter: {reminder.next_due_meter}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <Badge
                                        size="sm"
                                        color={getStatusColor(reminder.status)}
                                    >
                                        {reminder.status ? reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1) : "Active"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

