import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { workOrderService } from '../../services/workOrderService';
import Badge from "../../components/ui/badge/Badge";
import { WorkOrder } from "../../types/workOrderTypes";
import { getPriorityBadgeColor } from "../../utilites";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

interface WorkOrderAssignmentsProps {
    contactId: number;
}

interface WorkOrdersResponse {
    status: boolean;
    work_orders?: {
        data: WorkOrder[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function WorkOrderAssignments({ contactId }: WorkOrderAssignmentsProps) {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const fetchWorkOrders = useCallback(async () => {
        if (!contactId) return;
        
        setLoading(true);
        setError("");
        try {
            const response = await workOrderService.getAll({
                assigned_to: contactId,
            });
            const data = response.data as WorkOrdersResponse;

            if (data.status && data.work_orders) {
                const incompleteOrders = (data.work_orders.data || []).filter(
                    (order) => order.status !== "Completed"
                );
                setWorkOrders(incompleteOrders);
            } else {
                setError("Failed to load work orders");
                setWorkOrders([]);
            }
        } catch {
            setError("An error occurred while loading work orders");
            setWorkOrders([]);
        } finally {
            setLoading(false);
        }
    }, [contactId]);

    useEffect(() => {
        fetchWorkOrders();
    }, [fetchWorkOrders]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Open":
                return "warning";
            case "In Progress":
                return "info";
            case "Pending":
                return "warning";
            case "Completed":
                return "success";
            case "Cancelled":
                return "error";
            default:
                return "warning";
        }
    };

    const handleWorkOrderClick = (id: number) => {
        navigate(`/work-orders/${id}`);
    };

    const formatVehicleName = (vehicle?: WorkOrder["vehicle"]) => {
        if (!vehicle) return "N/A";
        if (vehicle.vehicle_name) return vehicle.vehicle_name;
        const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.type].filter(Boolean);
        return parts.length > 0 ? parts.join(" ") : "N/A";
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
                        Loading work orders...
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

    if (workOrders.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        No incomplete work orders assigned to this contact
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
                                Work Order ID
                            </TableCell>
                            <TableCell isHeader>
                                Vehicle
                            </TableCell>
                            <TableCell isHeader>
                                Issue Date
                            </TableCell>
                            <TableCell isHeader>
                                Priority
                            </TableCell>
                            <TableCell isHeader>
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100">
                        {workOrders.map((workOrder) => (
                            <TableRow key={workOrder.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <button
                                        onClick={() => handleWorkOrderClick(workOrder.id)}
                                        className="font-medium text-purple-600 hover:text-purple-700 hover:underline text-theme-sm transition-colors"
                                    >
                                        WO-{workOrder.id}
                                    </button>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-gray-800 text-theme-sm">
                                        {formatVehicleName(workOrder.vehicle)}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-gray-800 text-theme-sm">
                                        {formatDate(workOrder.issue_date)}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <Badge
                                        size="sm"
                                        color={getPriorityBadgeColor(workOrder.repair_priority_class)}
                                    >
                                        {workOrder.repair_priority_class || "Medium"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <Badge
                                        size="sm"
                                        color={getStatusColor(workOrder.status)}
                                    >
                                        {workOrder.status || "Open"}
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

