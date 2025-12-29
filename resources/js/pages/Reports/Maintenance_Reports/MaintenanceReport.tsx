import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { vehicleService } from "../../../services/vehicleService";
import { vendorService } from "../../../services/vendorService";
import { settingsService } from "../../../services/settingsService";
import { maintenanceRecordService } from "../../../services/maintenanceRecordService";
import DatePicker from "../../../components/form/date-picker";
import { workOrderService } from "../../../services/workOrderService";
import { serviceService } from "../../../services/serviceService";
import { WARRANTY_OPTIONS, TAX_OPTIONS, Unit_OPTIONS } from "../../../constants/selectOptions";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

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
interface Settings {
    id?: number;
    title?: string;
    company_name?: string;
    phone_number?: string;
    address?: string;
    state?: string;
    city?: string;
    country?: string;
    post_code?: string;
    primary_email?: string;
    logo_image?: string;
}

interface WorkOrderPart {
    warranty_period_months?: string;
    part_code?: string;
    label?: string;
    value?: string | number;
    quantity?: number;
    unit_price?: string | number;
    purchase_price?: string | number;
}

interface WorkOrder {
    id?: number;
    vehicle_id?: number;
    parts?: WorkOrderPart[];
    service_items?: unknown[];
    actual_start_date?: string;
    actual_completion_date?: string;
    total_value?: number;
}

interface Service {
    id?: number;
    vehicle_id?: number;
    vendor_id?: number;
    parts?: WorkOrderPart[];
    completion_date?: string;
    start_date?: string;
}

