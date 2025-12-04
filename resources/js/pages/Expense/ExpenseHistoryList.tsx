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
import { expenseService } from "../../services/expenseService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface Expense {
    id: number;
    vehicle_id: number;
    vendor_id?: number;
    expense_type: string;
    amount: number;
    date: string;
    notes?: string;
    reference_id?: number;
    reference_type?: string;
    frequency: string;
    recurrence_period?: string;
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

interface ExpensesResponse {
    status: boolean;
    expense: {
        data: Expense[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ExpenseHistoryList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([]);
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

    const fetchExpenses = useCallback(async (page: number = 1, search: string = "") => {
        setLoading(true);
        setError("");
        try {
            const response = await expenseService.getAll({ page, search });
            const data = response.data as ExpensesResponse;

            if (data.status && data.expense) {
                setExpenses(data.expense.data || []);
                setPagination({
                    current_page: data.expense.current_page,
                    last_page: data.expense.last_page,
                    per_page: data.expense.per_page,
                    total: data.expense.total,
                });
            } else {
                setError("Failed to load expense entries");
                setExpenses([]);
            }
        } catch {
            setError("An error occurred while loading expense entries");
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpenses(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchExpenses]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchExpenses(1, searchTerm);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this expense entry?")) {
            return;
        }

        setDeletingId(id);
        try {
            await expenseService.delete(id);
            fetchExpenses(currentPage, searchTerm);
        } catch {
            alert("Failed to delete expense entry. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/expense-history/${id}/edit`);
    };

    const handleView = (id: number) => {
        navigate(`/expense-history/${id}/ExpenseHistoryDetail`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleExport = () => {
        // Implement export functionality
    };

    const formatExpenseType = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <PageMeta
                title="Expense History"
                description="Manage and view all expense entries"
            />

            <div className="space-y-6">
                <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full max-w-full md:max-w-[70%]">
                            <Input
                                type="text"
                                placeholder="Search by vehicle, expense type, or amount..."
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
                                        Loading expense entries...
                                    </p>
                                </div>
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No expense entries found
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
                                                Expense Type
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Amount
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Vendor
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                           >
                                                Frequency
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {expenses.map((expense) => (
                                            <TableRow key={expense.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {formatDate(expense.date)}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        ID: {expense.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm dark:text-white/90">
                                                        {expense.vehicle?.name || `Vehicle #${expense.vehicle_id}`}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm dark:text-white/90">
                                                        {formatExpenseType(expense.expense_type)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="font-semibold text-brand-600 text-theme-sm dark:text-brand-400">
                                                        ${Number(expense.amount).toFixed(2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <span className="text-gray-800 text-theme-sm dark:text-white/90">
                                                        {expense.vendor?.name || '--'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="space-y-1">
                                                        <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                                            {expense.frequency === 'single' ? 'Single' : 'Recurring'}
                                                        </div>
                                                        {expense.frequency === 'recurring' && expense.recurrence_period && (
                                                            <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                                {expense.recurrence_period.charAt(0).toUpperCase() + expense.recurrence_period.slice(1)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleView(expense.id)}
                                                            className="view-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<EyeIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleEdit(expense.id)}
                                                            className="edit-button hover:scale-105 transition-all duration-300"
                                                            startIcon={<PencilIcon />}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleDelete(expense.id)}
                                                            disabled={deletingId === expense.id}
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
                                    itemLabel="expense entries"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
