import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { ChevronLeftIcon } from "../../icons";
import { vendorService } from "../../services/vendorService";

export interface VendorFormData {
    name: string;
    phone: string;
    website: string;
    address: string;
    address_line_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    notes: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    charging: boolean;
    fuel: boolean;
    service: boolean;
    vehicle: boolean;
}

export default function CreateVendor() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<VendorFormData>({
        name: "",
        phone: "",
        website: "",
        address: "",
        address_line_2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        notes: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        charging: false,
        fuel: false,
        service: false,
        vehicle: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            fetchVendorData(parseInt(id));
        }
    }, [isEditMode, id]);

    const fetchVendorData = async (vendorId: number) => {
        setIsLoading(true);
        setErrors({});
        try {
            const response = await vendorService.getForEdit(vendorId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const vendor = data.data;

                // Parse address back into street_address and address_line_2
                // const addressStr = String(vendor.address || "");
                // const addressParts = addressStr.split(", ");

                setFormData({
                    name: String(vendor.name || ""),
                    phone: String(vendor.phone || ""),
                    website: String(vendor.website || ""),
                    address: String(vendor.address) || "",
                    address_line_2: String(vendor.address_line_2) || "",
                    city: String(vendor.city || ""),
                    state: String(vendor.state || ""),
                    zip: String(vendor.zip || ""),
                    country: String(vendor.country || ""),
                    notes: String(vendor.notes || ""),
                    contact_name: String(vendor.contact_name || ""),
                    contact_phone: String(vendor.contact_phone || ""),
                    contact_email: String(vendor.contact_email || ""),
                    charging: Boolean(vendor.charging),
                    fuel: Boolean(vendor.fuel),
                    service: Boolean(vendor.service),
                    vehicle: Boolean(vendor.vehicle),
                });
            }
        } catch (error) {
            console.error("Failed to load vendor data:", error);
            setErrors({ general: "Failed to load vendor data. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (name: keyof VendorFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (name: keyof VendorFormData) => (checked: boolean) => {
        handleInputChange(name, checked);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.contact_email.trim()) {
            newErrors.contact_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
            newErrors.contact_email = "Please enter a valid email address";
        }

        if (!formData.phone.trim() && !formData.contact_phone.trim()) {
            newErrors.phone = "Phone number is required";
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
            const vendorData = {
                name: formData.name,
                phone: formData.phone || undefined,
                website: formData.website || undefined,
                address: formData.address || undefined,
                address_line_2: formData.address_line_2 || undefined,
                city: formData.city || undefined,
                state: formData.state || undefined,
                zip: formData.zip || undefined,
                country: formData.country || undefined,
                notes: formData.notes || undefined,
                contact_name: formData.contact_name || undefined,
                contact_phone: formData.contact_phone || undefined,
                contact_email: formData.contact_email || undefined,
                charging: formData.charging || undefined,
                fuel: formData.fuel || undefined,
                service: formData.service || undefined,
                vehicle: formData.vehicle || undefined,
            };

            // const response = await vendorService.create(vendorData);
            const response = isEditMode && id
                ? await vendorService.update(parseInt(id), vendorData)
                : await vendorService.create(vendorData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                if (saveAndAddAnother && !isEditMode) {
                    setFormData({
                        name: "",
                        phone: "",
                        website: "",
                        address: "",
                        address_line_2: "",
                        city: "",
                        state: "",
                        zip: "",
                        country: "",
                        notes: "",
                        contact_name: "",
                        contact_phone: "",
                        contact_email: "",
                        charging: false,
                        fuel: false,
                        service: false,
                        vehicle: false,
                    });
                    setErrors({});
                } else {
                    navigate("/vendors", { replace: true });
                }
            } else {
                throw new Error(response.data?.message || "Failed to save vendor");
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
                setErrors({ general: err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'save'} vendor. Please try again.` });
            }
        } finally {
            setIsSubmitting(false);
            setSaveAndAddAnother(false);
        }
    };

    const handleSaveAndAddAnother = async (e: React.FormEvent) => {
        setSaveAndAddAnother(true);
        await handleSubmit(e);
    };

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Vendor" : "Create New Vendor"}
                description={isEditMode ? "Edit vendor details" : "Create a new vendor"}
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/vendors")}
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditMode ? "Edit Vendor" : "New Vendor"}
                        </h1>
                    </div>
                </div>

                {errors.general && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl">

                        <div className="flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Loading contact data...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">

                                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 lg:p-8">
                                        <h3 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                            Details
                                        </h3>

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div>
                                                <Label htmlFor="name">
                                                    Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    placeholder="Enter vendor name"
                                                    className={errors.name ? "border-red-500" : ""}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="phone">
                                                    Phone <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    placeholder="Enter phone number"
                                                    className={errors.phone ? "border-red-500" : ""}
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    type="text"
                                                    id="website"
                                                    value={formData.website}
                                                    onChange={(e) => handleInputChange("website", e.target.value)}
                                                    placeholder="Enter website URL"
                                                />
                                            </div>


                                            <div className="lg:col-span-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    type="text"
                                                    id="address"
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                                    placeholder="Street address, P.O. box, etc."
                                                />
                                            </div>

                                            <div className="lg:col-span-2">
                                                <Label htmlFor="address_line_2">Address Line 2</Label>
                                                <Input
                                                    type="text"
                                                    id="address_line_2"
                                                    value={formData.address_line_2}
                                                    onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                                                    placeholder="Suite, unit, building, floor, etc."
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    type="text"
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                                    placeholder="Enter city"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="state">State/Province/Region</Label>
                                                <Input
                                                    type="text"
                                                    id="state"
                                                    value={formData.state}
                                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                                    placeholder="Enter state/province/region"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="zip">Zip/Postal Code</Label>
                                                <Input
                                                    type="text"
                                                    id="zip"
                                                    value={formData.zip}
                                                    onChange={(e) => handleInputChange("zip", e.target.value)}
                                                    placeholder="Enter zip/postal code"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    type="text"
                                                    id="country"
                                                    value={formData.country}
                                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                                    placeholder="Enter country"
                                                />
                                            </div>

                                            <div className="lg:col-span-2">
                                                <Label htmlFor="notes">Notes</Label>
                                                <TextArea
                                                    placeholder="Enter any additional notes"
                                                    rows={4}
                                                    value={formData.notes}
                                                    onChange={(value) => handleInputChange("notes", value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 lg:p-8">
                                        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                                            Contact Person
                                        </h3>

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div>
                                                <Label htmlFor="contact_name">Contact Name</Label>
                                                <Input
                                                    type="text"
                                                    id="contact_name"
                                                    value={formData.contact_name}
                                                    onChange={(e) => handleInputChange("contact_name", e.target.value)}
                                                    placeholder="Enter contact name"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="contact_phone">Phone</Label>
                                                <Input
                                                    type="text"
                                                    id="contact_phone"
                                                    value={formData.contact_phone}
                                                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                                                    placeholder="Contact person's direct line or mobile number"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="contact_email">
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    type="email"
                                                    id="contact_email"
                                                    value={formData.contact_email}
                                                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                                                    placeholder="Enter email address"
                                                    className={errors.contact_email ? "border-red-500" : ""}
                                                />
                                                {errors.contact_email && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.contact_email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 lg:p-8">
                                        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                                            Classification
                                        </h3>

                                        <div className="space-y-4">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.charging}
                                                    onChange={(e) => handleCheckboxChange("charging")(e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-brand-600"
                                                />
                                                <div className="flex-1">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                        Charging
                                                    </span>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Charging classification allows vendor to be listed on Charging Entries
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.fuel}
                                                    onChange={(e) => handleCheckboxChange("fuel")(e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-brand-600"
                                                />
                                                <div className="flex-1">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                        Fuel
                                                    </span>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Fuel classification allows vendor to be listed on Fuel Entries
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.service}
                                                    onChange={(e) => handleCheckboxChange("service")(e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-brand-600"
                                                />
                                                <div className="flex-1">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                        Service
                                                    </span>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Service classification allows vendor to be listed on Service Entries and Work Orders
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.vehicle}
                                                    onChange={(e) => handleCheckboxChange("vehicle")(e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-brand-600"
                                                />
                                                <div className="flex-1">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                        Vehicle
                                                    </span>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Vehicle classification allows vendor to be listed on Vehicle Acquisitions
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>


                                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate("/vendors")}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSaveAndAddAnother}
                                            disabled={isSubmitting}
                                        >
                                            Save & Add Another
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Vendor" : "Save Vendor")}
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

