import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { vehicleService } from "../../../services/vehicleService";
import { vendorService } from "../../../services/vendorService";
import { maintenanceRecordService } from "../../../services/maintenanceRecordService";

interface Vehicle {
    id: number;
    vehicle_name: string;
}

interface Vendor {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
}

interface LineItem {
    qty: number;
    line: string;
    item_number: string;
    description: string;
    warr: string;
    unit: string;
    tax: string;
    list: number;
    net: number;
    extended: number;
}


export default function MaintenanceReport() {
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

    const [formData, setFormData] = useState({
        vehicle_id: "",
        vendor_id: "",
        actual_start_date: "",
        actual_completion_date: "",
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
        { qty: 0, line: "", item_number: "", description: "", warr: "", unit: "", tax: "", list: 0, net: 0, extended: 0 },
    ]);

    useEffect(() => {
        fetchDropdownData();
        if (isEditMode && id) {
            fetchMaintenanceRecord(parseInt(id));
        }
    }, [isEditMode, id]);

    const fetchDropdownData = async () => {
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
    };

    const fetchMaintenanceRecord = async (recordId: number) => {
        setIsLoading(true);
        try {
            const response = await maintenanceRecordService.getById(recordId);
            if (response.data?.status && response.data?.data) {
                const record = response.data.data;
                setFormData({
                    vehicle_id: String(record.vehicle_id || ""),
                    vendor_id: String(record.vendor_id || ""),
                    actual_start_date: record.actual_start_date || "",
                    actual_completion_date: record.actual_completion_date || "",
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
            setGeneralError("Failed to load maintenance record");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vendorId = e.target.value;
        setFormData(prev => ({ ...prev, vendor_id: vendorId }));

        if (vendorId) {
            const vendor = vendors.find(v => v.id === Number(vendorId));
            setSelectedVendor(vendor || null);
        } else {
            setSelectedVendor(null);
        }
    };

    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const newLineItems = [...lineItems];
        newLineItems[index] = { ...newLineItems[index], [field]: value };

        // Auto-calculate extended if qty, net are provided
        if (field === 'qty' || field === 'net') {
            const qty = field === 'qty' ? Number(value) : newLineItems[index].qty;
            const net = field === 'net' ? Number(value) : newLineItems[index].net;
            newLineItems[index].extended = qty * net;
        }

        setLineItems(newLineItems);
        calculateTotals(newLineItems);
    };

    const calculateTotals = (items: LineItem[]) => {
        const subTotal = items.reduce((sum, item) => sum + (item.extended || 0), 0);
        setFormData(prev => ({
            ...prev,
            sub_total: subTotal.toFixed(2),
            total_value: (subTotal + Number(prev.sales_tax || 0)).toFixed(2)
        }));
    };

    const addLineItem = () => {
        setLineItems([...lineItems, {
            qty: 0, line: "", item_number: "", description: "",
            warr: "", unit: "", tax: "", list: 0, net: 0, extended: 0
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
        setIsSubmitting(true);


        try {
            const submitData = {
                vehicle_id: Number(formData.vehicle_id),
                vendor_id: formData.vendor_id ? Number(formData.vendor_id) : undefined,
                actual_start_date: formData.actual_start_date || undefined,
                actual_completion_date: formData.actual_completion_date || undefined,
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
                ? await maintenanceRecordService.update(parseInt(id), submitData)
                : await maintenanceRecordService.create(submitData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                setSuccessMessage("Maintenance record saved successfully!");
                setTimeout(() => navigate("/maintenance-records"), 1500);
            } else {
                setGeneralError(response.data?.message || "Failed to save maintenance record.");
            }
        } catch (error: any) {
            setGeneralError(error.response?.data?.message || "An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedVehicle = vehicles.find(v => v.id === Number(formData.vehicle_id));

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Maintenance Record" : "Create Maintenance Record"}
                description="Manage maintenance records"
            />
            <div className="space-y-6">
                <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEditMode ? "Edit Maintenance Record" : "Create Maintenance Record"}
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
                        <div id="maintenance-form-container" style={{ width: "100%", fontFamily: "Arial, sans-serif", border: "3px solid #000", padding: "15px", backgroundColor: "#fff" }}>
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
                                                                                    <div style={{ fontWeight: "bold", marginBottom: "3px", paddingBottom: "2px" }}>Bill To:</div>
                                                                                    <div style={{ marginTop: "5px" }}>
                                                                                        <select
                                                                                            value={formData.vendor_id}
                                                                                            onChange={handleVendorChange}
                                                                                            style={{ width: "50%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none", fontWeight: "bold" }}
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
                                                                                    </div>
                                                                                    {selectedVendor && (
                                                                                        <>
                                                                                            <div style={{ marginTop: "5px" }}>{selectedVendor.address || '.'}</div>
                                                                                            <div>{selectedVendor.city || '.'}, {selectedVendor.state || ''} {selectedVendor.zip || ''}</div>
                                                                                        </>
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
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>Invoice:</td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.invoice_number}
                                                                                    onChange={(e) => handleInputChange("invoice_number", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Sale Type</td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.sale_type}
                                                                                    onChange={(e) => handleInputChange("sale_type", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Date</td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    value={formData.date}
                                                                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>Ship Via</td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.ship_via}
                                                                                    onChange={(e) => handleInputChange("ship_via", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>PO Number</td>
                                                                            <td style={{ fontSize: "12px", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.po_number}
                                                                                    onChange={(e) => handleInputChange("po_number", e.target.value)}
                                                                                    style={{ width: "100%", border: "none", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} style={{ padding: "10px 0" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000" }} cellPadding="5" cellSpacing="0">
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
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Qty</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Line</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Item Number</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "left" }}>Description</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Warr</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Unit</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Tax</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>List</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>Net</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>Extended</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lineItems.map((item, index) => (
                                                            <tr key={index}>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.qty}
                                                                        onChange={(e) => handleLineItemChange(index, "qty", Number(e.target.value))}
                                                                        style={{ width: "50px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.line}
                                                                        onChange={(e) => handleLineItemChange(index, "line", e.target.value)}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.item_number}
                                                                        onChange={(e) => handleLineItemChange(index, "item_number", e.target.value)}
                                                                        style={{ width: "80px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.description}
                                                                        onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                                                                        style={{ width: "100%", border: "1px solid #ccc", padding: "2px", fontSize: "12px", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.warr}
                                                                        onChange={(e) => handleLineItemChange(index, "warr", e.target.value)}
                                                                        style={{ width: "40px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.unit}
                                                                        onChange={(e) => handleLineItemChange(index, "unit", e.target.value)}
                                                                        style={{ width: "40px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <input
                                                                        type="text"
                                                                        value={item.tax}
                                                                        onChange={(e) => handleLineItemChange(index, "tax", e.target.value)}
                                                                        style={{ width: "40px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.list}
                                                                        onChange={(e) => handleLineItemChange(index, "list", Number(e.target.value))}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.net}
                                                                        onChange={(e) => handleLineItemChange(index, "net", Number(e.target.value))}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>
                                                                    {item.extended.toFixed(2)}
                                                                </td>
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
                                                            <td>
                                                                <div style={{ fontSize: "10px", borderTop: "2px solid #000", padding: "10px 0" }}>
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
                                                                <img src="/images/qr-code-img.jpg" alt="QR code" style={{ width: "100%", maxWidth: "90%", height: "auto" }} />
                                                            </td>
                                                            <td style={{ verticalAlign: "bottom", width: "35%" }}>
                                                                <img src="/images/bar-code-img.jpg" alt="Bar Code" style={{ width: "100%", maxWidth: "90%", height: "auto" }} />
                                                            </td>
                                                            <td style={{ verticalAlign: "top", textAlign: "right", width: "30%" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse", marginLeft: "auto" }} cellPadding="2" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 5px" }}>Sub-Total</td>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>{formData.sub_total || "0.00"}</td>
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
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", fontWeight: "bold" }}>{formData.total_value || "0.00"}</td>
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
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div style={{ padding: "20px", textAlign: "right" }}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                        className="mr-3"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isSubmitting}
                                        className="px-6 py-2"
                                    >
                                        {isSubmitting ? "Saving..." : isEditMode ? "Update Record" : "Save Record"}
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

