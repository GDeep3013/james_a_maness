import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { vehicleService } from '../../services/vehicleService';
import { fuelService } from '../../services/fuelService';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';
import { ChevronLeftIcon, PencilIcon, TrashBinIcon, CalenderIcon, PurchasePriceIcon, FuelIcon, TotalMileageIcon, FileIcon } from '../../icons';
import { VehicleFormData } from '../../constants/vehicleConstants';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    formatCurrency,
    formatMileage,
    formatDate,
    getStatusBadgeColor,
    getStatusLabel,
    formatVehicleIdentifier,
    capitalizeFirst,
} from '../../utils';
import { workOrderService } from '../../services/workOrderService';
import { serviceService } from '../../services/serviceService';
import { serviceReminderService } from '../../services/serviceReminderService';
import { issueService } from '../../services/issueService';

interface MaintenanceRecord {
    id: number;
    name: string;
    date: string;
    mileage: string;
    cost: string;
    status: string;
}

interface FuelRecord {
    id: number;
    vehicle_id: number;
    vendor_id: number;
    fuel_type: string;
    unit_type: string;
    units: number;
    price_per_volume_unit: number;
    vehicle_meter: string;
    notes?: string;
    date: string;
    vehicle?: {
        id: number;
        name: string;
    };
    vendor?: {
        id: number;
        name: string;
    };
    created_at?: string;
}

interface IssueRecord {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        vehicle_name?: string;
    };
    status?: string;
    priority?: string;
    summary?: string;
    source?: string;
    issue_date?: string;
    reported_date?: string;
    issued_by?: string;
    assigned_to?: {
        id?: number;
        first_name?: string;
        last_name?: string;
    };
    labels?: string | string[];
    created_at?: string;
}

interface ServiceReminder {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    service_task_id?: number;
    service_task?: {
        id?: number;
        name?: string;
    };
    time_interval_value?: string;
    time_interval_unit?: string;
    primary_meter_interval_value?: string;
    primary_meter_interval_unit?: string;
    next_due_date?: string;
    next_due_meter?: string;
    status?: string;
    created_at?: string;
}

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
        company_contact?: string;
    };
    invoice_number?: string;
    po_number?: string;
    created_at?: string;
}

interface ServiceRecord {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        vehicle_name?: string;
    };
    vendor_id?: number;
    vendor?: {
        name?: string;
    };
    repair_priority_class?: string;
    hour_meter?: number;
    completion_date?: string;
    start_date?: string;
    created_at?: string;
}

interface Document {
    id: number;
    title: string;
    uploadedDate: string;
    expiresDate: string;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function VehicleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<VehicleFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState('work');

