import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { ChevronLeftIcon, TimeIcon } from "../../icons";
import { contactService } from "../../services/contactService";
import { issueService } from "../../services/issueService";
import { vehicleService } from "../../services/vehicleService";
import { PRIORITY_OPTIONS, LABEL_OPTIONS, ISSUE_STATUS_OPTIONS } from "../../constants/selectOptions";
import { useAuth } from "../../context/AuthContext";

interface Contact {
    id: number;
    first_name: string;
    last_name?: string;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
}

export interface IssueFormData {
    vehicle_id: number;
    asset: string;
    priority: string;
    reported_date: string;
    reported_time: string;
    summary: string;
    description: string;
    labels: string;
    primary_meter: string;
    reported_by: number;
    assigned_to: string;
    due_date: string;
    primary_meter_due: string;
    status: string;
}

export default function CreateIssue() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const isEditMode = !!id;
    const [formData, setFormData] = useState<IssueFormData>({
        vehicle_id: 0,
        asset: "",
        priority: "",
        reported_date: "",
        reported_time: "",
        summary: "",
        description: "",
        labels: "",
        primary_meter: "",
        reported_by: 0,
        assigned_to: "",
        due_date: "",
        primary_meter_due: "",
        status: "Open",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

    const fetchIssueData = useCallback(async (issueId: number) => {
        setIsLoading(true);
        try {
            const response = await issueService.getForEdit(issueId);
            if (response.data?.status && response.data?.data) {
                const issue = response.data.data as {
                    vehicle_id?: number;
                    vehicle?: { vehicle_name?: string };
                    priority?: string;
                    reported_date?: string;
                    summary?: string;
                    description?: string;
                    labels?: string;
                    primary_meter?: number | string;
                    reported_by?: number;
                    assigned_to?: number | string | { id?: number };
                    assignedTo?: { id?: number };
                    due_date?: string;
                    primary_meter_due?: number | string;
                    status?: string;
                };
                const reportedDate = issue.reported_date ? new Date(issue.reported_date) : new Date();
                const dateStr = reportedDate.toISOString().split("T")[0];
                const timeStr = reportedDate.toTimeString().slice(0, 5);

                const assignedToValue = issue.assigned_to || issue.assignedTo;
                const assignedToId = typeof assignedToValue === 'object' && assignedToValue?.id
                    ? String(assignedToValue.id)
                    : assignedToValue
                        ? String(assignedToValue)
                        : "";

                setFormData({
                    vehicle_id: issue.vehicle_id || 0,
                    asset: issue.vehicle?.vehicle_name || "",
                    priority: issue.priority || "",
                    reported_date: dateStr,
                    reported_time: timeStr,
                    summary: issue.summary || "",
                    description: issue.description || "",
                    labels: issue.labels || "",
                    primary_meter: issue.primary_meter ? String(issue.primary_meter) : "",
                    reported_by: issue.reported_by || 0,
                    assigned_to: assignedToId,
                    due_date: issue.due_date ? (issue.due_date.split(' ')[0] || issue.due_date) : "",
                    primary_meter_due: issue.primary_meter_due ? String(issue.primary_meter_due) : "",
                    status: issue.status || "Open",
                });
            }
        } catch (error) {
            console.error("Error fetching issue data:", error);
            setErrors({ general: "Failed to load issue data" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
        fetchVehicles();

        if (isEditMode && id) {
            fetchIssueData(parseInt(id));
        } else {
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            const timeStr = today.toTimeString().slice(0, 5);

            setFormData({
                vehicle_id: 0,
                asset: "",
                priority: "",
                reported_date: dateStr,
                reported_time: timeStr,
                summary: "",
                description: "",
                labels: "",
                primary_meter: "",
                reported_by: user?.id || 0,
                assigned_to: "",
                due_date: "",
                primary_meter_due: "",
                status: "Open",
            });
        }
    }, [id, isEditMode, fetchIssueData, user]);

    const fetchContacts = async () => {
        setIsLoadingContacts(true);
        try {
            const response = await contactService.getAll({ page: 1 });
            if (response.data?.status && response.data?.contact?.data) {
                setContacts(response.data.contact.data);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    };

    const fetchVehicles = async () => {
        setIsLoadingVehicles(true);
        try {
            const response = await vehicleService.getAll({ page: 1 });
            if (response.data?.status && response.data?.vehical?.data) {
                setVehicles(response.data.vehical.data);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setIsLoadingVehicles(false);
        }
    };

    const assignedToOptions = [
        { value: "", label: "Please select" },
        ...contacts.map((contact) => ({
            value: contact.id.toString(),
            label: `${contact.first_name} ${contact.last_name || ""}`.trim(),
        })),
    ];

    const vehicleOptions = [
        { value: "", label: "Please select" },
        ...vehicles.map((vehicle) => ({
            value: vehicle.id.toString(),
            label: vehicle.vehicle_name,
        })),
    ];

    const handleInputChange = (name: keyof IssueFormData, value: string | boolean | number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleVehicleChange = (value: string) => {
        const vehicleId = parseInt(value);
        const selectedVehicle = vehicles.find(v => v.id === vehicleId);
        handleInputChange("vehicle_id", vehicleId);
        handleInputChange("asset", selectedVehicle?.vehicle_name || "");
    };

    const handleDateChange = (name: string) => (dates: Date[], dateStr: string) => {
        if (dates.length > 0) {
            handleInputChange(name as keyof IssueFormData, dateStr);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.vehicle_id || formData.vehicle_id === 0) {
            newErrors.asset = "Asset is required";
        }

        if (!formData.reported_date) {
            newErrors.reported_date = "Reported date is required";
        }

        if (!formData.summary.trim()) {
            newErrors.summary = "Summary is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const issueData = {
                vehicle_id: formData.vehicle_id,
                priority: formData.priority || "",
                reported_date: formData.reported_date,
                reported_time: formData.reported_time,
                summary: formData.summary,
                description: formData.description || "",
                labels: formData.labels || "",
                primary_meter: formData.primary_meter ? parseFloat(formData.primary_meter) : undefined,
                reported_by: formData.reported_by || "",
                assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : undefined,
                due_date: formData.due_date || undefined,
                primary_meter_due: formData.primary_meter_due ? parseFloat(formData.primary_meter_due) : undefined,
                status: formData.status || "Open",
            };

            const response = isEditMode && id
                ? await issueService.update(parseInt(id), issueData)
                : await issueService.create(issueData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                navigate("/issues");
            } else {
                throw new Error(response.data?.message || "Failed to save issue");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
            if (err.response?.data?.errors) {
                const validationErrors: Record<string, string> = {};
                Object.keys(err.response.data.errors).forEach((key) => {
                    const errorMessages = err.response?.data?.errors?.[key];
                    if (errorMessages && errorMessages.length > 0) {
                        validationErrors[key] = errorMessages[0];
                    }
                });
                setErrors(validationErrors);
            } else {
                setErrors({ general: err.response?.data?.message || "Failed to save issue. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Issue" : "Create Issue"}
                description={isEditMode ? "Edit issue details" : "Create a new issue"}
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="py-2"
                            onClick={() => navigate("/issues")}
                        >
                            <ChevronLeftIcon className="size-5" />
                        </Button>
                        <h1 className="text-2xl font-medium text-gray-600 dark:text-white/90">
                            {isEditMode ? "Edit Issue" : "Create Issue"}
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/issues")}
                    >
                        Cancel
                    </Button>
                </div>

                {isLoading && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Loading issue data...</p>
                    </div>
                )}

                {errors.general && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-lg font-medium text-gray-800">
                                    Details
                                </h3>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">

                                    <div>
                                        <Label htmlFor="asset">
                                            Asset <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            options={vehicleOptions}
                                            placeholder={isLoadingVehicles ? "Loading vehicles..." : "Select vehicle"}
                                            onChange={handleVehicleChange}
                                            defaultValue={formData.vehicle_id?.toString() || ""}
                                            disabled={isLoadingVehicles}
                                        />
                                        {errors.asset && (
                                            <p className="mt-1 text-sm text-red-500">{errors.asset}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            options={PRIORITY_OPTIONS}
                                            placeholder="No Priority"
                                            onChange={(value) => handleInputChange("priority", value)}
                                            defaultValue={formData.priority}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            options={ISSUE_STATUS_OPTIONS}
                                            placeholder="Select status"
                                            onChange={(value) => handleInputChange("status", value)}
                                            defaultValue={formData.status}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                                    <div className="lg:col-span-2">
                                        <Label htmlFor="reported_date">
                                            Reported Date <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="relative">
                                                <DatePicker
                                                    id="reported_date"
                                                    label=""
                                                    placeholder="Select date"
                                                    onChange={handleDateChange("reported_date")}
                                                    defaultDate={formData.reported_date || undefined}
                                                />
                                                {errors.reported_date && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.reported_date}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    id="reported_time"
                                                    value={formData.reported_time}
                                                    onChange={(e) =>
                                                        handleInputChange("reported_time", e.target.value)
                                                    }
                                                    placeholder="Select time"
                                                />
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                    <TimeIcon className="size-6" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <Label htmlFor="summary">
                                            Summary <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="summary"
                                            value={formData.summary}
                                            onChange={(e) => handleInputChange("summary", e.target.value)}
                                            placeholder="Brief overview of the issue"
                                            className={errors.summary ? "border-red-500" : ""}
                                        />
                                        {errors.summary && (
                                            <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
                                        )}
                                    </div>

                                    <div className="lg:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            style={{
                                                minHeight: "80px",
                                                resize: "vertical",
                                                height: "auto"
                                            }}
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange("description", e.target.value)
                                            }
                                            placeholder="Detailed description of the issue"
                                            rows={4}
                                            className="h-24 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <Label htmlFor="labels">Labels</Label>
                                        <Select
                                            options={LABEL_OPTIONS}
                                            placeholder="Please select"
                                            onChange={(value) => handleInputChange("labels", value)}
                                            defaultValue={formData.labels}
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Use labels to categorize, group and more. (e.g. Electrical)
                                        </p>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <Label htmlFor="primary_meter">Primary Meter</Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                id="primary_meter"
                                                value={formData.primary_meter}
                                                onChange={(e) =>
                                                    handleInputChange("primary_meter", e.target.value)
                                                }
                                                placeholder="Enter value"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                                mi
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="reported_by">Reported By</Label>
                                        <Input
                                            type="text"
                                            id="reported_by"
                                            value={user?.name || ""}
                                            disabled={true}
                                            placeholder="Enter name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="assigned_to">Assigned to</Label>
                                        <Select
                                            options={assignedToOptions}
                                            placeholder={isLoadingContacts ? "Loading contacts..." : "Please select"}
                                            onChange={(value) => handleInputChange("assigned_to", value)}
                                            defaultValue={formData.assigned_to}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                                <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                                    Overdue Settings
                                </h3>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div>
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <DatePicker
                                            id="due_date"
                                            label=""
                                            placeholder="Select date"
                                            onChange={handleDateChange("due_date")}
                                            defaultDate={formData.due_date || undefined}
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            (optional) Considered overdue after this date
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="primary_meter_due">Primary Meter Due</Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                id="primary_meter_due"
                                                value={formData.primary_meter_due}
                                                onChange={(e) =>
                                                    handleInputChange("primary_meter_due", e.target.value)
                                                }
                                                placeholder="Enter value"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                                mi
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            (optional) Considered overdue above this value
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/issues")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Issue" : "Save Issue")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

