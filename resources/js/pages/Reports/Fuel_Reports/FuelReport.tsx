import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { vehicleService } from "../../../services/vehicleService";
import { vendorService } from "../../../services/vendorService";
import { fuelReportService } from "../../../services/fuelReportService";
import DatePicker from "../../../components/form/date-picker";
import { fuelService } from "../../../services/fuelService";
import { TAX_OPTIONS } from "../../../constants/selectOptions";
import { fuelTypeOptions, UnitTypeOptions } from "../../../constants/vehicleConstants";

interface Vehicle {
    id: number;
    vehicle_name: string;
}

interface Vendor {
    id: number;
    name: string;
    address?: string;
    email?: string;
    city?: string;
    state?: string;
    zip?: string;
}

interface LineItem {
    qty: number;
    // line: string;
    vehicle_name: string;
    fuel_type: string;
    meter_reading: string;
    unit_type: string;
    unit: string;
    tax: string;
    per_unit_price: number;
    net: number;
    // extended: number;
}

interface Fuel {
    id?: number;
    vehicle_id?: number;
    vendor_id?: number;
    fuel_type?: string;
    unit_type?: string;
    units?: number;
    price_per_volume_unit?: number;
    total_cost?: number;
    vehicle_meter?: string;
    previous_meter?: string;
    date?: string;
    vehicle?: {
        vehicle_name?: string;
    };
}

