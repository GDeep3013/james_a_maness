import React, { useState } from "react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { formatTypeModel, formatMileage, formatVehicleIdentifier, getStatusBadgeColor, getStatusLabel, capitalize, formatDate } from "../../utilites";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Vehicle } from "../../types/VehicleTypes";
import { vehicleService } from "../../services/vehicleService";

interface VehicleAssignmentsProps {
    vehicles?: Vehicle[];
    onUnassign?: () => void;
}

export default function VehicleAssignments({ vehicles = [], onUnassign }: VehicleAssignmentsProps) {
    const navigate = useNavigate();
    const [unassigningVehicleId, setUnassigningVehicleId] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    const handleVehicleClick = (id: number) => {
        navigate(`/vehicles/${id}`);
    };

    const handleUnassign = async (vehicleId: number, vehicleName: string) => {
        if (!window.confirm(`Are you sure you want to unassign "${vehicleName}" from this contact?`)) {
            return;
        }

        setUnassigningVehicleId(vehicleId);
        setError("");
        
        try {
            await vehicleService.updateAssignedDriver(vehicleId, null);
            
            if (onUnassign) {
                onUnassign();
            }
        } catch (err) {
            setError("Failed to unassign vehicle. Please try again.");
            console.error("Error unassigning vehicle:", err);
        } finally {
            setUnassigningVehicleId(null);
        }
    };

    if (vehicles.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        No vehicles assigned to this contact
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
                            <TableCell isHeader>
                                Location
                            </TableCell>
                            <TableCell isHeader>
                                Next Service
                            </TableCell>
                            <TableCell isHeader>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100">
                        {vehicles.map((vehicle) => {
                            const vehicleId = formatVehicleIdentifier(vehicle.type, vehicle.id);

                            return (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="px-5 py-4 text-start">
                                        <button
                                            onClick={() => handleVehicleClick(vehicle.id)}
                                            className="text-theme-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors dark:text-white/90"
                                        >
                                            {vehicleId || "—"}
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        {formatTypeModel(vehicle)}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <Badge
                                            size="sm"
                                            color={getStatusBadgeColor(vehicle.initial_status)}
                                        >
                                            {getStatusLabel(vehicle.initial_status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                            {vehicle.vin || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                            {vehicle.current_mileage ? formatMileage(vehicle.current_mileage) : "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                            {capitalize(vehicle.primary_location) || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                            {vehicle.next_service_date ? formatDate(vehicle.next_service_date) : "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUnassign(vehicle.id, vehicle.vehicle_name || `Vehicle ${vehicle.id}`)}
                                            disabled={unassigningVehicleId === vehicle.id}
                                        >
                                            {unassigningVehicleId === vehicle.id ? "Unassigning..." : "Unassign"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            {error && (
                <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                    <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                </div>
            )}
        </div>
    );
}

