import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import PageMeta from "../../../components/common/PageMeta";
import { maintenanceRecordService } from "../../../services/maintenanceRecordService";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../../icons";
import TableFooter, { PaginationData } from "../../../components/common/TableFooter";
import { formatDate, formatCurrency } from "../../../utilites";

interface MaintenanceRecord {
    id: number;
    vehicle_id?: number;
    vendor_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    vendor?: {
        id?: number;
        name?: string;
    };
    actual_start_date?: string;
    actual_completion_date?: string;
    total_value?: number;
    invoice_number?: string;
    po_number?: string;
    sale_type?: string;
    date?: string;
    user?: {
        id?: number;
        name?: string;
    };
    created_at?: string;
}

interface MaintenanceRecordsResponse {
    status: boolean;
    maintenance_records: {
        data: MaintenanceRecord[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function MaintenanceReportList() {
    const navigate = useNavigate();
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
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

    const fetchRecords = useCallback(async (page: number = 1, search: string = "") => {
        setLoading(true);
        setError("");
        try {
            const response = await maintenanceRecordService.getAll({ page, search });
            const data = response.data as MaintenanceRecordsResponse;

            if (data.status && data.maintenance_records) {
                setRecords(data.maintenance_records.data || []);
                setPagination({
                    current_page: data.maintenance_records.current_page,
                    last_page: data.maintenance_records.last_page,
                    per_page: data.maintenance_records.per_page,
                    total: data.maintenance_records.total,
                });
            } else {
                setError("Failed to load maintenance records");
                setRecords([]);
            }
        } catch {
            setError("An error occurred while loading maintenance records");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchRecords]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchRecords(1, searchTerm);
    };

    const handleView = (id: number) => {
        navigate(`/reports/maintenance/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/reports/maintenance/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this maintenance record?")) {
            return;
        }

        setDeletingId(id);
        try {
            await maintenanceRecordService.delete(id);
            fetchRecords(currentPage, searchTerm);
        } catch {
            alert("Failed to delete maintenance record. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleCreate = () => {
        navigate("/reports/maintenance/create");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <PageMeta
                title="Maintenance Records List"
                description="View and manage maintenance records"
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Maintenance Reports</h1>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreate}
                    >
                        + Add Maintenance Report
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 w-full max-w-full md:max-w-[50%]">
                            <Input
                                type="text"
                                placeholder="Search by vehicle, vendor, invoice number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="!bg-[#F3F3F5] dark:!bg-white/5 max-w-full border-none !rounded-[8px]"
                            />
                        </div>
                    </div>
                </form>

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
                                        Loading maintenance reports...
                                    </p>
                                </div>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No maintenance reports found
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/5">
                                        <TableRow className="bg-[#E5E7EB]">
                                            <TableCell isHeader> Date </TableCell>
                                            <TableCell isHeader>Vehicle</TableCell>
                                            <TableCell isHeader>Invoice Number</TableCell>
                                            <TableCell isHeader>Start Date</TableCell>
                                            <TableCell isHeader>Completion Date</TableCell>
                                            <TableCell isHeader>Total Value</TableCell>
                                            <TableCell isHeader>Actions</TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {records.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.date ? formatDate(record.date) : "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.vehicle?.vehicle_name || "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.invoice_number || "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.actual_start_date ? formatDate(record.actual_start_date) : "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.actual_completion_date ? formatDate(record.actual_completion_date) : "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm">
                                                        {record.total_value ? formatCurrency(record.total_value) : "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="">
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleView(record.id)}
                                                            className="view-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<EyeIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleEdit(record.id)}
                                                            className="edit-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<PencilIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleDelete(record.id)}
                                                            disabled={deletingId === record.id}
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
                                    itemLabel="maintenance records"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