export default function MaintenanceReport() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    // const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>({});
    const [isRefersh, setIsRefersh] = useState(false);

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
        { qty: 1, line: "", item_number: "", description: "", warr: "", unit: "", tax: "Y", list: 0, net: 0, extended: 0 },
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

    const getSettingFunction = useCallback(async () => {
        try {
            const [settingsRes] = await Promise.all([
                settingsService.get(),

            ]);
            if (settingsRes.data?.status && settingsRes.data?.data) {
                setSettings(settingsRes.data.data);
            }


        } catch {
            setGeneralError("Failed to load logo img");
        }
    }, []);

    const fetchMaintenanceRecord = useCallback(async (recordId: number) => {
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
                // if (record.vendor_id) {
                //     const vendor = vendors.find(v => v.id === record.vendor_id);
                //     if (vendor) setSelectedVendor(vendor);
                // }
                if (record.vendor_id) {
                    return record.vendor_id;
                }
            }
        } catch {
            setGeneralError("Failed to load maintenance record");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (formData.vendor_id && vendors.length > 0) {
            const vendor = vendors.find(v => v.id === Number(formData.vendor_id));
            if (vendor) setSelectedVendor(vendor);
        }
    }, [formData.vendor_id]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);
    useEffect(() => {
        getSettingFunction();
    }, []);

    useEffect(() => {
        if (isEditMode && id) {
            fetchMaintenanceRecord(parseInt(id));
        }
    }, [isEditMode, id, fetchMaintenanceRecord]);
    useEffect(() => {
        calculateTotals(lineItems);
    }, [lineItems]);
    const fetchFilteredWorkOrders = useCallback(async () => {
        try {
            const [workOrdersRes, servicesRes] = await Promise.all([
                workOrderService.getAll({
                    vehicle_id: Number(formData.vehicle_id),
                    vendor_id: Number(formData.vendor_id),
                    start_date: formData.actual_start_date,
                    end_date: formData.actual_completion_date,
                }),
                serviceService.getAll({
                    page: 1,
                    vehicle_id: Number(formData.vehicle_id),
                    vendor_id: Number(formData.vendor_id),
                    start_date: formData.actual_start_date,
                    end_date: formData.actual_completion_date,

                }),
            ]);

            const workOrders = (workOrdersRes.data?.work_orders?.data as WorkOrder[] || []) as WorkOrder[];
            const services = (servicesRes.data?.services?.data as Service[] || []) as Service[];

            const filteredServices = services.filter((service: Service) => {
                if (service.vehicle_id !== Number(formData.vehicle_id)) return false;
                if (formData.vendor_id && service.vendor_id !== Number(formData.vendor_id)) return false;
                if (formData.actual_start_date && service.start_date) {
                    const serviceStartDate = new Date(service.start_date);
                    const filterStartDate = new Date(formData.actual_start_date);
                    if (serviceStartDate < filterStartDate) return false;
                }
                if (formData.actual_completion_date && service.completion_date) {
                    const serviceCompletionDate = new Date(service.completion_date);
                    const filterCompletionDate = new Date(formData.actual_completion_date);
                    if (serviceCompletionDate > filterCompletionDate) return false;
                }
                return true;
            });

            const workOrderLineItems: LineItem[] = workOrders.flatMap((wo: WorkOrder) => {
                if (!wo.parts || wo.parts?.length === 0) return [];

                return wo.parts.map((part: WorkOrderPart) => {
                    const quantity = part.quantity || Number(part.value) || 1;
                    return {
                        qty: quantity,
                        line: "",
                        item_number: part.part_code || "",
                        description: part.label || "",
                        warr: part.warranty_period_months ? (part.warranty_period_months) : "",
                        unit: String(part.value || ""),
                        tax: "Y",
                        list: Number(part.unit_price) || 0,
                        net: Number(part.unit_price) || 0,
                        extended: quantity * (Number(part.purchase_price) || 0),
                    };
                });
            });

            const serviceLineItems: LineItem[] = filteredServices.flatMap((service: Service) => {
                if (!service.parts || service.parts?.length === 0) return [];

                return service.parts.map((part: WorkOrderPart & { quantity?: number }) => {
                    const quantity = part.quantity || Number(part.value) || 1;
                    return {
                        qty: quantity,
                        line: "",
                        item_number: part.part_code || "",
                        description: part.label || "",
                        warr: part.warranty_period_months ? part.warranty_period_months : "",
                        unit: String(part.value || ""),
                        tax: "Y",
                        list: Number(part.unit_price) || 0,
                        net: Number(part.unit_price) || 0,
                        extended: quantity * (Number(part.purchase_price) || 0),
                    };
                });
            });

            const allLineItems = [...workOrderLineItems, ...serviceLineItems];

            setLineItems([...allLineItems]);

        } catch {
            setGeneralError("Failed to load work orders and services data");
        }
    }, [formData.vehicle_id, formData.actual_start_date, formData.actual_completion_date]);

    useEffect(() => {
        if (formData.vehicle_id && formData.actual_start_date && formData.actual_completion_date) {
            if (isRefersh) {
                fetchFilteredWorkOrders();
                setIsRefersh(false)
            }
        }
    }, [formData.vehicle_id, formData.actual_start_date, formData.actual_completion_date, isRefersh]);
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
        newLineItems[index] = { ...newLineItems[index], [field]: value };

        if (field === 'qty' || field === 'net') {
            const qty = field === 'qty' ? Number(value) : newLineItems[index].qty;
            const net = field === 'net' ? Number(value) : newLineItems[index].net;
            newLineItems[index].extended = qty * net;
        }
        setLineItems(newLineItems);

        if (field === 'item_number' && fieldErrors.lineItems && Array.isArray(fieldErrors.lineItems)) {
            const newLineItemErrors = [...(fieldErrors.lineItems as string[])];
            delete newLineItemErrors[index];

            setFieldErrors(prev => {
                const newErrors = { ...prev };
                if (newLineItemErrors.filter(Boolean).length === 0) {
                    delete newErrors.lineItems;
                } else {
                    newErrors.lineItems = newLineItemErrors;
                }
                return newErrors;
            });
        }
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
            qty: 1, line: "", item_number: "", description: "",
            warr: "", unit: "", tax: "Y", list: 0, net: 0, extended: 0
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

    const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const messageEl = document.getElementById('message-container');
        if (messageEl) {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => scrollToTop(), 100);
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
                setTimeout(() => navigate("/reports/maintenance"), 1500);
            } else {
                setGeneralError(response.data?.message || "Failed to save maintenance record.");
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


    // const handleDateTimeChange = (name: string) => (_dates: unknown, dateString: string) => {
    //     setFormData((prev) => ({ ...prev, [name]: dateString }));
    //     if (fieldErrors[name]) {
    //         setFieldErrors(prev => {
    //             const newErrors = { ...prev };
    //             delete newErrors[name];
    //             return newErrors;
    //         });
    //     }
    // };


    const validateForm = (): boolean => {
        const errors: Record<string, string | string[]> = {};

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

        const lineItemErrors: string[] = [];
        lineItems.forEach((item, index) => {
            if (!item.item_number?.trim()) {
                lineItemErrors[index] = "Item no. is required";
            }
        });

        if (lineItemErrors.length > 0) {
            errors.lineItems = lineItemErrors;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleDateTimeChange = (name: string) => (_dates: unknown, dateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: dateString }));
        setIsRefresh(true);
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

    };

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Maintenance Report" : "Create Maintenance Report"}
                description="Manage maintenance reports"
            />

            <PageBreadcrumb pageTitle={[
                { name: "Maintenance Reports", to: "/reports/maintenance" },
                { name: isEditMode ? "Edit" : "Create", to: isEditMode ? `/reports/maintenance/${id}` : "/reports/maintenance/create" },
            ]} />

            <div className="space-y-6" id='message-container'>
                <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEditMode ? "Edit Maintenance Report" : "Create Maintenance Report"}
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
                                                                                <img src={settings?.logo_image} alt="Logo" style={{ width: "100%", maxWidth: "100px", height: "auto", marginBottom: "5px" }} />
                                                                                <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "10px", letterSpacing: "2px" }}>{settings?.title || "DEDICATED TO THE PROFESSIONAL"}</div>
                                                                                <div style={{ fontSize: "11px", marginTop: "3px", lineHeight: "1.4" }}>
                                                                                    <div>{settings?.company_name},{settings?.address}</div>
                                                                                    <div>{settings?.city},{settings?.post_code}
                                                                                        <span style={{ marginLeft: "10px" }}>
                                                                                            {settings?.phone_number || "(225) 292-8930"}
                                                                                        </span></div>
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
                                                                                            <div>{selectedVendor.address || "."}
                                                                                            </div>
                                                                                            <div>{selectedVendor.city || "."},
                                                                                                {selectedVendor.state || ""} {selectedVendor.zip || ""}
                                                                                            </div>
                                                                                            <div>
                                                                                                <span style={{ fontWeight: "bold" }}>Email:</span> {selectedVendor.email || ""}
                                                                                            </div>

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
                                                                        <tr >
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
                                                                    <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#374151" }} > Invoice Details </h3>

                                                                    <div className="date-time-picker" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }} >
                                                                        <select value={formData.vehicle_id}
                                                                            onChange={(e) => { handleInputChange("vehicle_id", e.target.value), setIsRefersh(true) }}
                                                                            style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #d1d5db", padding: "8px", fontSize: "12px", borderRadius: "6px", outline: "none" }} >
                                                                            <option value="">Select Vehicle</option>
                                                                            {vehicles.map((vehicle) => (
                                                                                <option key={vehicle.id} value={vehicle.id}>
                                                                                    {vehicle.vehicle_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>


                                                                        <DatePicker
                                                                            id="actual_start_date"
                                                                            placeholder="Select start date"
                                                                            onChange={handleDateTimeChange("actual_start_date")}
                                                                            defaultDate={formData.actual_start_date || undefined}


                                                                        />

                                                                        <DatePicker
                                                                            id="actual_completion_date"
                                                                            placeholder="Select completion date"
                                                                            onChange={ handleDateTimeChange("actual_completion_date")}
                                                                            defaultDate={formData.actual_completion_date || undefined}
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
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Qty</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Line</th>
                                                            <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }} >Item Number <span style={{ color: "red" }}>*</span></th>
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
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center", position: "relative" }}>

                                                                    <input
                                                                        type="text"
                                                                        value={item.item_number}
                                                                        onChange={(e) => handleLineItemChange(index, "item_number", e.target.value)}
                                                                        style={{ width: "82px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                    {fieldErrors.lineItems && Array.isArray(fieldErrors.lineItems) && fieldErrors.lineItems[index] && (
                                                                        <div style={{ fontSize: "10px", color: "red", position: "absolute", left: "12px", marginTop: "2px" }}>
                                                                            {fieldErrors.lineItems[index]}
                                                                        </div>
                                                                    )}
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
                                                                    <select
                                                                        value={item.warr || ""}
                                                                        onChange={(e) => handleLineItemChange(index, "warr", e.target.value)}
                                                                        style={{ width: "50px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                        onFocus={handleInputFocus}
                                                                        onBlur={handleInputBlur}
                                                                    >
                                                                        {WARRANTY_OPTIONS.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>
                                                                    <select
                                                                        value={item.unit || ""}
                                                                        onChange={(e) => handleLineItemChange(index, "unit", e.target.value)}
                                                                        style={{ width: "50px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "center", backgroundColor: "#f1f4ff", outline: "none" }}
                                                                        onFocus={handleInputFocus}
                                                                        onBlur={handleInputBlur}
                                                                    >
                                                                        {Unit_OPTIONS.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
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
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>
                                                                    <input
                                                                        type="number"
                                                                        value={item.list}
                                                                        onChange={(e) => handleLineItemChange(index, "list", Number(e.target.value))}
                                                                        style={{ width: "60px", border: "1px solid #ccc", padding: "2px", fontSize: "12px", textAlign: "right", backgroundColor: "#f1f4ff" }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>
                                                                    <input
                                                                        type="number"
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
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>$ {formData.sub_total || "0.00"}</td>
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
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", fontWeight: "bold" }}>$ {formData.total_value || "0.00"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 5px" }}>{formData.payment_method}</td>
                                                                            <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>{formData.payment_method && ('$ ' + formData.total_value || "0.00")}</td>

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
                                                                <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WWW.KAVEXPEDITING.COM</div>
                                                                {/* <div style={{ fontSize: "10px", marginBottom: "8px" }}>Warranty/Garantia: www.oreillypro.com/warranty</div> */}
                                                            </td>
                                                            <td style={{ width: "30%", padding: "15px 0 5px 0" }}>
                                                                <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WE APPRECIATE YOUR BUSINESS!</div>
                                                                {/* <div style={{ fontSize: "10px" }}>464WS167 Remit To: PO BOX 9464, SPRINGFIELD, MO 65801-9464</div> */}
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
                                        {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Maintenance Report" : "Save Maintenance Report")}
                                    </Button>


                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/reports/maintenance")}
                                        disabled={isSubmitting}
                                        className="ml-2"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div >
            </div >
        </>
    );
}

