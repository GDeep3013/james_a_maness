import React, { useEffect, useState, useCallback } from "react";
import { Modal } from "../../components/ui/modal";
import { vehicleService } from "../../services/vehicleService";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { formatTypeModel, formatMileage, formatVehicleIdentifier , getStatusBadgeColor , getStatusLabel } from "../../utilites";

interface AddVehicleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactId: number;
    onSuccess?: () => void;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
    type?: string;
    make?: string;
    model?: string;
    year?: string;
    vin?: string;
    license_plate?: string;
    current_mileage?: string | number;
    initial_status?: string;
    primary_location?: string;
    assigned_driver?: number;
    driver?: {
        id?: number;
        first_name?: string;
        last_name?: string;
    };
}

interface VehiclesResponse {
    status: boolean;
    vehical?: {
        data: Vehicle[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function AddVehicleAssignmentModal({
    isOpen,
    onClose,
    contactId,
    onSuccess,
}: AddVehicleAssignmentModalProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [assigning, setAssigning] = useState(false);

    const fetchUnassignedVehicles = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await vehicleService.getAll({
                unassigned: true,   
                page: 1,
            });
            const data = response.data as VehiclesResponse;

            if (data.status && data.vehical) {
                setVehicles(data.vehical.data || []);
            } else {
                setError("Failed to load vehicles");
                setVehicles([]);
            }
        } catch {
            setError("An error occurred while loading vehicles");
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchUnassignedVehicles();
            setSearchTerm("");
            setSelectedVehicleId(null);
        }
    }, [isOpen, fetchUnassignedVehicles]);

    const handleAssign = async () => {
        if (!selectedVehicleId) {
            setError("Please select a vehicle");
            return;
        }

        setAssigning(true);
        setError("");
        try {
            await vehicleService.updateAssignedDriver(selectedVehicleId, contactId);

            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to assign vehicle");
        } finally {
            setAssigning(false);
        }
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            vehicle.vehicle_name?.toLowerCase().includes(searchLower) ||
            vehicle.vin?.toLowerCase().includes(searchLower) ||
            vehicle.license_plate?.toLowerCase().includes(searchLower) ||
            vehicle.make?.toLowerCase().includes(searchLower) ||
            vehicle.model?.toLowerCase().includes(searchLower) ||
            formatVehicleIdentifier(vehicle.type, vehicle.id).toLowerCase().includes(searchLower)
        );
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl m-4 max-h-[90vh] overflow-y-auto"
        >
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Add Vehicle Assignment
                </h2>

                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search vehicles by name, VIN, license plate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="!bg-[#F3F3F5] border-none !rounded-[8px]"
                    />
                </div>

                {error && !loading && (
                    <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Loading vehicles...
                            </p>
                        </div>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchTerm ? "No vehicles found matching your search" : "No unassigned vehicles available"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white mb-6">
                            <div className="max-w-full overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-gray-100">
                                        <TableRow className="bg-[#E5E7EB]">
                                            <TableCell isHeader>
                                                Select
                                            </TableCell>
                                            <TableCell isHeader>
                                                Vehicle ID
                                            </TableCell>
                                            <TableCell isHeader>
                                                Vehicle Details
                                            </TableCell>
                                            <TableCell isHeader>
                                                Status
                                            </TableCell>
                                            <TableCell isHeader>
                                                VIN
                                            </TableCell>
                                            <TableCell isHeader>
                                                Mileage
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100">
                                        {filteredVehicles.map((vehicle) => {
                                            const vehicleId = formatVehicleIdentifier(vehicle.type, vehicle.id);
                                            const isSelected = selectedVehicleId === vehicle.id;

                                            return (
                                                <TableRow
                                                    key={vehicle.id}
                                                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                >
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <input
                                                            type="radio"
                                                            name="vehicle"
                                                            checked={isSelected}
                                                            onChange={() => setSelectedVehicleId(vehicle.id)}
                                                            className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <div className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                                                            {vehicleId || "—"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        {formatTypeModel(vehicle)}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <Badge
                                                            size="sm"
                                                            color={getStatusBadgeColor(vehicle.initial_status)}
                                                        >
                                                            {getStatusLabel(vehicle.initial_status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                                            {vehicle.vin || "—"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                                            {vehicle.current_mileage ? formatMileage(vehicle.current_mileage) : "—"}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onClose}
                                disabled={assigning}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={handleAssign}
                                disabled={!selectedVehicleId || assigning}
                            >
                                {assigning ? "Assigning..." : "Assign Vehicle"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}

