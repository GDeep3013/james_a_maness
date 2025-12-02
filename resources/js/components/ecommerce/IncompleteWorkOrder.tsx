import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { workOrderService } from '../../services/workOrderService';
import Badge from "../../components/ui/badge/Badge";

interface WorkOrderRecord {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        vehicle_name?: string;
    };
    status?: string;
    repair_priority_class?: string;
    issue_date?: string;
    issued_by?: string;
    scheduled_start_date?: string;
    actual_start_date?: string;
    expected_completion_date?: string;
    actual_completion_date?: string;
    assigned_to?: {
        id?: number;
        first_name?: string;
        last_name?: string;
    };
    vendor_id?: number;
    vendor?: {
        first_name?: string;
        name?: string;
        company_contact?: string;
    };
    invoice_number?: string;
    po_number?: string;
    created_at?: string;
}

export default function IncompleteWorkOrder() {
    const navigate = useNavigate();
    const [workRecords, setWorkRecords] = useState<WorkOrderRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const getDashboardWorkOrder = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await workOrderService.getAllDashboard();
            const data = response.data;

            if (data.status && data.work_orders) {
                setWorkRecords(data.work_orders || []);
            } else {
                setError("Failed to load work orders");
                setWorkRecords([]);
            }
        } catch (err) {
            setError("An error occurred while loading work orders");
            setWorkRecords([]);
            console.error("Error fetching work orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardWorkOrder();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Open":
                return "warning";
            case "In Progress":
                return "info";
            case "Pending":
                return "warning";
            default:
                return "warning";
        }
    };

    const handleNewWorkOrder = () => {
        navigate("/work-orders/create");
    };

    const handleWorkOrderClick = (id: number) => {
        navigate(`/work-orders/${id}`);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 min-h-[140px] h-full">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-base font-semibold text-gray-800">Incomplete Work Orders</h2>


                
                <button
                    onClick={handleNewWorkOrder}
                    className="flex items-center space-x-1 px-1 md:px-4 py-2 text-black font-medium rounded-lg hover:bg-gray-50 transition duration-150 border border-gray-300 text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span className="md:text-sm text-xs font-medium">New Work Order</span>
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5321B1]"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading work orders...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            ) : workRecords.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-gray-600">No incomplete work orders found</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {workRecords.map((order, index) => (
                        <div
                            key={order.id}
                            onClick={() => handleWorkOrderClick(order.id)}
                            className={`flex justify-between items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${
                                index < workRecords.length - 1 ? 'border-b pb-6' : ''
                            }`}
                        >
                            <div className="flex-grow">
                                <div className="flex items-center space-x-3 mb-1">
                                    <p className="text-lg font-normal text-[#5321B1]">WO-{order.id}</p>
                                    <span className="text-gray-500 font-medium">
                                        {order.vehicle?.vehicle_name || 'N/A'}
                                    </span>
                                </div>

                                {/* {order.repair_priority_class && (
                                    <p className="text-sm text-gray-700 mb-1">
                                        Priority: {order.repair_priority_class}
                                    </p>
                                )} */}

                                <p className="text-xs text-gray-500">
                                    Assigned to:{" "}
                                    <span className="font-medium">
                                        {order.assigned_to
                                            ? `${order.assigned_to.first_name} ${order.assigned_to.last_name}`
                                            : "Unassigned"}
                                    </span>
                                </p>

                                {order.vendor && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Vendor: <span className="font-medium">{order.vendor.name}</span>
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                {order.expected_completion_date && (
                                    <p className="text-sm text-gray-500">
                                        Due: <span className="font-semibold">{formatDate(order.expected_completion_date)}</span>
                                    </p>
                                )}

                                {order.issue_date && (
                                    <p className="text-xs text-gray-400">
                                        Issued: {formatDate(order.issue_date)}
                                    </p>
                                )}

                                <Badge
                                    size="sm"
                                    color={getStatusColor(order.status)}
                                >
                                    {order.status || "Open"}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
