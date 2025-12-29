import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { fuelService } from "../../services/fuelService";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";
import { formatTypeModel } from "../../utilites/vehicleUtils";
import { FuelRecord as Fuel , FuelsResponse } from "../../types/FuelRecordTypes";

interface FuelListProps {
  setIsRefersh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FuelsList({ setIsRefersh, }: FuelListProps ) {
    const navigate = useNavigate();
    const [fuels, setFuels] = useState<Fuel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    // const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
    });
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchFuels = useCallback(async (page: number = 1, search: string = "") => {
        setLoading(true);
        setError("");
        try {
            const response = await fuelService.getAll({ page, search });
            const data = response.data as FuelsResponse;
            if (data.status && data.fuel) {
                setFuels(data.fuel.data || []);
                setPagination({
                    current_page: data.fuel.current_page,
                    last_page: data.fuel.last_page,
                    per_page: data.fuel.per_page,
                    total: data.fuel.total,
                });
            } else {
                setError("Failed to load fuel entries");
                setFuels([]);
            }
        } catch {
            setError("An error occurred while loading fuel entries");
            setFuels([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFuels(currentPage);
    }, [currentPage, fetchFuels]);

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setCurrentPage(1);
    //     fetchFuels(1, searchTerm);
    // };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this fuel entry?")) {
            return;
        }

        setDeletingId(id);
        try {
            await fuelService.delete(id);
            fetchFuels(currentPage);
            setIsRefersh(true)
        } catch {
            alert("Failed to delete fuel entry. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/fuels/${id}/edit`);
    };

    const handleView = (id: number) => {
        navigate(`/fuels/${id}/FuelDetail`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // const handleExport = () => {
    //     //  Implement export
    // };

    const formatUnitType = (unitType: string) => {
        const unitTypes: Record<string, string> = {
            us_gallons: "US Gallons",
            liters: "Liters",
            uk_gallons: "UK Gallons",
        };
        return unitTypes[unitType] || unitType;
    };

    const calculateTotalCost = (units: number, pricePerUnit: number) => {
        return (units * pricePerUnit).toFixed(2);
    };

    const calculateMilage = (previousMeter: number, vehicleMeter: number, units: number) => {
        return ((vehicleMeter - previousMeter) / units).toFixed(2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    return (
        <>
            <PageMeta
                title="Fuel Entries List"
                description="Manage and view all fuel entries"
            />

            <div className="space-y-6">
                {error && (
                    <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="max-w-full overflow-hidden overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Loading fuel entries...
                                    </p>
                                </div>
                            </div>
                        ) : fuels.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No fuel entries found
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/5">
                                        <TableRow className="bg-[#E5E7EB]">

                                            <TableCell isHeader >
                                                Vehicle
                                            </TableCell>
                                            <TableCell isHeader >
                                                Vendor Name
                                            </TableCell>
                                            <TableCell isHeader >
                                                Gallons
                                            </TableCell>
                                            <TableCell isHeader >
                                                Quantity
                                            </TableCell>
                                            <TableCell isHeader >
                                                Price/Unit
                                            </TableCell>
                                            <TableCell isHeader >
                                                Cost
                                            </TableCell>
                                            <TableCell isHeader>
                                                MPG
                                            </TableCell>

                                            <TableCell isHeader >
                                                Date
                                            </TableCell>

                                            <TableCell isHeader >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {fuels.map((fuel) => (
                                            <TableRow key={fuel.id}>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm">
                                                        { formatTypeModel(fuel.vehicle as Fuel["vehicle"]) }
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm">
                                                        {fuel.vendor?.name || `Vendor #${fuel.vendor_id}`}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm">
                                                        {fuel.units} {' '}
                                                        {formatUnitType(fuel.unit_type)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="space-y-1">
                                                        <div className="text-gray-800  text-theme-sm">
                                                            {fuel.vehicle_meter} {' '}   <span className="text-theme-sm">mi</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm   ">
                                                        ${Number(fuel.price_per_volume_unit).toFixed(2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="font-semibold  text-theme-sm">
                                                        ${calculateTotalCost(fuel.units, fuel.price_per_volume_unit)}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm   ">
                                                        {calculateMilage(fuel.previous_meter, Number(fuel.vehicle_meter), fuel.units)} {' gpm'}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800  text-theme-sm">
                                                        {formatDate(fuel.date)}
                                                    </span>
                                                </TableCell>




                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="">
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleView(fuel.id)}
                                                            className="view-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<EyeIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleEdit(fuel.id)}
                                                            className="edit-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<PencilIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleDelete(fuel.id)}
                                                            disabled={deletingId === fuel.id}
                                                            className="delete-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<TrashBinIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TableFooter
                                    pagination={pagination}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    loading={loading}
                                    itemLabel="fuel entries"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
