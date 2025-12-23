import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { meterReadingService } from "../../services/meterReadingService";
import { vehicleService } from "../../services/vehicleService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export interface MeterReadingFormData {
    vehicle_id: string;
    vehicle_meter: string;
    date: string;
}

interface MeterReadingApiPayload {
    vehicle_id: number;
    vehicle_meter: string;
    date: string;
}

export default function CreateMeterReading() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);

    const [formData, setFormData] = useState<MeterReadingFormData>({
        vehicle_id: "",
        vehicle_meter: "",
        date: new Date().toISOString().split('T')[0],
    });

    const [vehicles, setVehicles] = useState<Array<{ value: string; label: string; current_mileage?: string }>>([]);
    const [currentMileage, setCurrentMileage] = useState<string>("");

    const fetchDropdownData = async () => {
        try {
            const vehiclesRes = await vehicleService.getAll();

            const vehicleOptions = (vehiclesRes.data.vehical || vehiclesRes.data.vehicles || []).map((vehicle: { id: number; name?: string; current_mileage?: string }) => ({
                value: String(vehicle.id),
                label: vehicle.name || `Vehicle #${vehicle.id}`,
                current_mileage: vehicle.current_mileage || "",
            }));

            setVehicles(vehicleOptions);
        } catch (error) {
            console.error("Failed to load dropdown data:", error);
            setGeneralError("Failed to load form data. Please refresh the page.");
        }
    };

    const fetchMeterReadingData = useCallback(async (readingId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await meterReadingService.getForEdit(readingId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const reading = data.data;

                setFormData({
                    vehicle_id: String(reading.vehicle_id || ""),
                    vehicle_meter: String(reading.vehicle_meter || ""),
                    date: reading.date ? String(reading.date).split('T')[0] : new Date().toISOString().split('T')[0],
                });

                if (reading.vehicle_id && vehicles.length > 0) {
                    const selectedVehicle = vehicles.find((v) => v.value === String(reading.vehicle_id));
                    setCurrentMileage(selectedVehicle?.current_mileage || "");
                }
            }
        } catch (error) {
            console.error("Failed to load meter reading data:", error);
            setGeneralError("Failed to load meter reading data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [vehicles]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (isEditMode && id) {
            fetchMeterReadingData(parseInt(id));
        }
    }, [isEditMode, id, fetchMeterReadingData]);

    const handleInputChange = (name: keyof MeterReadingFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (name: keyof MeterReadingFormData) => (_dates: unknown, currentDateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: currentDateString }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: keyof MeterReadingFormData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (name === "vehicle_id" && value) {
            const selectedVehicle = vehicles.find((v) => v.value === value);
            setCurrentMileage(selectedVehicle?.current_mileage || "");
        } else if (name === "vehicle_id" && !value) {
            setCurrentMileage("");
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.vehicle_id) {
            newErrors.vehicle_id = "Vehicle is required";
        }

        if (!formData.vehicle_meter.trim()) {
            newErrors.vehicle_meter = "Vehicle meter reading is required";
        }

        if (!formData.date) {
            newErrors.date = "Date is required";
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
            const readingData: MeterReadingApiPayload = {
                vehicle_id: parseInt(formData.vehicle_id),
                vehicle_meter: formData.vehicle_meter,
                date: formData.date,
            };

            const response = isEditMode && id
                ? await meterReadingService.update(parseInt(id), readingData)
                : await meterReadingService.create(readingData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                if (saveAndAddAnother && !isEditMode) {
                    setFormData({
                        vehicle_id: "",
                        vehicle_meter: "",
                        date: new Date().toISOString().split('T')[0],
                    });
                    setErrors({});
                    setGeneralError("");
                } else {
                    navigate("/meter-history", { replace: true });
                }
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} meter reading. Please try again.`);
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
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the meter reading. Please try again.`
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

    const renderMeterReadingDetailsSection = () => (
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
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <Label htmlFor="vehicle_meter">
                        Vehicle Meter Reading <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="vehicle_meter"
                        value={formData.vehicle_meter}
                        onChange={(e) => handleInputChange("vehicle_meter", e.target.value)}
                        placeholder="Enter odometer reading (e.g., 108043)"
                        className={errors.vehicle_meter ? "border-error-500" : ""}
                    />
                    {currentMileage && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Previous meter reading: <span className="font-medium">{currentMileage}</span>
                        </p>
                    )}
                    {errors.vehicle_meter && (
                        <p className="mt-1 text-sm text-error-500">{errors.vehicle_meter}</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Meter Entry" : "Create New Meter Entry"}
                description={isEditMode ? "Edit meter entry details" : "Create a new meter entry"}
            />

            <PageBreadcrumb pageTitle={[
                { name: "Meter History", to: "/meter-history" },
                { name: isEditMode ? "Edit Meter Entry" : "Create New Meter Entry", to: isEditMode ? `/meter-history/${id}` : "/meter-history/create" },
            ]} />


            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">

                        <h1 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditMode ? "Edit Meter Entry" : "New Meter Entry"}
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
                                            Loading meter reading data...
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
                                        <h3 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                            Meter History Details
                                        </h3>
                                        {renderMeterReadingDetailsSection()}
                                    </div>
                                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate("/meter-history")}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        {/* <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSaveAndAddAnother}
                                            disabled={isSubmitting}
                                        >
                                            Save & Add Another
                                        </Button> */}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Reading" : "Save Reading")}
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
