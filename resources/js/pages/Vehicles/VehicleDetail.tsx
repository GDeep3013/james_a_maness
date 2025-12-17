import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { vehicleService } from '../../services/vehicleService';
import FuelTab from '../../components/vehicles/FuelTab';
import RemindersTab from '../../components/vehicles/RemindersTab';
import DocumentsTab from '../../components/vehicles/DocumentsTab';
import MaintenanceTab from '../../components/vehicles/MaintenanceTab';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';
import { ChevronLeftIcon, PencilIcon, TrashBinIcon, CalenderIcon, PurchasePriceIcon, FuelIcon, TotalMileageIcon } from '../../icons';
import { VehicleFormData } from '../../constants/vehicleConstants';
import {
    formatCurrency,
    formatMileage,
    formatDate,
    getStatusBadgeColor,
    getStatusLabel,
    formatVehicleIdentifier,
    capitalizeFirst,
} from '../../utilites';

export default function VehicleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<VehicleFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState('fuel');


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
                    <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                        <p className="text-sm text-error-600">
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
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                {capitalizeFirst(vehicle.vehicle_name)}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 w-full">
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
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <CalenderIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Next Service</p>
                                    <p className="text-sm font-semibold text-gray-900">N/A</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FuelIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Fuel Type</p>
                                    <p className="text-sm font-semibold text-gray-900">{capitalizeFirst(vehicle.fuel_type) || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <TotalMileageIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Mileage</p>
                                    <p className="text-sm font-semibold text-gray-900">{totalMileage}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <PurchasePriceIcon className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Purchase Price</p>
                                    <p className="text-sm font-semibold text-gray-900">{purchasePrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-nowrap flex-wrap gap-6">
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200  w-full">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
                            <div className="space-y-4 flex item-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Status </span>
                                    <span className="inline-block">
                                        <Badge color={getStatusBadgeColor(vehicle.initial_status)} size="sm">
                                            {getStatusLabel(vehicle.initial_status)}
                                        </Badge>
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Vehicle Name </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {capitalizeFirst(vehicle.vehicle_name)}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Make & Model</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {vehicle.make && vehicle.model ? `${capitalizeFirst(vehicle.make)} ${capitalizeFirst(vehicle.model)}` : capitalizeFirst(vehicle.vehicle_name)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Year</span>
                                    <span className="text-sm font-medium text-gray-900">{capitalizeFirst(vehicle.year) || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">VIN</span>
                                    <span className="text-sm font-medium text-gray-900">{vehicle.vin || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">License Plate</span>
                                    <span className="text-sm font-medium text-gray-900">{vehicle.license_plate || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Color</span>
                                    <span className="text-sm font-medium text-gray-900">{capitalizeFirst(vehicle.color) || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Engine Size</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {vehicle.engine_size ? `${vehicle.engine_size}L` : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Transmission</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {capitalizeFirst(vehicle.transmission) || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Purchase Date</span>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(vehicle.purchase_date)}</span>
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

                    <div className="bg-white rounded-lg border border-gray-200 w-full mt-6">
                        <div className="lg:p-6 p-3">
                            <nav className="flex bg-[#ECECF0] md:mb-8 mb-4 rounded-[32px] p-1">

                                <button
                                    onClick={() => setActiveTab('maintenance')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'maintenance'
                                        ? 'bg-white text-brand-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Maintenance History
                                </button>



                                <button
                                    onClick={() => setActiveTab('fuel')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'fuel'
                                        ? 'bg-white text-brand-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Fuel Records
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

                                <button
                                    onClick={() => setActiveTab('reminders')}
                                    className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none whitespace-nowrap ${activeTab === 'reminders'
                                        ? 'bg-white text-brand-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Service Reminders
                                </button>

                            </nav>

                            <FuelTab activeTab={activeTab} />
                            <RemindersTab activeTab={activeTab} />
                            <MaintenanceTab activeTab={activeTab} />
                            <DocumentsTab activeTab={activeTab} />

                        </div>

                    </div>


                </div>
            </div>
        </>
    );
}
