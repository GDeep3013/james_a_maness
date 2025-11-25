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


    // Fetch Work Order Records
    useEffect(() => {
        const fetchWorkRecords = async () => {
            if (!id || activeTab !== 'work') return;

            setLoadingWork(true);
            try {
                const response = await workOrderService.getAll({
                    page: 1,
                    search: '',
                    status: '',
                });

                const data = response.data;

                if (data.status && data.work_orders?.data) {
                    setWorkRecords(data.work_orders.data);
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
    }, [id, activeTab]);

    // Fetch Maintenance Records
    useEffect(() => {
        const fetchMaintenanceRecords = async () => {
            if (!id || activeTab !== 'maintenance') return;

            setLoadingMaintenance(true);
            try {
                const response = await vehicleService.getAll({
                    page: 1,
                    search: '',
                });
                const data = response.data;

                if (data.status && data.maintenance_records) {
                    setMaintenanceRecords(data.maintenance_records);
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
    }, [id, activeTab]);

    // Fetch Fuel Records
    useEffect(() => {
        const fetchFuelRecords = async () => {
            if (!id || activeTab !== 'fuel') return;

            setLoadingFuel(true);
            try {
                const response = await fuelService.getAll({
                    page: 1,
                    search: '',
                });
                const data = response.data;

                if (data.status && data.fuel && data.fuel.data) {
                    setFuelRecords(data.fuel.data);
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
    }, [id, activeTab]);

    // Fetch Service Records
    useEffect(() => {
        const fetchServiceRecords = async () => {
            if (!id || activeTab !== 'services') return;

            setLoadingServices(true);
            try {
                const response = await serviceService.getAll({
                    page: 1,
                    search: '',
                });

                const data = response.data;

                if (data.status && data.services?.data) {
                    setServiceRecords(data.services.data);
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
    }, [id, activeTab]);

    // Fetch Issue Records
    useEffect(() => {
        const fetchIssueRecords = async () => {
            if (!id || activeTab !== 'issue') return;

            setLoadingIssues(true);
            try {
                const response = await issueService.getAll({
                    page: 1,
                    search: '',
                    status: '',
                    vehicle_id: Number(id)
                });

                const data = response.data;

                if (data.status && data.issues?.data) {
                    setIssueRecords(data.issues.data);
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
    }, [id, activeTab]);

    // Fetch Service Reminders
    useEffect(() => {
        const fetchServiceReminders = async () => {
            if (!id || activeTab !== 'reminders') return;

            setLoadingReminders(true);
            try {
                const response = await serviceReminderService.getAll({
                    page: 1,
                    search: '',
                    status: '',
                });

                const data = response.data;

                if (data.status && data.service_reminders?.data) {
                    // Filter by vehicle_id on client side if API doesn't support it
                    const filtered = data.service_reminders.data.filter(
                        (reminder: ServiceReminder) => reminder.vehicle_id === Number(id)
                    );
                    setServiceReminders(filtered);
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
    }, [id, activeTab]);

    // Fetch Documents
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!id || activeTab !== 'documents') return;

            setLoadingDocuments(true);
            try {
                const response = await vehicleService.getAll({
                    page: 1,
                    search: '',
                });
                const data = response.data;

                if (data.status && data.documents) {
                    setDocuments(data.documents);
                } else {
                    setDocuments([]);
                }
            } catch (error) {
                console.error('Failed to load documents:', error);
                setDocuments([]);
            } finally {
                setLoadingDocuments(false);
            }
        };

        fetchDocuments();
    }, [id, activeTab]);

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

                                {activeTab === 'maintenance' && (
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
                                )}

                                {activeTab === 'work' && (
                                    <div className="space-y-4">
                                        {loadingWork ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading work records...</p>
                                                </div>
                                            </div>
                                        ) : workRecords.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No work records found</p>
                                            </div>
                                        ) : (
                                            workRecords.map((record) => (
                                                <Link
                                                    key={record.id}
                                                    to={`/work-orders/${record.id}`}
                                                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">

                                                                <h3 className="md:text-base text-sm font-normal text-[#1D2939] dark:text-white">
                                                                    WO-{record.id}
                                                                </h3>
                                                                <Badge size="sm" variant="outline">{record.repair_priority_class}</Badge>

                                                             {/* <div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {record.issue_date
                                                                    ? new Date(record.issue_date).toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    })
                                                                    : "No Date"}
                                                            </span>
                                                            </div> */}

                                                        </div>
                                                        <div className=" grid grid-cols-5 gap-2 ">
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicle Name</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.vehicle?.vehicle_name || "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                                                <span className="inline-block">
                                                                    <Badge color={getStatusBadgeColor(record.status || "N/A")} size="sm">
                                                                        {getStatusLabel(record.status || "N/A")}
                                                                    </Badge>
                                                                </span>

                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned To</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.assigned_to
                                                                        ? `${record.assigned_to.first_name} ${record.assigned_to.last_name}`
                                                                        : "Unassigned"}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Scheduled Start</p>
                                                                <p className="text-sm font-semibold">
                                                                    {record.scheduled_start_date
                                                                        ? new Date(record.scheduled_start_date).toLocaleDateString()
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Expected Completion</p>
                                                                <p className="text-sm font-semibold">
                                                                    {record.expected_completion_date
                                                                        ? new Date(record.expected_completion_date).toLocaleDateString()
                                                                        : "N/A"}
                                                                </p>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'fuel' && (
                                    <div className="space-y-4">
                                        {loadingFuel ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading fuel records...</p>
                                                </div>
                                            </div>
                                        ) : fuelRecords.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No fuel records found</p>
                                            </div>
                                        ) : (
                                            fuelRecords.map((record) => (
                                                <Link
                                                    key={record.id}
                                                    to={`/fuels/${record.id}/FuelDetail`}
                                                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                                    {/* {record.vendor?.name || `Vendor #${record.vendor_id}`} */}
                                                                </h3>
                                                                <span className="text-base font-semibold text-gray-900 dark:text-white">
                                                                    {record.fuel_type ? record.fuel_type.charAt(0).toUpperCase() + record.fuel_type.slice(1) : 'N/A'}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.units} {record.unit_type === 'us_gallons' ? 'gal' : record.unit_type === 'liters' ? 'L' : 'gal (UK)'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price/Unit</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    ${Number(record.price_per_volume_unit).toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Cost</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    ${(record.units * record.price_per_volume_unit).toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Odometer</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.vehicle_meter}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'issue' && (
                                    <div className="space-y-4">
                                        {loadingIssues ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading issue records...</p>
                                                </div>
                                            </div>
                                        ) : issueRecords.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No issue records found</p>
                                            </div>
                                        ) : (
                                            issueRecords.map((record) => (
                                                <Link
                                                    key={record.id}
                                                    to={`/issues/${record.id}`}
                                                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="md:text-base text-sm font-normal text-[#1D2939]">
                                                                Issue-{record.id}
                                                            </h3>

                                                            <Badge size="sm" variant="outline">
                                                                {record.priority || "N/A"}
                                                            </Badge>
                                                        </div>
                                                        <div className=" grid grid-cols-5 gap-2">
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.vehicle?.vehicle_name || "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Summary</p>
                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                    {record.summary || "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                                    {record.status || "N/A"}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.assigned_to
                                                                        ? `${record.assigned_to.first_name} ${record.assigned_to.last_name}`
                                                                        : "Unassigned"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Reported Date</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.reported_date
                                                                        ? new Date(record.reported_date).toLocaleDateString("en-US", {
                                                                            year: "numeric",
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        })
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reminders' && (
                                    <div className="space-y-4">
                                        {loadingReminders ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading service reminders...</p>
                                                </div>
                                            </div>
                                        ) : serviceReminders.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No service reminders found</p>
                                            </div>
                                        ) : (
                                            serviceReminders.map((record) => (
                                                <Link
                                                    key={record.id}
                                                    to={`/service-reminders/${record.id}`}
                                                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        {/* HEADER */}
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="md:text-base text-sm font-normal text-[#1D2939]">
                                                                REM-{record.id}
                                                            </h3>

                                                            <Badge size="sm" variant="outline">
                                                                {record.status || "N/A"}
                                                            </Badge>
                                                        </div>

                                                        {/* GRID CONTENT */}
                                                        <div className="grid grid-cols-6 gap-2">

                                                            {/* Vehicle Name */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.vehicle?.vehicle_name || "N/A"}
                                                                </p>
                                                            </div>

                                                            {/* Service Task */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Service Task</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.service_task?.name || "N/A"}
                                                                </p>
                                                            </div>

                                                            {/* Time Interval */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Time Interval</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.time_interval_value
                                                                        ? `${record.time_interval_value} ${record.time_interval_unit}`
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                            {/* Meter Interval */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Meter Interval</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.primary_meter_interval_value
                                                                        ? `${record.primary_meter_interval_value} ${record.primary_meter_interval_unit}`
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                            {/* Next Due Date */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Next Due Date</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.next_due_date
                                                                        ? new Date(record.next_due_date).toLocaleDateString("en-US", {
                                                                            year: "numeric",
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        })
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                            {/* Next Due Meter */}
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Next Due Meter</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {record.next_due_meter || "N/A"}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'services' && (
                                    <div className="space-y-4">
                                        {loadingServices ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading service records...</p>
                                                </div>
                                            </div>
                                        ) : serviceRecords.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No service records found</p>
                                            </div>
                                        ) : (
                                            serviceRecords.map((record) => (
                                                <Link
                                                    key={record.id}
                                                    to={`/services/${record.id}`}
                                                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="md:text-base text-sm font-normal text-[#1D2939] dark:text-white">SVC-{record.id}</h3>
                                                            <Badge size="sm" variant="outline">{record.repair_priority_class}</Badge>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.vendor?.name || "N/A"}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicle</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.vehicle?.vehicle_name || "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Meter</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.hour_meter ?? "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion Date</p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {record.completion_date
                                                                        ? new Date(record.completion_date).toLocaleDateString(
                                                                            "en-US",
                                                                            {
                                                                                year: "numeric",
                                                                                month: "short",
                                                                                day: "numeric",
                                                                            }
                                                                        )
                                                                        : "No Date"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-4">
                                        {loadingDocuments ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
                                                </div>
                                            </div>
                                        ) : documents.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No documents found</p>
                                            </div>
                                        ) : (
                                            documents.map((document) => (
                                                <div key={document.id} className="flex items-center gap-4 p-4 bg-[#F9FAFB] border border-gray-200 rounded-lg">
                                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                                        <FileIcon className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{document.title}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded: {document.uploadedDate}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expires</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{document.expiresDate}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
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
                </div>
            </div>
        </>
    );
}
