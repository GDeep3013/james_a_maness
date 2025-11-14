import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { vehicleService } from '../../services/vehicleService';
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
    station: string;
    date: string;
    gallons: string;
    cost: string;
    mpg: string;
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
    const [activeTab, setActiveTab] = useState('maintenance');

    const [maintenanceRecords] = useState<MaintenanceRecord[]>([
        { id: 1, name: 'Oil Change', date: '2023-06-01', mileage: '123,000 mi', cost: '$250', status: 'Completed' },
        { id: 2, name: 'Tire Rotation', date: '2023-05-15', mileage: '120,000 mi', cost: '$120', status: 'Completed' },
        { id: 3, name: 'Brake Inspection', date: '2023-04-20', mileage: '118,000 mi', cost: '$180', status: 'Completed' },
        { id: 4, name: 'Engine Tune-up', date: '2023-03-10', mileage: '115,000 mi', cost: '$450', status: 'Completed' },
    ]);

    const [fuelRecords] = useState<FuelRecord[]>([
        { id: 1, station: 'Shell - New York', date: '2023-06-28', gallons: '85 gal', cost: '$340', mpg: '7.2' },
        { id: 2, station: 'BP - Philadelphia', date: '2023-06-20', gallons: '90 gal', cost: '$360', mpg: '7.5' },
        { id: 3, station: 'Exxon - Baltimore', date: '2023-06-12', gallons: '88 gal', cost: '$352', mpg: '7.3' },
    ]);

    const [documents] = useState<Document[]>([
        { id: 1, title: 'Registration Certificate', uploadedDate: '2023-01-15', expiresDate: '2024-01-15' },
        { id: 2, title: 'Insurance Policy', uploadedDate: '2023-01-20', expiresDate: '2024-01-20' },
        { id: 3, title: 'Inspection Report', uploadedDate: '2023-06-01', expiresDate: '2024-06-01' },
    ]);

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
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
                            { capitalizeFirst(vehicle.vehicle_name)}
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

                <div className="">


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
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{ capitalizeFirst(vehicle.fuel_type) || 'N/A'}</p>
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
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 md:max-w-[260px] lg:max-w-[387px] max-w-full w-full">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Information</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                    <span className="inline-block">
                                    <Badge color={getStatusBadgeColor(vehicle.initial_status)} size="sm">
                                        {getStatusLabel(vehicle.initial_status)}
                                    </Badge>
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle Name </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        { capitalizeFirst(vehicle.vehicle_name)}
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
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ capitalizeFirst(vehicle.year) || 'N/A'}</span>
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
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ capitalizeFirst(vehicle.color) || 'N/A'}</span>
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
                                        { capitalizeFirst(vehicle.transmission) || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Date</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(vehicle.purchase_date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 w-full">
                           

                            <div className="lg:p-6 p-3">
                            <nav className="flex bg-[#ECECF0] md:mb-8 mb-4 rounded-[32px] p-1">
                                    <button
                                        onClick={() => setActiveTab('maintenance')}
                                        className={`lg:px-4 px-2 py-3 lg:text-sm text-xs font-medium transition-colors rounded-[43px] w-full shadow-none ${activeTab === 'maintenance'
                                                ? 'bg-white text-brand-600 dark:text-brand-400'
                                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                            }`}
                                    >
                                        Maintenance History
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
                                        {maintenanceRecords.map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-4 bg-[#F9FAFB]  rounded-lg">
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
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'fuel' && (
                                    <div className="space-y-4">
                                        {fuelRecords.map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{record.station}</h3>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">{record.date}</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gallons</p>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.gallons}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cost</p>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.cost}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">MPG</p>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.mpg}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-4">
                                        {documents.map((document) => (
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
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                     <div className='current-assignment mt-6'>
                     <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm">
                        <h3 className="text-[18px] font-medium text-[#1D2939] mb-4">Current Assignment</h3>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                            <div className="flex-1">
                                <span className="block text-sm text-[#595959] mb-1">Assigned Driver</span>
                                <span className="block text-base text-[#1D2939]">
                                    { capitalizeFirst(vehicle.assigned_driver) || 'Not Assigned'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm text-[#595959] mb-1">Primary Location</span>
                                <span className="block text-base text-[#1D2939]">{ capitalizeFirst(vehicle.primary_location) || 'N/A'}</span>
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm text-[#595959] mb-1">Department</span>
                                <span className="block text-base text-[#1D2939]">
                                    { capitalizeFirst(vehicle.department) || 'N/A'}
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