export default function FuelReportCreate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        vehicle_id: "",
        vendor_id: "",
        start_date: "",
        end_date: "",
        total_value: "",
        invoice_number: "",
        po_number: "",
        counter_number: "",
        customer_account: "",
        ordered_by: "",
        special_instructions: "",
        sale_type: "",
        date: "",
        ship_via: "",
        sub_total: "",
        sales_tax: "",
        payment_method: "",
        payment_reference: "",
    });

    const [lineItems, setLineItems] = useState<LineItem[]>([
        {
            qty: 0, vehicle_name: "", fuel_type: "", meter_reading: "", unit_type: "", unit: "", tax: "Y", per_unit_price: 0, net: 0
        },
    ]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [vehiclesRes, vendorsRes] = await Promise.all([
                vehicleService.getAll({ page: 1 }),
                vendorService.getAll({ page: 1 }),
            ]);

            if (vehiclesRes.data?.status && vehiclesRes.data?.vehical?.data) {
                setVehicles(vehiclesRes.data.vehical.data);
            }

            if (vendorsRes.data?.status && vendorsRes.data?.vendor?.data) {
                setVendors(vendorsRes.data.vendor.data);
            }
        } catch {
            setGeneralError("Failed to load data");
        }
    }, []);

    const fetchFuelReport = useCallback(async (reportId: number) => {
        setIsLoading(true);
        try {
            const response = await fuelReportService.getById(reportId);
            if (response.data?.status && response.data?.data) {
                const record = response.data.data;
                setFormData({
                    vehicle_id: String(record.vehicle_id || ""),
                    vendor_id: String(record.vendor_id || ""),
                    start_date: record.start_date || "",
                    end_date: record.end_date || "",
                    total_value: String(record.total_value || ""),
                    invoice_number: record.invoice_number || "",
                    po_number: record.po_number || "",
                    counter_number: record.counter_number || "",
                    customer_account: record.customer_account || "",
                    ordered_by: record.ordered_by || "",
                    special_instructions: record.special_instructions || "",
                    sale_type: record.sale_type || "",
                    date: record.date || "",
                    ship_via: record.ship_via || "",
                    sub_total: String(record.sub_total || ""),
                    sales_tax: String(record.sales_tax || ""),
                    payment_method: record.payment_method || "",
                    payment_reference: record.payment_reference || "",
                });
                if (record.line_items && Array.isArray(record.line_items)) {
                    setLineItems(record.line_items);
                }
                if (record.vendor_id) {
                    const vendor = vendors.find(v => v.id === record.vendor_id);
                    if (vendor) setSelectedVendor(vendor);
                }
            }
        } catch {
            setGeneralError("Failed to load fuel report");
        } finally {
            setIsLoading(false);
        }
    }, [vendors]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        if (isEditMode && id) {
            fetchFuelReport(parseInt(id));
        }
    }, [isEditMode, id, fetchFuelReport]);

    useEffect(() => {
        calculateTotals(lineItems);
    }, [lineItems]);

    const fetchFilteredFuels = useCallback(async () => {
        try {
            const fuelsRes = await fuelService.getAll({
                page: 1,
            });

            const fuels = (fuelsRes.data?.fuel?.data || []) as Fuel[];

            const filteredFuels = fuels.filter((fuel: Fuel) => {
                if (fuel.vehicle_id !== Number(formData.vehicle_id)) return false;
                if (formData.vendor_id && fuel.vendor_id !== Number(formData.vendor_id)) return false;
                if (formData.start_date && fuel.date) {
                    const fuelDate = new Date(fuel.date);
                    const filterStartDate = new Date(formData.start_date);
                    if (fuelDate < filterStartDate) return false;
                }
                if (formData.end_date && fuel.date) {
                    const fuelDate = new Date(fuel.date);
                    const filterEndDate = new Date(formData.end_date);
                    if (fuelDate > filterEndDate) return false;
                }
                return true;
            });

            const fuelLineItems: LineItem[] = filteredFuels.map((fuel: Fuel) => {
                const quantity = 1;
                const totalUnit = Number(fuel.units) || 0;

                const pricePerUnit = Number(
                    String(fuel.price_per_volume_unit).replace(/[^0-9.]/g, '')
                ) || 0;

                // calculation
                const extended = totalUnit * pricePerUnit;
                console.log(typeof (totalUnit), typeof (quantity), typeof (pricePerUnit))
                return {
                    qty: quantity,
                    // line: "",
                    vehicle_name: fuel.vehicle?.vehicle_name || "",
                    fuel_type: fuel.fuel_type || "",
                    meter_reading: `${fuel.vehicle_meter || ""}`,
                    unit_type: fuel.unit_type || "",
                    unit: String(fuel.units || ""),
                    tax: "Y",
                    per_unit_price: pricePerUnit,
                    net: extended,
                    // extended: extended

                };
            });

            setLineItems([...fuelLineItems]);
        } catch {
            setGeneralError("Failed to load fuel data");
        }
    }, [formData.vehicle_id, formData.start_date, formData.end_date, formData.vendor_id]);

    useEffect(() => {
        if (formData.vehicle_id && formData.start_date && formData.end_date) {
            fetchFilteredFuels();
        }
    }, [formData.vehicle_id, formData.start_date, formData.end_date, fetchFilteredFuels]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }

    const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vendorId = e.target.value;
        setFormData(prev => ({ ...prev, vendor_id: vendorId }));

        if (fieldErrors.vendor_id) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.vendor_id;
                return newErrors;
            });
        }

        if (vendorId) {
            const vendor = vendors.find(v => v.id === Number(vendorId));
            setSelectedVendor(vendor || null);
        } else {
            setSelectedVendor(null);
        }
    };

    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const newLineItems = [...lineItems];
        const currentItem = newLineItems[index];
        if (field === "unit") {
            const perPriceUnit = Number(currentItem.per_unit_price) || 0;
            const newUnit = Number(value) || 0;
            const NewExtended = Number(value) * perPriceUnit;

            newLineItems[index] = {
                ...currentItem,
                unit: String(newUnit),
                net: NewExtended,
            };
        } else if (field === "per_unit_price") {
            const unit = Number(currentItem.unit) || 0;
            const perUnitPerice = Number(value) || 0;
            const NewExtended = Number(value) * unit;

            newLineItems[index] = {
                ...currentItem,
                per_unit_price: perUnitPerice,
                net: NewExtended,
            };
        }
        else {
            newLineItems[index] = {
                ...currentItem,
                [field]: value,
            };
        }

        setLineItems(newLineItems);
    };


    const calculateTotals = (items: LineItem[]) => {
        const subTotal = items.reduce((sum, item) => sum + (item.net || 0), 0);
        setFormData(prev => ({
            ...prev,
            sub_total: subTotal.toFixed(2),
            total_value: (subTotal + Number(prev.sales_tax || 0)).toFixed(2)
        }));
    };

    const addLineItem = () => {
        setLineItems([...lineItems, {
            qty: 1, fuel_type: "", vehicle_name: "", meter_reading: "", unit_type: "", unit: "", tax: "Y", per_unit_price: 0, net: 0
        }]);
    };

    const removeLineItem = (index: number) => {
        const newLineItems = lineItems.filter((_, i) => i !== index);
        setLineItems(newLineItems);
        calculateTotals(newLineItems);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.backgroundColor = "transparent";
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.backgroundColor = "#f1f4ff";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                vehicle_id: Number(formData.vehicle_id),
                vendor_id: formData.vendor_id ? Number(formData.vendor_id) : undefined,
                start_date: formData.start_date || undefined,
                end_date: formData.end_date || undefined,
                total_value: formData.total_value ? Number(formData.total_value) : undefined,
                invoice_number: formData.invoice_number || undefined,
                po_number: formData.po_number || undefined,
                counter_number: formData.counter_number || undefined,
                customer_account: formData.customer_account || undefined,
                ordered_by: formData.ordered_by || undefined,
                special_instructions: formData.special_instructions || undefined,
                sale_type: formData.sale_type || undefined,
                date: formData.date || undefined,
                ship_via: formData.ship_via || undefined,
                line_items: lineItems,
                sub_total: formData.sub_total ? Number(formData.sub_total) : undefined,
                sales_tax: formData.sales_tax ? Number(formData.sales_tax) : undefined,
                payment_method: formData.payment_method || undefined,
                payment_reference: formData.payment_reference || undefined,
            };

            const response = isEditMode && id
                ? await fuelReportService.update(parseInt(id), submitData)
                : await fuelReportService.create(submitData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                setSuccessMessage("Fuel report saved successfully!");
                setTimeout(() => navigate("/reports/fuel"), 1500);
            } else {
                setGeneralError(response.data?.message || "Failed to save fuel report.");
            }
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            setGeneralError(errorMessage || "An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateTimeChange = (name: string) => (_dates: unknown, dateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: dateString }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.invoice_number?.trim()) {
            errors.invoice_number = "Invoice number is required";
        }

        if (!formData.sale_type?.trim()) {
            errors.sale_type = "Sale type is required";
        }

        if (!formData.date?.trim()) {
            errors.date = "Date is required";
        }

        if (!formData.ship_via?.trim()) {
            errors.ship_via = "Ship Via is required";
        }

        if (!formData.po_number?.trim()) {
            errors.po_number = "PO Number is required";
        }

        if (!formData.vendor_id?.trim()) {
            errors.vendor_id = "Vendor is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Fuel Report" : "Create Fuel Report"}
                description="Manage fuel reports"
            />

            <div className="space-y-6">
                <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEditMode ? "Edit Fuel Report" : "Create Fuel Report"}
                    </h2>
                </div>

                <div className="w-full max-w-5xl mx-auto border border-gray-200 rounded-xl p-6">
                    {(generalError || successMessage) && (
                        <div className={`mb-4 p-4 rounded-lg ${generalError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                            {generalError || successMessage}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : (
                        <div id="fuel-form-container" style={{ width: "100%", fontFamily: "Arial, sans-serif", border: "3px solid #000", padding: "15px", backgroundColor: "#fff" }}>
                            <form onSubmit={handleSubmit}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <td style={{ padding: "0", verticalAlign: "top" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ padding: "0 0 10px 0", verticalAlign: "top", width: "60%" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <img src="/images/pdf-logo.png" alt="Logo" style={{ maxWidth: "200px", height: "auto", marginBottom: "5px" }} />
                                                                                <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "10px", letterSpacing: "2px" }}>DEDICATED TO THE PROFESSIONAL</div>
                                                                                <div style={{ fontSize: "11px", marginTop: "3px", lineHeight: "1.4" }}>
                                                                                    <div>Store 464, 11448 AIRLINE HIGHWAY,</div>
                                                                                    <div>BATON ROUGE, LA 70816 <span style={{ marginLeft: "10px" }}>(225) 292-8930</span></div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ padding: "10px 0", verticalAlign: "top" }}>
                                                                                <div style={{ fontSize: "11px", lineHeight: "1.5" }}>
                                                                                    <div style={{ fontWeight: "bold", marginBottom: "3px", paddingBottom: "2px" }}>Bill To: <span style={{ color: "red" }}>*</span></div>
                                                                                    <div style={{ marginTop: "5px" }}>
                                                                                        <select
                                                                                            value={formData.vendor_id}
                                                                                            onChange={handleVendorChange}
                                                                                            style={{ width: "50%", backgroundColor: "#f1f4ff", border: fieldErrors.vendor_id ? "1px solid red" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none", fontWeight: "bold" }}
                                                                                            onFocus={handleInputFocus}
                                                                                            onBlur={handleInputBlur}
                                                                                        >
                                                                                            <option value="">Select Vendor</option>
                                                                                            {vendors.map((vendor) => (
                                                                                                <option key={vendor.id} value={vendor.id}>
                                                                                                    {vendor.name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {fieldErrors.vendor_id && (
                                                                                            <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.vendor_id}</div>
                                                                                        )}
                                                                                    </div>
                                                                                    {selectedVendor && (
                                                                                        <div style={{ marginTop: "5px", fontSize: "12px", lineHeight: "1.4" }}>
                                                                                            <div>{selectedVendor.address || "."}</div>
                                                                                            <div>{selectedVendor.city || "."}, {selectedVendor.state || ""} {selectedVendor.zip || ""}</div>
                                                                                            <div><span style={{ fontWeight: "bold" }}>Email:</span> {selectedVendor.email || ""}</div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>

                                                            <td style={{ padding: "0 0 10px 0", verticalAlign: "top", width: "40%", textAlign: "right" }}>
                                                                <table style={{ width: "100%", border: "1px solid #000", borderCollapse: "collapse", maxWidth: "310px", marginLeft: "auto" }} cellPadding="2" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>Invoice: <span style={{ color: "red" }}>*</span></td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.invoice_number}
                                                                                    onChange={(e) => handleInputChange("invoice_number", e.target.value)}
                                                                                    style={{ width: "100%", border: fieldErrors.invoice_number ? "1px solid red" : "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                                {fieldErrors.invoice_number && (
                                                                                    <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.invoice_number}</div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Sale Type <span style={{ color: "red" }}>*</span></td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.sale_type}
                                                                                    onChange={(e) => handleInputChange("sale_type", e.target.value)}
                                                                                    style={{ width: "100%", border: fieldErrors.sale_type ? "1px solid red" : "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                                {fieldErrors.sale_type && (
                                                                                    <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.sale_type}</div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Date <span style={{ color: "red" }}>*</span></td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <div className="date-picker" style={{ width: "100%", backgroundColor: "#f1f4ff", border: fieldErrors.date ? "1px solid red" : "none", padding: "2px", fontSize: "10px", borderRadius: "2px" }}>
                                                                                    <DatePicker
                                                                                        id="date"
                                                                                        placeholder="Select date"
                                                                                        onChange={handleDateTimeChange("date")}
                                                                                        defaultDate={formData.date || undefined}
                                                                                    />
                                                                                </div>
                                                                                {fieldErrors.date && (
                                                                                    <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.date}</div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Ship Via <span style={{ color: "red" }}>*</span></td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.ship_via}
                                                                                    onChange={(e) => handleInputChange("ship_via", e.target.value)}
                                                                                    style={{ width: "100%", border: fieldErrors.ship_via ? "1px solid red" : "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                                {fieldErrors.ship_via && (
                                                                                    <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.ship_via}</div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>PO Number <span style={{ color: "red" }}>*</span></td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.po_number}
                                                                                    onChange={(e) => handleInputChange("po_number", e.target.value)}
                                                                                    style={{ width: "100%", border: fieldErrors.po_number ? "1px solid red" : "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                                {fieldErrors.po_number && (
                                                                                    <div style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{fieldErrors.po_number}</div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan={2} style={{ padding: "10px 0" }}>
                                                                <div className="grid grid-cols-[1fr_auto] mb-2 items-center">
                                                                    <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#374151" }}>Invoice Details</h3>

                                                                    <div className="date-time-picker" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                                                                        <select
                                                                            value={formData.vehicle_id}
                                                                            onChange={(e) => handleInputChange("vehicle_id", e.target.value)}
                                                                            style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #d1d5db", padding: "8px", fontSize: "12px", borderRadius: "6px", outline: "none" }}
                                                                        >
                                                                            <option value="">Select Vehicle</option>
                                                                            {vehicles.map((vehicle) => (
                                                                                <option key={vehicle.id} value={vehicle.id}>
                                                                                    {vehicle.vehicle_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>


                                                                        <DatePicker
                                                                            id="start_date"
                                                                            placeholder="Select start date"
                                                                            onChange={handleDateTimeChange("start_date")}
                                                                            defaultDate={formData.start_date || undefined}
                                                                        />

                                                                        <DatePicker
                                                                            id="end_date"
                                                                            placeholder="Select end date"
                                                                            onChange={handleDateTimeChange("end_date")}
                                                                            defaultDate={formData.end_date || undefined}
                                                                        />

                                                                    </div>
                                                                </div>

                                                                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginTop: "10px" }} cellPadding="5" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Counter #</td>
                                                                            <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Customer Account</td>
                                                                            <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Ordered By</td>
                                                                            <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Special Instructions</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ border: "1px solid #000", padding: "5px" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.counter_number}
                                                                                    onChange={(e) => handleInputChange("counter_number", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                            <td style={{ border: "1px solid #000", padding: "5px" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.customer_account}
                                                                                    onChange={(e) => handleInputChange("customer_account", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                            <td style={{ border: "1px solid #000", padding: "5px" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.ordered_by}
                                                                                    onChange={(e) => handleInputChange("ordered_by", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                            <td style={{ border: "1px solid #000", padding: "5px" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.special_instructions}
                                                                                    onChange={(e) => handleInputChange("special_instructions", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "10px 0 0 0" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }} cellPadding="3" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            {/* <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Qty</th> */}
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Vehicle</th>
                                                            {/* <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Line</th> */}
                                                            {/* <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Fuel Type</th> */}
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Meter Reading</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Unit Type</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Unit</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Tax</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Price Per Unit</th>
                                                            {/* <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Net</th> */}
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Total</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lineItems.map((item, index) => (
                                                            <tr key={index}>
                                                                {/* <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.qty}
                                                                        onChange={(e) => handleLineItemChange(index, "qty", Number(e.target.value))}
                                                                        style={{ width: "50px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td> */}
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.vehicle_name}
                                                                        onChange={(e) => handleLineItemChange(index, "vehicle_name", e.target.value)}
                                                                        style={{ width: "100px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}

                                                                    />
                                                                </td>
                                                                {/* <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.line}
                                                                        onChange={(e) => handleLineItemChange(index, "line", e.target.value)}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td> */}
                                                                {/* <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <select
                                                                        value={item.fuel_type || ""}
                                                                        onChange={(e) => handleLineItemChange(index, "fuel_type", e.target.value)}
                                                                        style={{ width: "90px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                        onFocus={handleInputFocus}
                                                                        onBlur={handleInputBlur}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {fuelTypeOptions.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td> */}
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.meter_reading}
                                                                        onChange={(e) => handleLineItemChange(index, "meter_reading", e.target.value)}
                                                                        style={{ width: "75%", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <select
                                                                        value={item.unit_type}
                                                                        onChange={(e) => handleLineItemChange(index, "unit_type", e.target.value)}
                                                                        style={{ width: "95px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                        onFocus={handleInputFocus}
                                                                        onBlur={handleInputBlur}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {UnitTypeOptions.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.unit}
                                                                        onChange={(e) => handleLineItemChange(index, "unit", e.target.value)}
                                                                        style={{ width: "62px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <select
                                                                        value={item.tax || "Y"}
                                                                        onChange={(e) => handleLineItemChange(index, "tax", e.target.value)}
                                                                        style={{ width: "40px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                        onFocus={handleInputFocus}
                                                                        onBlur={handleInputBlur}
                                                                    >
                                                                        {TAX_OPTIONS.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.per_unit_price}
                                                                        onChange={(e) => handleLineItemChange(index, "per_unit_price", Number(e.target.value))}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.net.toFixed(2)}
                                                                        onChange={(e) => handleLineItemChange(index, "net", Number(e.target.value))}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                {/* <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>

                                                                    {`$ ${item.extended.toFixed(2)}`}
                                                                </td> */}
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeLineItem(index)}
                                                                        style={{ padding: "2px 6px", fontSize: "11px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button
                                                    type="button"
                                                    onClick={addLineItem}
                                                    style={{ marginTop: "10px", padding: "5px 15px", fontSize: "12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                >
                                                    Add Line Item
                                                </button>
                                                <div style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold", marginTop: "20px" }}>**Historical Reprint**</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td style={{ padding: "15px 0 0 0" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td><div style={{ fontSize: "10px", marginBottom: "5px", borderBottom: "1px solid #000" }}>{lineItems.length} Items</div></td>
                                                        </tr>
                                                        <tr>
                                                            <td><div style={{ fontSize: "10px", borderTop: "2px solid #000", textAlign: "right" }}>
                                                                Chip Used: N REF #: 556891698724 AUTH CD: 175275
                                                            </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div style={{ fontSize: "10px", padding: "10px 0" }}>
                                                                    <div style={{ marginBottom: "5px" }}>
                                                                        <strong>Payment Method:</strong>
                                                                        <input
                                                                            type="text"
                                                                            value={formData.payment_method}
                                                                            onChange={(e) => handleInputChange("payment_method", e.target.value)}
                                                                            style={{ marginLeft: "10px", border: "1px solid #000", padding: "2px 5px", fontSize: "10px", backgroundColor: "#f1f4ff" }}
                                                                            placeholder="e.g. AMEX #1051"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <strong>Payment Reference:</strong>
                                                                        <input
                                                                            type="text"
                                                                            value={formData.payment_reference}
                                                                            onChange={(e) => handleInputChange("payment_reference", e.target.value)}
                                                                            style={{ marginLeft: "10px", border: "1px solid #000", padding: "2px 5px", fontSize: "10px", backgroundColor: "#f1f4ff" }}
                                                                            placeholder="REF #"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "21px" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ verticalAlign: "bottom", width: "35%" }}>
                                                                <img src="/images/qr-code-img.jpg" alt="QR code" style={{ width: "100%", maxWidth: "65%", height: "75px" }} />
                                                            </td>
                                                            <td style={{ verticalAlign: "bottom", width: "35%" }}>
                                                                <img src="/images/bar-code-img.jpg" alt="Bar Code" style={{ width: "100%", maxWidth: "63%", height: "auto" }} />
                                                            </td>
                                                            <td style={{ verticalAlign: "top", textAlign: "right", width: "30%" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse", marginLeft: "auto" }} cellPadding="2" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 5px" }}>Sub-Total</td>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>${formData.sub_total || "0.00"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 5px", borderBottom: "1px solid #000" }}>
                                                                                <span>Sales Tax</span>
                                                                            </td>
                                                                            <td style={{ fontSize: "12px", padding: "2px 0", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    value={formData.sales_tax}
                                                                                    onChange={(e) => {
                                                                                        const tax = Number(e.target.value);
                                                                                        handleInputChange("sales_tax", e.target.value);
                                                                                        const total = Number(formData.sub_total || 0) + tax;
                                                                                        handleInputChange("total_value", total.toFixed(2));
                                                                                    }}
                                                                                    style={{ width: "70px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 5px", fontWeight: "bold" }}>Total</td>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", fontWeight: "bold" }}>${formData.total_value || "0.00"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={2} style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>
                                                                                {formData.payment_method} {formData.total_value || "0.00"}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ width: "60%", padding: "15px 0 5px 0" }}>
                                                                <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WWW.OREILLYPRO.COM</div>
                                                                <div style={{ fontSize: "10px", marginBottom: "8px" }}>Warranty/Garantia: www.oreillypro.com/warranty</div>
                                                            </td>
                                                            <td style={{ width: "30%", padding: "15px 0 5px 0" }}>
                                                                <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WE APPRECIATE YOUR BUSINESS!</div>
                                                                <div style={{ fontSize: "10px" }}>464WS167 Remit To: PO BOX 9464, SPRINGFIELD, MO 65801-9464</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div style={{ padding: "20px", textAlign: "right" }}>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isSubmitting}
                                        variant="primary"
                                    >
                                        {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Fuel Report" : "Save Fuel Report")}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/reports/fuel")}
                                        disabled={isSubmitting}
                                        className="ml-2"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
