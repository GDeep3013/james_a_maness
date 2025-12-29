import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { fuelService } from "../../services/fuelService";
import { vehicleService } from "../../services/vehicleService";
import { vendorService } from "../../services/vendorService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";



interface Vehicle {
    id: number;
    name?: string;
    vehicle_name?: string;
    current_mileage?: string;
}
interface Vendor {
    id: number;
    name: string;
}

export interface FuelFormData {
    vehicle_id: string;
    vendor_id: string;
    fuel_type: string;
    unit_type: string;
    units: string;
    price_per_volume_unit: string;
    vehicle_meter: string;
    previous_meter: string;
    notes: string;
    date: string;
}

// Add this new interface for API payload
interface FuelApiPayload {
    vehicle_id: number;
    vendor_id: number;
    fuel_type: string;
    unit_type: string;
    units: number;
    price_per_volume_unit: number;
    vehicle_meter: string;
    previous_meter?: string;
    notes?: string;
    date: string;
}

export default function CreateFuel() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);

    const [formData, setFormData] = useState<FuelFormData>({
        vehicle_id: "",
        vendor_id: "",
        fuel_type: "",
        unit_type: "us_gallons",
        units: "",
        price_per_volume_unit: "",
        vehicle_meter: "",
        previous_meter: "",
        notes: "",
        date: "",
    });

    // Dropdown options
    const [vehicles, setVehicles] = useState<Array<{ value: string; label: string; current_mileage?: string }>>([]);
    const [vendors, setVendors] = useState<Array<{ value: string; label: string }>>([]);

    const fuelTypeOptions = [
        { value: "gasoline", label: "Gasoline" },
        { value: "diesel", label: "Diesel" },
        { value: "electric", label: "Electric" },
        { value: "hybrid", label: "Hybrid" },
    ];

    const unitTypeOptions = [
        { value: "us_gallons", label: "US Gallons" },
        { value: "liters", label: "Liters" },
        { value: "uk_gallons", label: "UK Gallons" },
    ];

    useEffect(() => {
        fetchDropdownData();

        if (isEditMode && id) {
            fetchFuelData(parseInt(id));
        }
    }, [isEditMode, id]);

    const fetchDropdownData = async () => {
        try {
            const [vehiclesRes, vendorsRes] = await Promise.all([
                vehicleService.getAll(),
                vendorService.getAll(),
            ]);
            // Transform vehicles data for Select component
            const vehicleOptions = (vehiclesRes.data.vehical?.data || vehiclesRes.data.vehical || []).map((vehicle: Vehicle) => ({
                value: String(vehicle.id),
                label: vehicle.vehicle_name || vehicle.name || `Vehicle #${vehicle.id}`,
                current_mileage: vehicle.current_mileage || "",
            }));

            // Transform vendors data for Select component
            const vendorOptions = (vendorsRes.data.vendor || vendorsRes.data.vendors || []).map((vendor: Vendor) => ({
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

    const fetchFuelData = async (fuelId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await fuelService.getForEdit(fuelId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const fuel = data.data;
                setFormData({
                    vehicle_id: String(fuel.vehicle_id || ""),
                    vendor_id: String(fuel.vendor_id || ""),
                    fuel_type: String(fuel.fuel_type || ""),
                    unit_type: String(fuel.unit_type || "us_gallons"),
                    units: String(fuel.units || ""),
                    price_per_volume_unit: String(fuel.price_per_volume_unit || ""),
                    vehicle_meter: String(fuel.vehicle_meter || ""),
                    previous_meter: String(fuel.previous_meter || ""),
                    notes: String(fuel.notes || ""),
                    date: fuel.date ? String(fuel.date).split('T')[0] : ""

                });
            }
        } catch (error) {
            console.error("Failed to load fuel data:", error);
            setGeneralError("Failed to load fuel data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (name: keyof FuelFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const handleDateChange = (name: keyof FuelFormData) => (_dates: unknown, currentDateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: currentDateString }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: keyof FuelFormData) => async (value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "vehicle_id" && !value) {
                updated.previous_meter = "";
            }

            return updated;
        });

        if (name === "vehicle_id" && value) {
            try {
                const vehicleId = parseInt(value);
                const lastEntryResponse = await fuelService.getLastEntryByVehicle(vehicleId);

                if (lastEntryResponse.data?.status) {
                    const lastEntry = lastEntryResponse.data.data;

                    if (lastEntry?.vehicle_meter) {
                        setFormData((prev) => ({
                            ...prev,
                            previous_meter: String(lastEntry.vehicle_meter),
                        }));
                    } else {
                        const selectedVehicle = vehicles.find((v) => v.value === value);
                        if (selectedVehicle?.current_mileage) {
                            setFormData((prev) => ({
                                ...prev,
                                previous_meter: selectedVehicle.current_mileage || "",
                            }));
                        }
                    }
                } else {
                    const selectedVehicle = vehicles.find((v) => v.value === value);
                    if (selectedVehicle?.current_mileage) {
                        setFormData((prev) => ({
                            ...prev,
                            previous_meter: selectedVehicle.current_mileage || "",
                        }));
                    }
                }
            } catch {
                const selectedVehicle = vehicles.find((v) => v.value === value);
                if (selectedVehicle?.current_mileage) {
                    setFormData((prev) => ({
                        ...prev,
                        previous_meter: selectedVehicle.current_mileage || "",
                    }));
                }
            }
        }

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

        if (!formData.vendor_id) {
            newErrors.vendor_id = "Vendor is required";
        }

        if (!formData.fuel_type) {
            newErrors.fuel_type = "Fuel type is required";
        }

        if (!formData.unit_type) {
            newErrors.unit_type = "Unit type is required";
        }

        if (!formData.units || parseFloat(formData.units) <= 0) {
            newErrors.units = "Units must be greater than 0";
        }

        if (!formData.price_per_volume_unit || parseFloat(formData.price_per_volume_unit) <= 0) {
            newErrors.price_per_volume_unit = "Price per unit must be greater than 0";
        }

        if (!formData.previous_meter.trim()) {
            newErrors.previous_meter = "Previous meter reading is required";
        }

        if (!formData.vehicle_meter.trim()) {
            newErrors.vehicle_meter = "Vehicle meter reading is required";
        } else if (formData.previous_meter.trim() && formData.vehicle_meter.trim()) {
            const vehicleMeter = parseFloat(formData.vehicle_meter);
            const previousMeter = parseFloat(formData.previous_meter);
            if (!isNaN(vehicleMeter) && !isNaN(previousMeter) && vehicleMeter <= previousMeter) {
                newErrors.vehicle_meter = "Vehicle meter reading must be greater than previous meter reading";
            }
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
            const fuelData: FuelApiPayload = {
                vehicle_id: parseInt(formData.vehicle_id),
                vendor_id: parseInt(formData.vendor_id),
                fuel_type: formData.fuel_type,
                unit_type: formData.unit_type,
                units: parseFloat(formData.units),
                price_per_volume_unit: parseFloat(formData.price_per_volume_unit),
                vehicle_meter: formData.vehicle_meter,
                previous_meter: formData.previous_meter || undefined,
                notes: formData.notes || undefined,
                date: formData.date,
            };
            console.log(fuelData, "fuel")
            const response = isEditMode && id
                ? await fuelService.update(parseInt(id), fuelData)
                : await fuelService.create(fuelData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                if (saveAndAddAnother && !isEditMode) {
                    setFormData({
                        vehicle_id: "",
                        vendor_id: "",
                        fuel_type: "",
                        unit_type: "us_gallons",
                        units: "",
                        price_per_volume_unit: "",
                        vehicle_meter: "",
                        previous_meter: "",
                        notes: "",
                        date: "",
                    });
                    setErrors({});
                    setGeneralError("");
                } else {
                    navigate("/fuels", { replace: true });
                }
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} fuel entry. Please try again.`);
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
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the fuel entry. Please try again.`
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

    const calculateTotalCost = () => {
        const units = parseFloat(formData.units) || 0;
        const pricePerUnit = parseFloat(formData.price_per_volume_unit) || 0;
        return (units * pricePerUnit).toFixed(2);
    };

    const renderFuelDetailsSection = () => (
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
                    <Label htmlFor="vendor_id">
                        Vendor <span className="text-error-500">*</span>
                    </Label>
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
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>

                    <Label htmlFor="fuel_type">
                        Fuel Type <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={fuelTypeOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("fuel_type")}
                        defaultValue={formData.fuel_type}
                    />
                    {errors.fuel_type && (
                        <p className="mt-1 text-sm text-error-500">{errors.fuel_type}</p>
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
                        defaultDate={formData.date || undefined}

                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-error-500">{errors.date}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                    <Label htmlFor="unit_type">
                        Unit Type <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={unitTypeOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("unit_type")}
                        defaultValue={formData.unit_type}
                    />
                    {errors.unit_type && (
                        <p className="mt-1 text-sm text-error-500">{errors.unit_type}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="units">
                        Units <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="units"
                        value={formData.units}
                        onChange={(e) => handleInputChange("units", e.target.value)}
                        placeholder="Enter units (e.g., 14.78)"
                        className={errors.units ? "border-error-500" : ""}
                    />
                    {errors.units && (
                        <p className="mt-1 text-sm text-error-500">{errors.units}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="price_per_volume_unit">
                        Price Per Unit <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="price_per_volume_unit"
                        value={formData.price_per_volume_unit}
                        onChange={(e) => handleInputChange("price_per_volume_unit", e.target.value)}
                        placeholder="Enter price per unit (e.g., 2.98)"
                        className={errors.price_per_volume_unit ? "border-error-500" : ""}
                    />
                    {errors.price_per_volume_unit && (
                        <p className="mt-1 text-sm text-error-500">{errors.price_per_volume_unit}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="previous_meter">
                        Previous Meter Reading <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="previous_meter"
                        value={formData.previous_meter}
                        onChange={(e) => handleInputChange("previous_meter", e.target.value)}
                        placeholder="Enter previous odometer reading"
                        className={errors.previous_meter ? "border-error-500" : ""}
                    />
                    {errors.previous_meter && (
                        <p className="mt-1 text-sm text-error-500">{errors.previous_meter}</p>
                    )}
                </div>

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
                    {errors.vehicle_meter && (
                        <p className="mt-1 text-sm text-error-500">{errors.vehicle_meter}</p>
                    )}
                </div>
            </div>

            {formData.units && formData.price_per_volume_unit && (
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Cost:
                        </span>
                        <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                            ${calculateTotalCost()}
                        </span>
                    </div>
                </div>
            )}

            <div>
                <Label htmlFor="notes">Notes</Label>
                <TextArea
                    rows={4}
                    value={formData.notes}
                    onChange={(value) => handleInputChange("notes", value)}
                    placeholder="Enter any additional notes about this fuel entry"
                />
            </div>
        </div>
    );

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Fuel Entry" : "Create New Fuel Entry"}
                description={isEditMode ? "Edit fuel entry details" : "Create a new fuel entry"}
            />
            <PageBreadcrumb pageTitle={[
                { name: "Fuel History", to: "/fuel-history" },
                { name: isEditMode ? "Edit Fuel Entry" : "Create New Fuel Entry", to: isEditMode ? `/fuel-history/${id}` : "/fuel-history/create" },
            ]} />

            <div className="space-y-6">
                {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditMode ? "Edit Fuel Entry" : "New Fuel Entry"}
                        </h1>
                    </div>
                </div> */}

                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl">
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Loading fuel entry data...
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
                                            Fuel Entry Details
                                        </h2>
                                        {renderFuelDetailsSection()}
                                    </div>
                                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate("/fuels")}
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
                                            {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Fuel" : "Save Fuel")}
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