    // Loading states for tabs
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);
    const [loadingFuel, setLoadingFuel] = useState(false);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [loadingWork, setLoadingWork] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingIssues, setLoadingIssues] = useState(false);
    const [loadingReminders, setLoadingReminders] = useState(false);

    const [workRecords, setWorkRecords] = useState<WorkOrderRecord[]>([]);
    const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
    const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
    const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([]);
    const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);

    const [workPagination, setWorkPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [fuelPagination, setFuelPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [servicesPagination, setServicesPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [issuesPagination, setIssuesPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [remindersPagination, setRemindersPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [documentsPagination, setDocumentsPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    // Current page states for each tab
    const [workCurrentPage, setWorkCurrentPage] = useState(1);
    const [fuelCurrentPage, setFuelCurrentPage] = useState(1);
    const [servicesCurrentPage, setServicesCurrentPage] = useState(1);
    const [issuesCurrentPage, setIssuesCurrentPage] = useState(1);
    const [remindersCurrentPage, setRemindersCurrentPage] = useState(1);
    const [documentsCurrentPage, setDocumentsCurrentPage] = useState(1);

    // Pagination rendering function (reusable for all tabs)
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

    // Update fetch functions to handle pagination
    useEffect(() => {
        const fetchWorkRecords = async () => {
            if (!id || activeTab !== 'work') return;

            setLoadingWork(true);
            try {
                const response = await workOrderService.getAll({
                    page: workCurrentPage,
                    search: '',
                    status: '',
                });

                const data = response.data;

                if (data.status && data.work_orders) {
                    setWorkRecords(data.work_orders.data || []);
                    setWorkPagination({
                        current_page: data.work_orders.current_page,
                        last_page: data.work_orders.last_page,
                        per_page: data.work_orders.per_page,
                        total: data.work_orders.total,
                    });
                } else {
                    setWorkRecords([]);
                }
            } catch (error) {
                console.error("Failed to load work records:", error);
                setWorkRecords([]);
            } finally {
                setLoadingWork(false);
            }
        };

        fetchWorkRecords();
    }, [id, activeTab, workCurrentPage]);

    // Similar updates for other fetch functions
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

    useEffect(() => {
        const fetchServiceRecords = async () => {
            if (!id || activeTab !== 'services') return;

            setLoadingServices(true);
            try {
                const response = await serviceService.getAll({
                    page: servicesCurrentPage,
                    search: '',
                });

                const data = response.data;

                if (data.status && data.services) {
                    setServiceRecords(data.services.data || []);
                    setServicesPagination({
                        current_page: data.services.current_page,
                        last_page: data.services.last_page,
                        per_page: data.services.per_page,
                        total: data.services.total,
                    });
                } else {
                    setServiceRecords([]);
                }
            } catch (error) {
                console.error("Failed to load service records:", error);
                setServiceRecords([]);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServiceRecords();
    }, [id, activeTab, servicesCurrentPage]);

    useEffect(() => {
        const fetchIssueRecords = async () => {
            if (!id || activeTab !== 'issue') return;

            setLoadingIssues(true);
            try {
                const response = await issueService.getAll({
                    page: issuesCurrentPage,
                    search: '',
                    status: '',
                    vehicle_id: Number(id)
                });

                const data = response.data;

                if (data.status && data.issues) {
                    setIssueRecords(data.issues.data || []);
                    setIssuesPagination({
                        current_page: data.issues.current_page,
                        last_page: data.issues.last_page,
                        per_page: data.issues.per_page,
                        total: data.issues.total,
                    });
                } else {
                    setIssueRecords([]);
                }
            } catch (error) {
                console.error("Failed to load issue records:", error);
                setIssueRecords([]);
            } finally {
                setLoadingIssues(false);
            }
        };

        fetchIssueRecords();
    }, [id, activeTab, issuesCurrentPage]);

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
                    const filtered = data.service_reminders.data.filter(
                        (reminder: ServiceReminder) => reminder.vehicle_id === Number(id)
                    );
                    setServiceReminders(filtered);
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

    useEffect(() => {
        const fetchDocumentRecords = async () => {
            if (!id || activeTab !== 'documents') return;

            setLoadingDocuments(true);
            try {
                const response = await vehicleService.getAll({
                    page: documentsCurrentPage,
                    search: '',
                });

                const data = response.data;

                if (data.status && data.documents) {
                    setDocuments(data.documents.data || []);
                    setDocumentsPagination({
                        current_page: data.documents.current_page,
                        last_page: data.documents.last_page,
                        per_page: data.documents.per_page,
                        total: data.documents.total,
                    });
                } else {
                    setDocuments([]);
                }
            } catch (error) {
                console.error("Failed to load work records:", error);
                setDocuments([]);
            } finally {
                setLoadingDocuments(false);
            }
        };

        fetchDocumentRecords();
    }, [id, activeTab, documentsCurrentPage]);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) {
                setError('Vehicle ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const response = await vehicleService.getById(Number(id));
                const data = response.data;

                if (data.status && data.vehicle) {
                    setVehicle(data.vehicle);
                } else {
                    setError('Vehicle not found');
                }
            } catch {
                setError('Failed to load vehicle details');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleEdit = () => {
        if (id) {
            navigate(`/vehicles/${id}/edit`);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this vehicle?')) {
            return;
        }

        try {
            await vehicleService.delete(Number(id));
            navigate('/vehicles');
        } catch {
            alert('Failed to delete vehicle. Please try again.');
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case "critical":
                return "bg-red-500 text-white";
            case "high":
                return "bg-orange-500 text-white";
            case "medium":
                return "bg-blue-500 text-white";
            case "low":
                return "bg-gray-300 text-gray-800";
            default:
                return "bg-gray-200 text-gray-600";
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Open":
                return "error";
            case "Overdue":
                return "error";
            case "In Progress":
                return "warning";
            case "Resolved":
                return "info";
            case "Closed":
                return "warning";
            default:
                return "warning";
        }
    };

    if (loading) {
        return (
            <>
                <PageMeta title="Vehicle Details" description="View vehicle details" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="mt-2 text-sm text-gray-600">
                            Loading vehicle details...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !vehicle) {
        return (
            <>
                <PageMeta title="Vehicle Details" description="View vehicle details" />
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/vehicles')}
                            startIcon={<ChevronLeftIcon />}
                        >
                            Back to Vehicles
                        </Button>
                    </div>
                    <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                        <p className="text-sm text-error-600 dark:text-error-400">
                            {error || 'Vehicle not found'}
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const vehicleIdentifier = formatVehicleIdentifier(vehicle.type, vehicle.id || 0);
    const totalMileage = formatMileage(vehicle.current_mileage);
    const purchasePrice = formatCurrency(vehicle.purchase_price);

    return (
        <>
            <PageMeta title={`${vehicle.vehicle_name} - Vehicle Details`} description="View vehicle details" />

            <div className="space-y-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/vehicles')}
                            startIcon={<ChevronLeftIcon />}
                            className="height-[34px] !inline-block py-3"
                        >
                            {''}
                        </Button>
                        <div className=''>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {capitalizeFirst(vehicle.vehicle_name)}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 w-full">
                                <span>{vehicleIdentifier}</span>
                                <span>•</span>
                                <span>{vehicle.license_plate || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleEdit}
                            startIcon={<PencilIcon />}
                            className='min-height-[40px] !leading-[40px]'
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            startIcon={<TrashBinIcon />}
                            className='min-height-[40px] !leading-[40px] delete-button'
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CalenderIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Service</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">N/A</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <FuelIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fuel Type</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{capitalizeFirst(vehicle.fuel_type) || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <TotalMileageIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Mileage</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalMileage}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <PurchasePriceIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Purchase Price</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{purchasePrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-nowrap flex-wrap gap-6">
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200  w-full">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Information</h2>
                            <div className="space-y-4 flex item-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status </span>
                                    <span className="inline-block">
                                        <Badge color={getStatusBadgeColor(vehicle.initial_status)} size="sm">
                                            {getStatusLabel(vehicle.initial_status)}
                                        </Badge>
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle Name </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {capitalizeFirst(vehicle.vehicle_name)}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Make & Model</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {vehicle.make && vehicle.model ? `${capitalizeFirst(vehicle.make)} ${capitalizeFirst(vehicle.model)}` : capitalizeFirst(vehicle.vehicle_name)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Year</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{capitalizeFirst(vehicle.year) || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">VIN</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.vin || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">License Plate</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.license_plate || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Color</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{capitalizeFirst(vehicle.color) || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Engine Size</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {vehicle.engine_size ? `${vehicle.engine_size}L` : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Transmission</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {capitalizeFirst(vehicle.transmission) || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Date</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(vehicle.purchase_date)}</span>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='current-assignment mt-6'>
                        <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm">
                            <h3 className="text-[18px] font-medium text-[#1D2939] mb-4">Current Assignment</h3>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                                <div className="flex-1">
                                    <span className="block text-sm text-[#595959] mb-1">Vendor</span>
                                    <span className="block text-base text-[#1D2939]">
                                        {vehicle.vendor?.id ? (
                                            <Link to={`/vendors/${vehicle.vendor.id}`} className="text-blue-500 hover:text-blue-700">
                                                {capitalizeFirst(vehicle.vendor?.name)}
                                            </Link>
                                        ) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm text-[#595959] mb-1">Assigned Driver</span>
                                    <span className="block text-base text-[#1D2939]">
                                        {vehicle.contact?.id ? (
                                            <Link to={`/contacts/${vehicle.contact.id}`} className="text-blue-500 hover:text-blue-700">
                                                {capitalizeFirst(vehicle.contact?.first_name) + ' ' + capitalizeFirst(vehicle.contact?.last_name)}
                                            </Link>
                                        ) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm text-[#595959] mb-1">Primary Location</span>
                                    <span className="block text-base text-[#1D2939]">{capitalizeFirst(vehicle.primary_location) || 'N/A'}</span>
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm text-[#595959] mb-1">Department</span>
                                    <span className="block text-base text-[#1D2939]">
                                        {capitalizeFirst(vehicle.department) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 w-full mt-4">
                        <div className="lg:p-6 p-3">
                            <nav className="flex bg-[#ECECF0] md:mb-8 mb-4 rounded-[32px] p-1">
                                {/* <button
                                        onClick={() => setActiveTab('maintenance')}
                                        className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'maintenance'
                                                ? 'bg-white text-brand-600 dark:text-brand-400'
                                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                            }`}
                                    >
                                        Maintenance History
                                    </button> */}
                                <button
                                    onClick={() => setActiveTab('work')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'work'
                                        ? 'bg-white text-brand-600 dark:text-brand-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                        }`}
                                >
                                    Work History
                                </button>

                                <button
                                    onClick={() => setActiveTab('fuel')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'fuel'
                                        ? 'bg-white text-brand-600 dark:text-brand-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                        }`}
                                >
                                    Fuel Records
                                </button>

                                <button
                                    onClick={() => setActiveTab('services')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'services'
                                        ? 'bg-white text-brand-600 dark:text-brand-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                        }`}
                                >
                                    Service History
                                </button>
                                <button
                                    onClick={() => setActiveTab('issue')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'issue'
                                        ? 'bg-white text-brand-600 dark:text-brand-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                        }`}
                                >
                                    Issue Records
                                </button>

                                <button
                                    onClick={() => setActiveTab('reminders')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none whitespace-nowrap ${activeTab === 'reminders'
                                        ? 'bg-white text-brand-600 dark:text-brand-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                        }`}
                                >
                                    Service Reminders
                                </button>

                                <button
                                    onClick={() => setActiveTab('documents')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium border-b-2 transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'documents'
                                        ? 'bg-white text-brand-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Documents
                                </button>
                            </nav>

                            {/* {activeTab === 'maintenance' && (
                                <div className="space-y-4">
                                    {loadingMaintenance ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="text-center">
                                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading maintenance records...</p>
                                            </div>
                                        </div>
                                    ) : maintenanceRecords.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No maintenance records found</p>
                                        </div>
                                    ) : (
                                        maintenanceRecords.map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="md:text-base text-sm font-normal text-[#1D2939] dark:text-white">{record.name}</h3>
                                                        <Badge size="sm" variant="outline">{record.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                        <p className='text-sm text-[#595959] w-full'>Date:
                                                            <span className="text-[#1D2939] block mt-1">{record.date}</span>
                                                        </p>
                                                        <p className='text-sm text-[#595959] w-full'>Mileage:
                                                            <span className="text-[#1D2939] block mt-1">{record.mileage}</span>
                                                        </p>
                                                        <p className='text-sm text-[#595959] w-full'>Cost:
                                                            <span className="text-[#1D2939] block mt-1">{record.cost}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )} */}

                            {activeTab === 'work' && (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <div className="max-w-full overflow-x-auto">
                                        {loadingWork ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading work orders...</p>
                                                </div>
                                            </div>
                                        ) : workRecords.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <p className="text-gray-600">No work orders found</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader className="border-b border-gray-100">
                                                        <TableRow>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Invoice No
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Status
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Issue Date
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Assigned To
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Expected Completion
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs ">
                                                                Repair Priority Class
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="divide-y divide-gray-100">
                                                        {workRecords.map((record) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        Invoice:{record.invoice_number || "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">

                                                                    <Badge
                                                                        size="sm"
                                                                        color={getStatusColor(record.status)}
                                                                    >
                                                                        {record.status || "Open"}
                                                                    </Badge>
                                                                </TableCell>

                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.issue_date ? formatDate(record.issue_date) : "N/A"}
                                                                    </div>
                                                                    {record.issued_by && (
                                                                        <div className="text-gray-500 text-theme-xs">
                                                                            By: {record.issued_by}
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    {record.assigned_to ? (
                                                                        <div className="text-gray-800 text-theme-sm">
                                                                            {`${record.assigned_to.first_name || ""} ${record.assigned_to.last_name || ""}`.trim() || "N/A"}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-gray-500 text-theme-sm">N/A</div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.expected_completion_date ? formatDate(record.expected_completion_date) : "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-theme-xs">
                                                                        {record.repair_priority_class && (
                                                                            <Badge size="sm" color={getStatusBadgeColor(record.repair_priority_class)}>
                                                                                {record.repair_priority_class}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {renderPagination(workPagination, workCurrentPage, setWorkCurrentPage, loadingWork)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'fuel' && (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <div className="max-w-full overflow-x-auto">
                                        {loadingFuel ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading fuel records...</p>
                                                </div>
                                            </div>
                                        ) : fuelRecords.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <p className="text-gray-600">No fuel records found</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader className="border-b border-gray-100">
                                                        <TableRow>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Fuel Type
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Date
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Quantity
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Price/Unit
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Total Cost
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Odometer
                                                            </TableCell>

                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="divide-y divide-gray-100">
                                                        {fuelRecords.map((record) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {capitalizeFirst(record.fuel_type) || 'N/A'}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {formatDate(record.date)}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.units} {record.unit_type === 'us_gallons' ? 'gal' : record.unit_type === 'liters' ? 'L' : 'gal (UK)'}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        ${Number(record.price_per_volume_unit).toFixed(2)}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        ${(record.units * record.price_per_volume_unit).toFixed(2)}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.vehicle_meter || 'N/A'}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {fuelRecords.length > 0 && renderPagination(fuelPagination, fuelCurrentPage, setFuelCurrentPage, loadingFuel)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'issue' && (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <div className="max-w-full overflow-x-auto">
                                        {loadingIssues ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading issue records...</p>
                                                </div>
                                            </div>
                                        ) : issueRecords.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <p className="text-gray-600">No issue records found</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader className="border-b border-gray-100">
                                                        <TableRow>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Priority
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Vehicle
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Summary
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Status
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Assigned To
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Reported Date
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="divide-y divide-gray-100">
                                                        {issueRecords.map((record) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="px-4 py-3 text-theme-xs">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(record.priority)}`}>
                                                                        {record.priority || "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.vehicle?.vehicle_name || "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm truncate max-w-xs">
                                                                        {record.summary || "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <Badge
                                                                        size="sm"
                                                                        color={getStatusColor(record.status)}
                                                                    >
                                                                        {record.status || "Open"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.assigned_to
                                                                            ? `${record.assigned_to.first_name} ${record.assigned_to.last_name}`
                                                                            : "Unassigned"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.reported_date
                                                                            ? formatDate(record.reported_date)
                                                                            : "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {issueRecords.length > 0 && renderPagination(issuesPagination, issuesCurrentPage, setIssuesCurrentPage, loadingIssues)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reminders' && (
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
                            )}

                            {activeTab === 'services' && (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <div className="max-w-full overflow-x-auto">
                                        {loadingServices ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading service records...</p>
                                                </div>
                                            </div>
                                        ) : serviceRecords.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <p className="text-gray-600">No service records found</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader className="border-b border-gray-100">
                                                        <TableRow>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Repair Priority Class
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Vendor
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Vehicle
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Meter
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Start Date
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Completion Date
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="divide-y divide-gray-100">
                                                        {serviceRecords.map((record) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <Badge size="sm"color={getStatusBadgeColor(record.repair_priority_class)}>
                                                                        {record.repair_priority_class || "N/A"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.vendor?.name || "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.vehicle?.vehicle_name || "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.hour_meter ?? "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.start_date ? formatDate(record.start_date) : "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {record.completion_date ? formatDate(record.completion_date) : "N/A"}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {serviceRecords.length > 0 && renderPagination(
                                                    servicesPagination,
                                                    servicesCurrentPage,
                                                    setServicesCurrentPage,
                                                    loadingServices
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'documents' && (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <div className="max-w-full overflow-x-auto">
                                        {loadingDocuments ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
                                                </div>
                                            </div>
                                        ) : documents.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <p className="text-gray-600">No documents found</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader className="border-b border-gray-100">
                                                        <TableRow>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Document ID
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Title
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Uploaded Date
                                                            </TableCell>
                                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                                                Expires Date
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="divide-y divide-gray-100">
                                                        {documents.map((document) => (
                                                            <TableRow key={document.id}>
                                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                                            <FileIcon className="w-5 h-5 text-purple-600" />
                                                                        </div>
                                                                        <span className="block font-medium text-gray-800 text-theme-sm">
                                                                            DOC-{document.id}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm font-semibold">
                                                                        {document.title}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {document.uploadedDate}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-start">
                                                                    <div className="text-gray-800 text-theme-sm">
                                                                        {document.expiresDate}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {documents.length > 0 && renderPagination(documentsPagination, documentsCurrentPage, setDocumentsCurrentPage, loadingDocuments)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>


                </div>
            </div>
        </>
    );
}
