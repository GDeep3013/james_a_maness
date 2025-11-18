import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import MultiSelect from "../../components/form/MultiSelect";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { ChevronLeftIcon } from "../../icons";
import { partService } from "../../services/partService";
import { vendorService } from "../../services/vendorService";
import { typeOptions } from "../../constants/vehicleConstants";

export interface PartFormData {
    part_name: string;
    part_code: string;
    description: string;
    vehical_types: string[];
    manufacturer_name: string;
    unit_price: string;
    purchase_price: string;
    vendor_id: string;
    warranty_period_months: string;
    status: "Active" | "Inactive";
}

interface Vendor {
    id: number;
    name: string;
    first_name?: string;
}

export default function EditPart() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<PartFormData>({
        part_name: "",
        part_code: "",
        description: "",
        vehical_types: [],
        manufacturer_name: "",
        unit_price: "",
        purchase_price: "",
        vendor_id: "",
        warranty_period_months: "",
        status: "Active",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [generalError, setGeneralError] = useState<string>("");
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);

    useEffect(() => {
        fetchVendors();
        if (id) {
            fetchPartData(parseInt(id));
        } else {
            setGeneralError("Part ID is required");
            setIsLoading(false);
        }
    }, [id]);

    const fetchVendors = async () => {
        setIsLoadingVendors(true);
        try {
            const response = await vendorService.getAll({ page: 1 });
            if (response.data?.status && response.data?.vendor?.data) {
                setVendors(response.data.vendor.data);
            }
        } catch {
            setErrors({ general: "Failed to load vendors" });
        } finally {
            setIsLoadingVendors(false);
        }
    };

    const fetchPartData = async (partId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await partService.getForEdit(partId);
            const data = response.data as { status: boolean; data?: any };
            
            if (data.status && data.data) {
                const part = data.data;
                setFormData({
                    part_name: part.part_name || "",
                    part_code: part.part_code || "",
                    description: part.description || "",
                    vehical_types: Array.isArray(part.vehical_types) ? part.vehical_types : [],
                    manufacturer_name: part.manufacturer_name || "",
                    unit_price: part.unit_price ? parseFloat(String(part.unit_price)).toString() : "",
                    purchase_price: part.purchase_price ? parseFloat(String(part.purchase_price)).toString() : "",
                    vendor_id: part.vendor_id ? part.vendor_id.toString() : "",
                    warranty_period_months: part.warranty_period_months ? part.warranty_period_months.toString() : "",
                    status: part.status || "Active",
                });
            } else {
                setGeneralError("Part not found");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setGeneralError(
                err.response?.data?.message || "Failed to load part data. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const vendorOptions = [
        { value: "", label: "Please select" },
        ...vendors.map((vendor) => ({
            value: vendor.id.toString(),
            label: vendor.name || vendor.first_name || `Vendor ${vendor.id}`,
        })),
    ];

    const vehicleTypeOptions = typeOptions.map((option) => ({
        value: option.value,
        text: option.label,
    }));

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    const handleInputChange = (name: keyof PartFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: keyof PartFormData) => (value: string) => {
        handleInputChange(name, value);
    };

    const handleMultiSelectChange = (selected: string[]) => {
        handleInputChange("vehical_types", selected);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.part_name.trim()) {
            newErrors.part_name = "Part name is required";
        }

        if (!formData.part_code.trim()) {
            newErrors.part_code = "Part code is required";
        }

        if (!formData.unit_price.trim()) {
            newErrors.unit_price = "Unit price is required";
        } else if (isNaN(parseFloat(formData.unit_price)) || parseFloat(formData.unit_price) < 0) {
            newErrors.unit_price = "Please enter a valid unit price";
        }

        if (!formData.purchase_price.trim()) {
            newErrors.purchase_price = "Purchase price is required";
        } else if (isNaN(parseFloat(formData.purchase_price)) || parseFloat(formData.purchase_price) < 0) {
            newErrors.purchase_price = "Please enter a valid purchase price";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setGeneralError("Part ID is required");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const partData = {
                part_name: formData.part_name,
                part_code: formData.part_code,
                description: formData.description || undefined,
                vehical_types: formData.vehical_types.length > 0 ? formData.vehical_types : undefined,
                manufacturer_name: formData.manufacturer_name || undefined,
                unit_price: parseFloat(formData.unit_price),
                purchase_price: parseFloat(formData.purchase_price),
                vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : undefined,
                warranty_period_months: formData.warranty_period_months ? parseInt(formData.warranty_period_months) : undefined,
                status: formData.status,
            };

            const response = await partService.update(parseInt(id), partData);

            if (response.data?.status === true || response.status === 200) {
                navigate("/parts");
            } else {
                throw new Error(response.data?.message || "Failed to update part");
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
                setErrors({ general: err.response?.data?.message || "Failed to update part. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <PageMeta
                    title="Edit Part"
                    description="Edit part details"
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Loading part data...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta
                title="Edit Part"
                description="Edit part details"
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/parts")}
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Part
                        </h1>
                    </div>
                </div>

                {(errors.general || generalError) && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.general || generalError}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl">

                        <div className="flex-1">
                            <div className="flex flex-col gap-6">
                                
                                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 lg:p-8">
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                        Details
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div>
                                            <Label htmlFor="part_name">
                                                Part Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="part_name"
                                                value={formData.part_name}
                                                onChange={(e) => handleInputChange("part_name", e.target.value)}
                                                placeholder="Enter part name"
                                                className={errors.part_name ? "border-red-500" : ""}
                                            />
                                            {errors.part_name && (
                                                <p className="mt-1 text-sm text-red-500">{errors.part_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="part_code">
                                                Part Code <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="part_code"
                                                value={formData.part_code}
                                                onChange={(e) => handleInputChange("part_code", e.target.value)}
                                                placeholder="Enter part code"
                                                className={errors.part_code ? "border-red-500" : ""}
                                            />
                                            {errors.part_code && (
                                                <p className="mt-1 text-sm text-red-500">{errors.part_code}</p>
                                            )}
                                        </div>

                                        <div className="lg:col-span-2">
                                            <Label htmlFor="description">Description</Label>
                                            <TextArea
                                                placeholder="Enter part description"
                                                rows={4}
                                                value={formData.description}
                                                onChange={(value) => handleInputChange("description", value)}
                                            />
                                        </div>

                                        <div className="lg:col-span-2">
                                            <Label htmlFor="vehical_types">Vehicle Types</Label>
                                            <MultiSelect
                                                label=""
                                                options={vehicleTypeOptions}
                                                value={formData.vehical_types}
                                                onChange={handleMultiSelectChange}
                                                placeholder="Select vehicle types"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="manufacturer_name">Manufacturer Name</Label>
                                            <Input
                                                type="text"
                                                id="manufacturer_name"
                                                value={formData.manufacturer_name}
                                                onChange={(e) => handleInputChange("manufacturer_name", e.target.value)}
                                                placeholder="Enter manufacturer name"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="vendor_id">Vendor</Label>
                                            <Select
                                                options={vendorOptions}
                                                placeholder="Select vendor"
                                                onChange={handleSelectChange("vendor_id")}
                                                defaultValue={formData.vendor_id}
                                                disabled={isLoadingVendors}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="unit_price">
                                                Unit Price <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="unit_price"
                                                value={formData.unit_price}
                                                onChange={(e) => handleInputChange("unit_price", e.target.value)}
                                                placeholder="0.00"
                                                step={0.01}
                                                min="0"
                                                className={errors.unit_price ? "border-red-500" : ""}
                                            />
                                            {errors.unit_price && (
                                                <p className="mt-1 text-sm text-red-500">{errors.unit_price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="purchase_price">
                                                Purchase Price <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="purchase_price"
                                                value={formData.purchase_price}
                                                onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                                                placeholder="0.00"
                                                step={0.01}
                                                min="0"
                                                className={errors.purchase_price ? "border-red-500" : ""}
                                            />
                                            {errors.purchase_price && (
                                                <p className="mt-1 text-sm text-red-500">{errors.purchase_price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="warranty_period_months">Warranty Period (Months)</Label>
                                            <Input
                                                type="number"
                                                id="warranty_period_months"
                                                value={formData.warranty_period_months}
                                                onChange={(e) => handleInputChange("warranty_period_months", e.target.value)}
                                                placeholder="Enter warranty period in months"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                options={statusOptions}
                                                placeholder="Select status"
                                                onChange={handleSelectChange("status")}
                                                defaultValue={formData.status}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/parts")}
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
                                        {isSubmitting ? "Updating..." : "Update Part"}
                                    </Button>
                                </div>
                            </div>
                           
                        </div>
                    </form>
                </div>

            </div>
        </>
    );
}

