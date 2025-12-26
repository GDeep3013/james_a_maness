import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";

import { workOrderService } from "../../services/workOrderService";
import { WorkOrder, ServiceItem, Part } from "../../types/workOrderTypes";
import { WORK_ORDER_STATUS_OPTIONS } from "../../constants/selectOptions";
// import { Dropdown } from "../../components/ui/dropdown/Dropdown";
// import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import {
    CarIcon,
    DollarLineIcon,
    TimeIcon,
    DocsIcon,
    ChevronDownIcon,
    // MoreDotIcon,
    MaintenanceIcon,
    CalenderIcon,
    AlertIcon
} from "../../icons";

interface ExtendedWorkOrder extends WorkOrder {
    parts?: Part[] | string;
    discount_value?: number;
    discount_type?: "percentage" | "fixed";
    tax_value?: number;
    tax_type?: "percentage" | "fixed";
}

export default function WorkOrderDetails() {
    const { id } = useParams<{ id: string }>();
    const [workOrder, setWorkOrder] = useState<ExtendedWorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    // const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            fetchWorkOrder(parseInt(id));
        }
    }, [id]);

    const fetchWorkOrder = async (workOrderId: number) => {
        setLoading(true);
        setError("");
        try {
            const response = await workOrderService.getById(workOrderId);
            const data = response.data as { status: boolean; work_order?: ExtendedWorkOrder };

            if (data.status && data.work_order) {
                setWorkOrder(data.work_order);
            } else {
                setError("Work order not found");
            }
        } catch {
            setError("Failed to load work order");
        } finally {
            setLoading(false);
        }
    };

    const serviceItems = useMemo(() => {
        if (!workOrder?.service_items) return [];
        if (typeof workOrder.service_items === 'string') {
            try {
                return JSON.parse(workOrder.service_items) as ServiceItem[];
            } catch {
                return [];
            }
        }
        return workOrder.service_items as ServiceItem[];
    }, [workOrder]);

    const parts = useMemo(() => {
        if (!workOrder?.parts) return [];
        if (typeof workOrder.parts === 'string') {
            try {
                return JSON.parse(workOrder.parts) as Part[];
            } catch {
                return [];
            }
        }
        return workOrder.parts as Part[];
    }, [workOrder]);

    const getLaborPrice = (item: ServiceItem | Part): number => {
        if ('name' in item) {
            return (item as ServiceItem).labor_cost || 0;
        }
        return 0;
    };

    const getPartsPrice = (item: ServiceItem | Part): number => {
        if ('name' in item) {
            return (item as ServiceItem & { unit_price?: number }).unit_price || 0;
        }
        const part = item as Part;
        const unitPrice = part.unit_price || 0;
        const quantity = part.quantity || 1;
        return unitPrice * quantity;
    };

    const calculateTotals = useMemo(() => {
        let laborTotal = 0;
        let partsTotal = 0;

        serviceItems.forEach((item) => {
            laborTotal += getLaborPrice(item);
            partsTotal += getPartsPrice(item);
        });

        parts.forEach((item) => {
            partsTotal += getPartsPrice(item);
        });

        const subtotal = laborTotal + partsTotal;
        const discountValue = workOrder?.discount_value || 0;
        const discountType = workOrder?.discount_type || "percentage";
        let discountAmount = 0;

        if (discountValue > 0) {
            if (discountType === "percentage") {
                discountAmount = (subtotal * discountValue) / 100;
            } else {
                discountAmount = discountValue;
            }
        }

        const afterDiscount = subtotal - discountAmount;

        const taxValue = workOrder?.tax_value || 0;
        const taxType = workOrder?.tax_type || "percentage";
        let taxAmount = 0;

        if (taxValue > 0) {
            if (taxType === "percentage") {
                taxAmount = (afterDiscount * taxValue) / 100;
            } else {
                taxAmount = taxValue;
            }
        }

        const total = afterDiscount + taxAmount;

        return {
            subtotal,
            laborTotal,
            partsTotal,
            discountAmount,
            taxAmount,
            total,
        };
    }, [serviceItems, parts, workOrder]);

    const calculateDuration = () => {
        if (!workOrder?.actual_start_date || !workOrder?.actual_completion_date) {
            return "N/A";
        }
        try {
            const start = new Date(workOrder.actual_start_date);
            const end = new Date(workOrder.actual_completion_date);
            const diffMs = end.getTime() - start.getTime();
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            return `${diffHours} hours`;
        } catch {
            return "N/A";
        }
    };

    const formatCurrencyWithDecimals = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatDateTime = (dateString?: string): string => {
        if (!dateString) return "Not set";
        try {
            const date = new Date(dateString);
            const dateStr = date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
            const timeStr = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            return `${dateStr} ${timeStr}`;
        } catch {
            return "Not set";
        }
    };

    const getTimeAgo = (dateString?: string): string => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Created today";
            if (diffDays === 1) return "Created 1 day ago";
            return `Created ${diffDays} days ago`;
        } catch {
            return "";
        }
    };

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

    const handleStatusChange = (newStatus: string) => {
        if (workOrder) {
            setWorkOrder({ ...workOrder, status: newStatus });
        }
        setStatusDropdownOpen(false);
    };


    if (loading) {
        return (
            <>
                <PageMeta
                    title="Work Order Details"
                    description="View work order details"
                />
                <PageBreadcrumb
                    pageTitle={[
                        { name: "Work Orders", to: "/work-orders" },
                        { name: `Work Order #${id || ""}`, to: `/work-orders/${id || ""}` },
                    ]}
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading work order...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !workOrder) {
        return (
            <>
                <PageMeta
                    title="Work Order Details"
                    description="View work order details"
                />
                <PageBreadcrumb
                    pageTitle={[
                        { name: "Work Orders", to: "/work-orders" },
                        { name: `Work Order #${id || ""}`, to: `/work-orders/${id || ""}` },
                    ]}
                />
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error || "Work order not found"}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta
                title={`Work Order #${workOrder.id} - Details`}
                description="View work order details"
            />
            <PageBreadcrumb
                pageTitle={[
                    { name: "Work Orders", to: "/work-orders" },
                    { name: `Work Order #${id || ""}`, to: `/work-orders/${id || ""}` },
                ]}
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-start flex-col gap-1">
                        <h2 className="text-2xl font-semibold text-gray-800">Work Orders</h2>
                        <Badge
                            size="sm"
                            color={getStatusColor(workOrder.status)}
                        >
                            {workOrder.status || "Open"}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1 md:gap-3">
                        <div className="relative" ref={statusDropdownRef}>
                            <div
                                className="flex items-center gap-2 px-3 py-2 bg-[#F3F3F5] rounded-[8px] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                            >  
                                <div className="flex items-center gap-2">
                                <span className={`text-sm w-2 h-2 inline-block rounded-full bg-${getStatusColor(workOrder.status)}-500`}></span>
                                    {workOrder.status || "Open"}
                                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            {statusDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
                                    {WORK_ORDER_STATUS_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleStatusChange(option.value)}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${workOrder.status === option.value
                                                ? "bg-gray-50 font-medium text-gray-900"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${option.value === "Completed" ? "bg-green-500" :
                                                    option.value === "In Progress" ? "bg-blue-500" :
                                                        option.value === "Open" ? "bg-yellow-500" :
                                                            "bg-red-500"
                                                    }`}></div>
                                                <span>{option.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* <div className="relative" ref={moreOptionsRef}>
                            <Button
                                variant="none"
                                size="sm"
                                className="p-2 dropdown-toggle"
                                onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
                            >
                                <MoreDotIcon className="w-5 h-5 text-gray-500" />
                            </Button>
                            <Dropdown
                                isOpen={moreOptionsOpen}
                                onClose={() => setMoreOptionsOpen(false)}
                                className="w-48"
                            >
                                <DropdownItem
                                    onClick={() => {
                                        setMoreOptionsOpen(false);
                                    }}
                                >
                                    Edit Work Order
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => {
                                        setMoreOptionsOpen(false);
                                    }}
                                >
                                    Duplicate
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => {
                                        setMoreOptionsOpen(false);
                                    }}
                                >
                                    Export PDF
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => {
                                        setMoreOptionsOpen(false);
                                    }}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    Delete
                                </DropdownItem>
                            </Dropdown>
                        </div> */}
                    </div>
                    
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 border-b border-[#E5E7EB]">
                    <div className="flex flex-col md:flex-row md:items-center text-left gap-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <CarIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="">
                            <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                            <p className="text-sm font-semibold text-purple-600">
                                {workOrder.vehicle?.vehicle_name || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center text-left gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <DollarLineIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="">
                            <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrencyWithDecimals(calculateTotals.total)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center text-left gap-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <TimeIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="">
                            <p className="text-xs text-gray-500 mb-1">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {calculateDuration()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center text-left gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="">
                            <p className="text-xs text-gray-500 mb-1">Priority</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {workOrder.repair_priority_class || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center text-left gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <DocsIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="">
                            <p className="text-xs text-gray-500 mb-1">Service Entry</p>
                            <p className="text-sm font-semibold text-purple-600">
                                #{workOrder.id}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-purple-100 rounded-xl p-6">

                    <div className="flex items-center">
                        <div className="flex items-center gap-2 mb-4 w-full">
                            <MaintenanceIcon className="w-5 h-5 text-purple-700 inline-block" />
                            <h3 className="text-lg font-semibold text-gray-900">Service Line Items</h3>
                        </div>


                    </div>


                    <div className="space-y-4 mb-6">
                        {serviceItems.map((item, index) => {
                            const laborPrice = getLaborPrice(item);
                            const partsPrice = getPartsPrice(item);
                            const subtotal = laborPrice + partsPrice;

                            return (
                                <div key={index} className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-lg p-4">
                                    <div className="flex justify-between md:flex-row flex-col">
                                        <div className="w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-medium text-[#1D2939]">
                                                    {item.name || "Service Item"}
                                                </h4>
                                                {/* <InfoIcon className="w-4 h-4 text-gray-400" /> */}
                                            </div>
                                            <div className="flex gap-2">
                                                <p className="text-sm text-[#595959]">Reason</p>
                                                <p className="text-sm text-[#595959]">
                                                    {item.description || "N/A"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex gap-2">
                                                    <p className="text-xs text-[#595959]">Category</p>
                                                    <p className="text-sm text-[#595959]">
                                                        {item.label || item.value || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">Labor</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrencyWithDecimals(laborPrice)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Parts</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrencyWithDecimals(partsPrice)}
                                                    </p>
                                                </div>
                                                <div className="ml-auto">
                                                    <p className="text-xs text-gray-500">Subtotal</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatCurrencyWithDecimals(subtotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}


                    </div>

                    <div className="pt-4 space-y-3 bg-[#F9FAFB] p-4 rounded-[16px]">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrencyWithDecimals(calculateTotals.subtotal)}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Discount ({workOrder.discount_value || 0}%)
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrencyWithDecimals(calculateTotals.discountAmount)}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Tax ({workOrder.tax_value || 0}%)
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrencyWithDecimals(calculateTotals.taxAmount)}
                            </p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <p className="text-base font-semibold text-gray-900">Total</p>
                            <p className="text-base font-semibold text-gray-900">
                                {formatCurrencyWithDecimals(calculateTotals.total)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CalenderIcon className="w-5 h-5 text-purple-900" />
                            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 rounded-[10px] p-2">
                                    <CalenderIcon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Issue Date</p>
                                    <p className="text-sm text-gray-900">{formatDateTime(workOrder.issue_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-green-100 rounded-[10px] p-2">
                                    <CalenderIcon className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Actual Start Date</p>
                                    <p className="text-sm text-gray-900">{formatDateTime(workOrder.actual_start_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <div className="bg-purple-100 rounded-[10px] p-2">
                                    <CalenderIcon className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Actual Completion Date</p>
                                    <p className="text-sm text-gray-900">{formatDateTime(workOrder.actual_completion_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-[10px] p-2">
                                    <CalenderIcon className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Scheduled Start Date</p>
                                    <p className="text-sm text-gray-900">{formatDateTime(workOrder.scheduled_start_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-[10px] p-2">
                                    <CalenderIcon className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Expected Completion Date</p>
                                    <p className="text-sm text-gray-900">{formatDateTime(workOrder.expected_completion_date)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DocsIcon className="w-5 h-5 text-purple-900" />
                            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                                <p className="text-sm text-gray-900">
                                    {workOrder.assigned_to?.first_name && workOrder.assigned_to?.last_name
                                        ? `${workOrder.assigned_to.first_name} ${workOrder.assigned_to.last_name}`
                                        : "Not assigned"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Vendor</p>
                                <p className="text-sm text-gray-900">
                                    {workOrder.vendor?.company_contact || workOrder.vendor?.first_name || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
                                <p className="text-sm text-gray-900">{workOrder.invoice_number || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">PO Number</p>
                                <p className="text-sm text-gray-900">{workOrder.po_number || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-900">No description provided</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Users to Notify</p>
                                <p className="text-sm text-gray-900">None</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Alert Time</p>
                                <p className="text-sm text-gray-900">Not set</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertIcon className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Resolved Issues</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4">
                        <DocsIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-sm text-gray-500">No issues resolved with this work order</p>
                    </div>
                </div>

                {workOrder.created_at && (
                    <div className="text-center py-1">
                        <p className="text-sm text-green-600">{getTimeAgo(workOrder.created_at)}</p>
                    </div>
                )}
            </div>
        </>
    );
}
