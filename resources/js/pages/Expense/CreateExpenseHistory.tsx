import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { expenseService } from "../../services/expenseService";
import { vehicleService } from "../../services/vehicleService";
import { vendorService } from "../../services/vendorService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export interface ExpenseFormData {
    vehicle_id: string;
    vendor_id: string;
    expense_type: string;
    amount: string;
    date: string;
    notes: string;
    reference_id: string;
    reference_type: string;
    frequency: string;
    recurrence_period: string;
}

interface ExpenseApiPayload {
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
}

export default function CreateExpenseHistory() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);

    const [formData, setFormData] = useState<ExpenseFormData>({
        vehicle_id: "",
        vendor_id: "",
        expense_type: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        reference_id: "",
        reference_type: "",
        frequency: "single",
        recurrence_period: "",
    });

    const [vehicles, setVehicles] = useState<Array<{ value: string; label: string }>>([]);
    const [vendors, setVendors] = useState<Array<{ value: string; label: string }>>([]);

    const expenseTypeOptions = [
        { value: "down_payment", label: "Down Payment" },
        { value: "maintenance", label: "Maintenance" },
        { value: "insurance", label: "Insurance" },
        { value: "registration", label: "Registration" },
        { value: "repair", label: "Repair" },
        { value: "loan_payment", label: "Loan Payment" },
        { value: "parking", label: "Parking" },
        { value: "toll", label: "Toll" },
        { value: "other", label: "Other" },
    ];

    const recurrencePeriodOptions = [
        { value: "monthly", label: "Monthly" },
        { value: "annual", label: "Annual" },
    ];

    useEffect(() => {
        fetchDropdownData();

        if (isEditMode && id) {
            fetchExpenseData(parseInt(id));
        }
    }, [isEditMode, id]);

    const fetchDropdownData = async () => {
        try {
            const [vehiclesRes, vendorsRes] = await Promise.all([
                vehicleService.getAll(),
                vendorService.getAll(),
            ]);

            const vehicleOptions = (vehiclesRes.data.vehical || vehiclesRes.data.vehicles || []).map((vehicle: any) => ({
                value: String(vehicle.id),
                label: vehicle.name || `Vehicle #${vehicle.id}`,
            }));

            const vendorOptions = (vendorsRes.data.vendor || vendorsRes.data.vendors || []).map((vendor: any) => ({
                value: String(vendor.id),
                label: vendor.name || `Vendor #${vendor.id}`,
            }));

            setVehicles(vehicleOptions);
            setVendors(vendorOptions);
        } catch (error) {
            console.error("Failed to load dropdown data:", error);
            setGeneralError("Failed to load form data. Please refresh the page.");
        }
    };

    const fetchExpenseData = async (expenseId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await expenseService.getForEdit(expenseId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const expense = data.data;

                setFormData({
                    vehicle_id: String(expense.vehicle_id || ""),
                    vendor_id: String(expense.vendor_id || ""),
                    expense_type: String(expense.expense_type || ""),
                    amount: String(expense.amount || ""),
                    date: expense.date ? String(expense.date).split('T')[0] : new Date().toISOString().split('T')[0],
                    notes: String(expense.notes || ""),
                    reference_id: String(expense.reference_id || ""),
                    reference_type: String(expense.reference_type || ""),
                    frequency: String(expense.frequency || "single"),
                    recurrence_period: String(expense.recurrence_period || ""),
                });
            }
        } catch (error) {
            console.error("Failed to load expense data:", error);
            setGeneralError("Failed to load expense data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (name: keyof ExpenseFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (name: keyof ExpenseFormData) => (_dates: unknown, currentDateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: currentDateString }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: keyof ExpenseFormData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.vehicle_id) {
            newErrors.vehicle_id = "Vehicle is required";
        }

        if (!formData.expense_type) {
            newErrors.expense_type = "Expense type is required";
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (!formData.frequency) {
            newErrors.frequency = "Frequency is required";
        }

        if (formData.frequency === 'recurring' && !formData.recurrence_period) {
            newErrors.recurrence_period = "Recurrence period is required for recurring expenses";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const expenseData: ExpenseApiPayload = {
                vehicle_id: parseInt(formData.vehicle_id),
                vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : undefined,
                expense_type: formData.expense_type,
                amount: parseFloat(formData.amount),
                date: formData.date,
                notes: formData.notes || undefined,
                reference_id: formData.reference_id ? parseInt(formData.reference_id) : undefined,
                reference_type: formData.reference_type || undefined,
                frequency: formData.frequency,
                recurrence_period: formData.recurrence_period || undefined,
            };

            const response = isEditMode && id
                ? await expenseService.update(parseInt(id), expenseData as any)
                : await expenseService.create(expenseData as any);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                if (saveAndAddAnother && !isEditMode) {
                    setFormData({
                        vehicle_id: "",
                        vendor_id: "",
                        expense_type: "",
                        amount: "",
                        date: new Date().toISOString().split('T')[0],
                        notes: "",
                        reference_id: "",
                        reference_type: "",
                        frequency: "single",
                        recurrence_period: "",
                    });
                    setErrors({});
                    setGeneralError("");
                } else {
                    navigate("/expense-history", { replace: true });
                }
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} expense entry. Please try again.`);
            }
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response?: {
                        status?: number;
                        data?: {
                            message?: string;
                            errors?: Record<string, string[]>;
                            error?: string;
                        };
                    };
                };

                if (axiosError.response?.data?.errors) {
                    const validationErrors: Record<string, string> = {};
                    Object.keys(axiosError.response.data.errors).forEach((key) => {
                        const errorMessages = axiosError.response?.data?.errors?.[key];
                        if (errorMessages && errorMessages.length > 0) {
                            validationErrors[key] = errorMessages[0];
                        }
                    });
                    setErrors(validationErrors);
                } else {
                    setGeneralError(
                        axiosError.response?.data?.message ||
                        axiosError.response?.data?.error ||
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the expense entry. Please try again.`
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
            setSaveAndAddAnother(false);
        }
    };

    const handleSaveAndAddAnother = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveAndAddAnother(true);
        await handleSubmit(e);
    };

    const renderExpenseDetailsSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="vehicle_id">
                        Vehicle <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={vehicles}
                        placeholder="Please select"
                        onChange={handleSelectChange("vehicle_id")}
                        defaultValue={formData.vehicle_id}
                    />
                    {errors.vehicle_id && (
                        <p className="mt-1 text-sm text-error-500">{errors.vehicle_id}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="expense_type">
                        Expense Type <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={expenseTypeOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("expense_type")}
                        defaultValue={formData.expense_type}
                    />
                    {errors.expense_type && (
                        <p className="mt-1 text-sm text-error-500">{errors.expense_type}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="vendor_id">Vendor</Label>
                    <Select
                        options={vendors}
                        placeholder="Please select"
                        onChange={handleSelectChange("vendor_id")}
                        defaultValue={formData.vendor_id}
                    />
                    {errors.vendor_id && (
                        <p className="mt-1 text-sm text-error-500">{errors.vendor_id}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="amount">
                        Amount <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="amount"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        placeholder="Enter amount (e.g., 1500.00)"
                        className={errors.amount ? "border-error-500" : ""}
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-error-500">{errors.amount}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="date">
                        Date <span className="text-error-500">*</span>
                    </Label>
                    <DatePicker
                        id="date"
                        placeholder="Select date"
                        onChange={handleDateChange("date")}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-error-500">{errors.date}</p>
                    )}
                </div>

                {/* <div>
                    <Label htmlFor="frequency">
                        Frequency <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={frequencyOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("frequency")}
                        defaultValue={formData.frequency}
                    />
                    {errors.frequency && (
                        <p className="mt-1 text-sm text-error-500">{errors.frequency}</p>
                    )}
                </div> */}
                <div>
                    <Label htmlFor="frequency">
                        Frequency <span className="text-error-500">*</span>
                    </Label>

                    <div className="flex max-[767px]:flex-wrap items-start gap-3 md:gap-10 mt-2">

                        {/* Single Expense */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="single"
                                checked={formData.frequency === "single"}
                                onChange={(e) => handleInputChange("frequency", e.target.value)}
                                className="mt-1 h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
                            />

                            <div>
                                <p className="font-medium text-gray-800">Single Expense</p>
                                <p className="text-sm text-gray-500">A single entry that does not repeat</p>
                            </div>
                        </label>

                        {/* Recurring Expense */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="recurring"
                                checked={formData.frequency === "recurring"}
                                onChange={(e) => handleInputChange("frequency", e.target.value)}
                                className="mt-1 h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
                            />

                            <div>
                                <p className="font-medium text-gray-800">Recurring Expense</p>
                                <p className="text-sm text-gray-500">Repeats on a monthly or annual basis</p>
                            </div>
                        </label>
                    </div>

                    {errors.frequency && (
                        <p className="mt-1 text-sm text-error-500">{errors.frequency}</p>
                    )}
                </div>

            </div>

            {formData.frequency === 'recurring' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <Label htmlFor="recurrence_period">
                            Recurrence Period <span className="text-error-500">*</span>
                        </Label>
                        <Select
                            options={recurrencePeriodOptions}
                            placeholder="Please select"
                            onChange={handleSelectChange("recurrence_period")}
                            defaultValue={formData.recurrence_period}
                        />
                        {errors.recurrence_period && (
                            <p className="mt-1 text-sm text-error-500">{errors.recurrence_period}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="reference_type">Reference Type</Label>
                    <Input
                        type="text"
                        id="reference_type"
                        value={formData.reference_type}
                        onChange={(e) => handleInputChange("reference_type", e.target.value)}
                        placeholder="e.g., fuel, service"
                    />
                </div>

                <div>
                    <Label htmlFor="reference_id">Reference ID</Label>
                    <Input
                        type="number"
                        id="reference_id"
                        value={formData.reference_id}
                        onChange={(e) => handleInputChange("reference_id", e.target.value)}
                        placeholder="Enter reference ID"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="notes">Notes</Label>
                <TextArea
                    rows={4}
                    value={formData.notes}
                    onChange={(value) => handleInputChange("notes", value)}
                    placeholder="Enter any additional notes about this expense"
                />
            </div>
        </div>
    );

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Expense Entry" : "Create New Expense Entry"}
                description={isEditMode ? "Edit expense entry details" : "Create a new expense entry"}
            />
            <PageBreadcrumb pageTitle={[
                { name: "Expense History", to: "/expense-history" },
                { name: isEditMode ? "Edit Expense Entry" : "Create New Expense Entry", to: isEditMode ? `/expense-history/${id}` : "/expense-history/create" },
            ]} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    
                        <h1 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditMode ? "Edit Expense Entry" : "New Expense Entry"}
                        </h1>
                    </div>
                </div> 

                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl">
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Loading expense entry data...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {generalError && (
                                        <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                                            <p className="text-sm text-error-600 dark:text-error-400">{generalError}</p>
                                        </div>
                                    )}

                                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                        <h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                            Expense Details
                                        </h2>
                                        {renderExpenseDetailsSection()}
                                    </div>

                                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate("/expense-history")}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        {!isEditMode && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleSaveAndAddAnother}
                                                disabled={isSubmitting}
                                            >
                                                Save & Add Another
                                            </Button>
                                        )}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Expense" : "Save Expense")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
