import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DateTimePicker from "../../components/form/date-time-picker";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { serviceService } from "../../services/serviceService";
import { vehicleService } from "../../services/vehicleService";
import { vendorService } from "../../services/vendorService";
import Issues from "../WorkOrders/Issues";
import LineItems from "../WorkOrders/LineItems";
import Notes from "../WorkOrders/Notes";
import { REPAIR_PRIORITY_CLASS_OPTIONS } from "../../constants/selectOptions";
import {
    ServiceItem,
    Part,
    Vehicle,
    Vendor,
} from "../../types/workOrderTypes";
import { ServiceFormData } from "../../types/serviceTypes";

interface SidebarItem {
    key: string;
    label: string;
    content: React.ReactNode;
}

export default function CreateService() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [vehicles, setVehicles] = useState<Array<Vehicle & { current_mileage?: string }>>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [currentMileage, setCurrentMileage] = useState<string>("");
    const [formData, setFormData] = useState<ServiceFormData>({
        vehicle_id: "",
        repair_priority_class: "",
        primary_meter: "",
        completion_date: "",
        set_start_date: false,
        start_date: "",
        vendor_id: "",
        service_items: [],
        parts: [],
        notes: "",
        discount_type: "percentage",
        discount_value: 0,
        tax_type: "percentage",
        tax_value: 0,
    });

    const fetchServiceData = useCallback(async (serviceId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await serviceService.getForEdit(serviceId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const service = data.data;
                setFormData({
                    vehicle_id: String(service.vehicle_id || ""),
                    repair_priority_class: String(service.repair_priority_class || ""),
                    primary_meter: String(service.primary_meter || ""),
                    completion_date: String(service.completion_date || ""),
                    set_start_date: Boolean(service.set_start_date || false),
                    start_date: String(service.start_date || ""),
                    vendor_id: String(service.vendor_id || ""),
                    service_items: Array.isArray(service.service_items)
                        ? (service.service_items as ServiceItem[])
                        : [] as ServiceItem[],
                    parts: Array.isArray(service.parts)
                        ? (service.parts as Part[])
                        : [] as Part[],
                    notes: String(service.notes || ""),
                    discount_type: (service.discount_type as "percentage" | "fixed") || "percentage",
                    discount_value: Number(service.discount_value || 0),
                    tax_type: (service.tax_type as "percentage" | "fixed") || "percentage",
                    tax_value: Number(service.tax_value || 0),
                });

                if (service.vehicle_id) {
                    const selectedVehicle = vehicles.find((v) => v.id.toString() === String(service.vehicle_id));
                    if (selectedVehicle) {
                        setCurrentMileage(selectedVehicle.current_mileage || "");
                    }
                }
            }
        } catch {
            setGeneralError("Failed to load service data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [vehicles]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (isEditMode && id && vehicles.length > 0) {
            fetchServiceData(parseInt(id));
        }
    }, [isEditMode, id, vehicles.length, fetchServiceData]);

    const fetchDropdownData = async () => {
        try {
            const [vehiclesRes, vendorsRes] = await Promise.all([
                vehicleService.getAll({ page: 1 }),
                vendorService.getAll({ page: 1 }),
            ]);

            if (vehiclesRes.data?.status && vehiclesRes.data?.vehical?.data) {
                const vehiclesData = vehiclesRes.data.vehical.data.map((vehicle: Vehicle & { current_mileage?: string }) => ({
                    ...vehicle,
                    current_mileage: vehicle.current_mileage || "",
                }));
                setVehicles(vehiclesData);
            }

            if (vendorsRes.data?.status && vendorsRes.data?.vendor?.data) {
                setVendors(vendorsRes.data.vendor.data);
            }
        } catch {
            setGeneralError("Failed to load dropdown data");
        }
    };


    const handleInputChange = (name: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (name === "vehicle_id" && value) {
            const selectedVehicle = vehicles.find((v) => v.id.toString() === value);
            setCurrentMileage(selectedVehicle?.current_mileage || "");
        } else if (name === "vehicle_id" && !value) {
            setCurrentMileage("");
        }
    };

    const handleDateTimeChange = (name: string) => (_selectedDates: Date[], dateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: dateString }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (name: string) => (checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
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

        if (!formData.vehicle_id.trim()) {
            newErrors.vehicle_id = "Vehicle is required";
        }

        if (!formData.primary_meter.trim()) {
            newErrors.primary_meter = "Primary Meter is required";
        } else if (formData.primary_meter && currentMileage) {
            const primaryMeterValue = parseFloat(formData.primary_meter);
            const currentMileageValue = parseFloat(currentMileage);

            if (!isNaN(primaryMeterValue) && !isNaN(currentMileageValue) && primaryMeterValue <= currentMileageValue) {
                newErrors.primary_meter = `Primary Meter must be greater than current mileage (${currentMileage})`;
            }
        }

        if (!formData.completion_date.trim()) {
            newErrors.completion_date = "Completion Date is required";
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
            const serviceData = {
                vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
                repair_priority_class: formData.repair_priority_class || undefined,
                primary_meter: formData.primary_meter ? parseFloat(formData.primary_meter) : undefined,
                completion_date: formData.completion_date || undefined,
                set_start_date: Boolean(formData.set_start_date),
                start_date: formData.set_start_date && formData.start_date ? formData.start_date : undefined,
                vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : undefined,
                notes: formData.notes || undefined,
                discount_type: formData.discount_type || undefined,
                discount_value: formData.discount_value || undefined,
                tax_type: formData.tax_type || undefined,
                tax_value: formData.tax_value || undefined,
                service_items: formData.service_items,
                parts: formData.parts,
            };

            const response = isEditMode && id
                ? await serviceService.update(parseInt(id), serviceData)
                : await serviceService.create(serviceData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                navigate("/services", { replace: true });
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} service. Please try again.`);
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
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the service. Please try again.`
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const vehicleOptions = vehicles.map((vehicle) => ({
        value: vehicle.id.toString(),
        label: vehicle.vehicle_name,
    }));

    const vendorOptions = vendors.map((vendor) => ({
        value: vendor.id.toString(),
        label: vendor.name
    }));

    const renderDetailsSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="vehicle_id">
                        Vehicle <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={vehicleOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("vehicle_id")}
                        defaultValue={formData.vehicle_id}
                    />
                    {errors.vehicle_id && (
                        <p className="mt-1 text-sm text-error-500">{errors.vehicle_id}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="vendor_id">Vendor</Label>
                    <Select
                        options={vendorOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("vendor_id")}
                        defaultValue={formData.vendor_id}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="repair_priority_class">Repair Priority Class</Label>
                <Select
                    options={REPAIR_PRIORITY_CLASS_OPTIONS}
                    placeholder="Please select"
                    onChange={handleSelectChange("repair_priority_class")}
                    defaultValue={formData.repair_priority_class}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Repair Priority Class (VMRS Code Key 16) is a simple way to classify whether a service or repair was scheduled, non-scheduled, or an emergency.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="primary_meter">
                        Primary Meter <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="primary_meter"
                        name="primary_meter"
                        value={formData.primary_meter}
                        onChange={(e) => handleInputChange("primary_meter", e.target.value)}
                        placeholder="Enter primary meter"
                        className="flex-1"
                    />
                    {errors.primary_meter && (
                        <p className="mt-1 text-sm text-error-500">{errors.primary_meter}</p>
                    )}
                    {currentMileage && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Current mileage: <span className="font-medium">{currentMileage}</span>
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="completion_date">
                        Completion Date <span className="text-error-500">*</span>
                    </Label>
                    <DateTimePicker
                        id="completion_date"
                        label=""
                        placeholder="Select completion date and time"
                        onChange={handleDateTimeChange("completion_date")}
                        defaultDate={formData.completion_date ? new Date(formData.completion_date) : undefined}
                        enableTime={false}
                        dateFormat="m/d/Y"
                    />
                    {errors.completion_date && (
                        <p className="mt-1 text-sm text-error-500">{errors.completion_date}</p>
                    )}
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Checkbox
                    id="set_start_date"
                    checked={formData.set_start_date}
                    onChange={handleCheckboxChange("set_start_date")}
                />
                <div className="flex-1">
                    <label
                        htmlFor="set_start_date"
                        className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                    >
                        Set Start Date
                    </label>
                </div>
            </div>

            {formData.set_start_date && (
                <div key="start_date_picker">
                    <Label htmlFor="start_date">Start Date</Label>
                    <DateTimePicker
                        id="start_date"
                        label=""
                        placeholder="Select start date and time"
                        onChange={handleDateTimeChange("start_date")}
                        defaultDate={formData.start_date ? new Date(formData.start_date) : undefined}
                    />
                </div>
            )}
        </div>
    );

    const renderIssuesSection = () => {
        const selectedVehicle = vehicles.find(
            (v) => v.id.toString() === formData.vehicle_id
        );
        return (
            <Issues
                vehicleId={selectedVehicle?.id}
                vehicleName={selectedVehicle?.vehicle_name}
            />
        );
    };

    const handleFormDataUpdate = useCallback((updater: (prev: { service_items: ServiceItem[]; parts: Part[] }) => { service_items: ServiceItem[]; parts: Part[] }) => {
        setFormData((prev) => {
            const updated = updater({ service_items: prev.service_items, parts: prev.parts });
            return { ...prev, service_items: updated.service_items, parts: updated.parts };
        });
    }, []);

    const renderLineItemsSection = () => (
        <LineItems
            serviceItems={formData.service_items}
            parts={formData.parts}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setFormData={handleFormDataUpdate as any}
            onDeleteLineItem={() => { }}
        />
    );

    const renderNotesSection = () => (
        <Notes
            notes={formData.notes}
            setNotes={(notes) => setFormData((prev) => ({ ...prev, notes: notes }))}
            serviceItems={formData.service_items}
            parts={formData.parts}
            discountType={formData.discount_type}
            discountValue={formData.discount_value}
            taxType={formData.tax_type}
            taxValue={formData.tax_value}
            setDiscountType={(type) => setFormData((prev) => ({ ...prev, discount_type: type }))}
            setDiscountValue={(value) => setFormData((prev) => ({ ...prev, discount_value: value }))}
            setTaxType={(type) => setFormData((prev) => ({ ...prev, tax_type: type }))}
            setTaxValue={(value) => setFormData((prev) => ({ ...prev, tax_value: value }))}
        />
    );

    const sidebarItems: SidebarItem[] = [
        { key: "details", label: "Details", content: renderDetailsSection() },
        { key: "issues", label: "", content: renderIssuesSection() },
        { key: "lineItems", label: "", content: renderLineItemsSection() },
        { key: "notes", label: "", content: renderNotesSection() },
    ];

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Service" : "Create Service"}
                description={isEditMode ? "Edit service" : "Create a new service"}
            />
            <PageBreadcrumb pageTitle={isEditMode ? "Edit Service" : "Create Service"} />

            <div className="flex flex-col gap-6 justify-center max-w-5xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Loading service data...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                                {generalError && (
                                    <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                                        <p className="text-sm text-error-600">{generalError}</p>
                                    </div>
                                )}

                                {sidebarItems.map((item) => (
                                    <div key={item.key} className="bg-white  rounded-lg border border-gray-200 p-6">
                                        {item.label && (
                                            <h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                                {item.label}
                                            </h2>
                                        )}
                                        {item.content}
                                    </div>
                                ))}

                                <div className="mt-6 flex justify-end gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/services")}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="sm"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                {isEditMode ? "Updating..." : "Saving..."}
                                            </>
                                        ) : (
                                            isEditMode ? "Update Service" : "Save Service"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}
