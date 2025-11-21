import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "../../icons";
import { useNavigate, useParams } from "react-router";
import { expenseService } from "../../services/expenseService";

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

export default function ExpenseHistoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await expenseService.getById(parseInt(id || '0'));
                setExpense(response.data.expense);
            } catch (error) {
                console.error("Failed to load expense:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpense();
    }, [id]);

    const formatExpenseType = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Loading expense details...
                    </p>
                </div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Expense not found</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/expense-history")}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors dark:border-white/10 dark:hover:bg-white/5"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Expense Detail
                    </h1>
                </div>
            </div>

            <div className="flex md:flex-nowrap flex-wrap gap-6 mt-6">
                <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 dark:border-gray-800 max-w-[767px]:max-w-full lg:max-w-[387px] max-w-full w-full">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">All Details</h3>
                    <div className="space-y-4" key={expense.id}>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Expense ID</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                #{expense.id}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {expense.vehicle?.name || `Vehicle #${expense.vehicle_id}`}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Expense Type</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatExpenseType(expense.expense_type)}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                            <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                                ${Number(expense.amount).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatDate(expense.date)}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vendor</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {expense.vendor?.name || '--'}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {expense.frequency === 'single' ? 'Single Expense' : 'Recurring Expense'}
                            </span>
                        </div>

                        {expense.frequency === 'recurring' && expense.recurrence_period && (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Recurrence Period</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {expense.recurrence_period.charAt(0).toUpperCase() + expense.recurrence_period.slice(1)}
                                </span>
                            </div>
                        )}

                        {expense.reference_type && (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Reference Type</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {expense.reference_type}
                                </span>
                            </div>
                        )}

                        {expense.reference_id && (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Reference ID</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    #{expense.reference_id}
                                </span>
                            </div>
                        )}

                        {expense.notes && (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Notes</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {expense.notes}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 dark:border-gray-800 w-full lg:p-6 p-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Expense Summary</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-2">Total Amount</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                                    ${Number(expense.amount).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-2">Expense Type</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {formatExpenseType(expense.expense_type)}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-2">Frequency</span>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {expense.frequency === 'single' ? 'Single' : 'Recurring'}
                                </span>
                            </div>
                            {expense.frequency === 'recurring' && expense.recurrence_period && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {expense.recurrence_period.charAt(0).toUpperCase() + expense.recurrence_period.slice(1)}
                                </div>
                            )}
                        </div>
                    </div>

                    {expense.notes && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {expense.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
