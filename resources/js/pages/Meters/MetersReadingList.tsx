import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { meterReadingService } from "../../services/meterReadingService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface MeterReading {
    id: number;
    user_id: number;
    vehicle_id: number;
    vehicle_meter: string;
    date: string;
    vehicle?: {
        id: number;
        vehicle_name: string;
    };
    user?: {
        id: number;
        name: string;
    };
    created_at?: string;
}

interface MeterReadingsResponse {
    status: boolean;
    meterReading: {
        data: MeterReading[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function MeterReadingsList() {
    const navigate = useNavigate();
    const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
    });
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchMeterReadings = useCallback(async (page: number = 1, search: string = "") => {
        setLoading(true);
        setError("");
        try {
            const response = await meterReadingService.getAll({ page, search });
            const data = response.data as MeterReadingsResponse;

            if (data.status && data.meterReading) {
                setMeterReadings(data.meterReading.data || []);
                setPagination({
                    current_page: data.meterReading.current_page,
                    last_page: data.meterReading.last_page,
                    per_page: data.meterReading.per_page,
                    total: data.meterReading.total,
                });
            } else {
                setError("Failed to load meter readings");
                setMeterReadings([]);
            }
        } catch {
            setError("An error occurred while loading meter readings");
            setMeterReadings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMeterReadings(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchMeterReadings]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMeterReadings(1, searchTerm);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this meter history?")) {
            return;
        }

        setDeletingId(id);
        try {
            await meterReadingService.delete(id);
            fetchMeterReadings(currentPage, searchTerm);
        } catch {
            alert("Failed to delete meter history. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/meter-history/${id}/edit`);
    };

    const handleView = (id: number) => {
        navigate(`/meter-history/${id}/MeterReadingDetail`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleExport = async () => {
        try {
            const response = await meterReadingService.export({
                search: searchTerm,
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `meter_readings_export_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export meter readings. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <PageMeta
                title="Meter Readings List"
                description="Manage and view all meter readings"
            />

            <div className="space-y-6">
                <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full max-w-full md:max-w-[70%]">
                            <Input
                                type="text"
                                placeholder="Search by vehicle or meter reading..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800 w-full max-w-100 md:max-w-[10%] min-h-[44px] !leading-[44px]"
                        >
                            <ExportIcon />
                            Export
                        </Button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                    <div className="max-w-full overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Loading meter readings...
                                    </p>
                                </div>
                            </div>
                        ) : meterReadings.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No meter readings found
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/5">
                                        <TableRow className="bg-[#E5E7EB]">
                                            <TableCell
                                                isHeader
                                            >
                                                Date
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Vehicle
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Meter Reading
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Recorded At
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {meterReadings.map((reading) => (
                                            <TableRow key={reading.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {formatDate(reading.date)}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        ID: {reading.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm dark:text-white/90">
                                                        {reading.vehicle?.vehicle_name || `Vehicle #${reading.vehicle_id}`}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="font-semibold text-brand-600 text-theme-sm dark:text-brand-400">
                                                        {reading.vehicle_meter}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm dark:text-white/90">
                                                        {reading.created_at ? formatDateTime(reading.created_at) : 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleView(reading.id)}
                                                            className="view-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<EyeIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleEdit(reading.id)}
                                                            className="edit-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<PencilIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleDelete(reading.id)}
                                                            disabled={deletingId === reading.id}
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
                                    itemLabel="meter readings"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
