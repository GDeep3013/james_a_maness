import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { vehicleService } from "../../../services/vehicleService";
import { mmrReportService } from "../../../services/mmrReportService";
import Button from "../../../components/ui/button/Button";
import MMRTaskList from "./MMRTaskList";
import { MMRReport, MaintenanceRecord } from "../../../types/MMRReportTypes";
import { formatDate } from "../../../utilites/formatting";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DatePicker from "../../../components/form/month-year-picker";

interface Vehicle {
    id: number;
    vehicle_name: string;
    current_mileage?: string | number;
}

interface VehiclesResponse {
    status: boolean;
    vehical: Vehicle[] | {
        data: Vehicle[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}



export default function MonthlyMaintenanceReport() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = location.pathname.includes('/edit');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [formData, setFormData] = useState({
        date: "",
        domicile_station: "",
        provider_company_name: "",
        current_mileage: "",
        vehicle_id: "",
        preventative_maintenance: null as boolean | null,
        out_of_service: null as boolean | null,
        signature: "",
        declaration: null as boolean | null,
        completed_date: "",
        maintenance_records: [] as MaintenanceRecord[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);



    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await vehicleService.getAll();
                const data = response.data as VehiclesResponse;

                if (data.status && data.vehical) {
                    if (Array.isArray(data.vehical)) {
                        setVehicles(data.vehical);
                    } else {
                        setVehicles(data.vehical.data || []);
                    }
                }
            } catch {
                setVehicles([]);
            }
        };

        fetchVehicles();

        if (isEditMode && id) {
            fetchMMRReport(Number(id));
        }
    }, [id, isEditMode]);

    const fetchMMRReport = async (reportId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await mmrReportService.getById(reportId);
            const data = response.data as { status: boolean; mmrReport?: MMRReport };

            if (data.status && data.mmrReport) {
                const report = data.mmrReport;
                const dateValue = report.date ? new Date(report.date).toISOString().split('T')[0].substring(0, 7) : "";
                const completedDateValue = report.completed_date ? new Date(report.completed_date).toISOString().split('T')[0] : "";

                setFormData({
                    date: dateValue,
                    domicile_station: report.domicile_station || "",
                    provider_company_name: report.provider_company_name || "",
                    current_mileage: report.current_mileage || "",
                    vehicle_id: report.vehicle_id?.toString() || "",
                    preventative_maintenance: report.preventative_maintenance ?? null,
                    out_of_service: report.out_of_service ?? null,
                    signature: report.signature || "",
                    declaration: report.declaration ?? null,
                    completed_date: completedDateValue,
                    maintenance_records: Array.isArray(report.maintenance_records) ? report.maintenance_records : [],
                });
            } else {
                setGeneralError("MMR report not found");
            }
        } catch {
            setGeneralError("Failed to load MMR report");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.outline = "none";
        e.target.style.boxShadow = "none";
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.backgroundColor = "#f1f4ff";
    };

    const handleTasksChange = useCallback((tasks: MaintenanceRecord[]) => {
        setFormData((prevFormData) => ({ ...prevFormData, maintenance_records: tasks }));
    }, []);

    const handleVehicleChange = async (vehicleId: string) => {
        setFormData({ ...formData, vehicle_id: vehicleId });

        if (vehicleId) {
            const selectedVehicleData = vehicles.find((v) => v.id === Number(vehicleId));

            if (selectedVehicleData?.current_mileage) {
                setFormData({ ...formData, vehicle_id: vehicleId, current_mileage: String(selectedVehicleData.current_mileage) });
            } else {
                try {
                    const response = await vehicleService.getById(Number(vehicleId));
                    const vehicleData = response.data as { status: boolean; vehicle?: Vehicle };

                    if (vehicleData.status && vehicleData.vehicle?.current_mileage) {
                        setFormData({ ...formData, vehicle_id: vehicleId, current_mileage: String(vehicleData.vehicle.current_mileage) });
                    } else {
                        setFormData({ ...formData, vehicle_id: vehicleId, current_mileage: "" });
                    }
                } catch {
                    setFormData({ ...formData, vehicle_id: vehicleId, current_mileage: "" });
                }
            }
        } else {
            setFormData({ ...formData, vehicle_id: "", current_mileage: "" });
        }
    };

    const handleInputChange = (field: string, value: string | boolean | null) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (!formData.vehicle_id) {
            newErrors.vehicle_id = "Vehicle is required";
        }

        if (!formData.domicile_station || formData.domicile_station.trim() === "") {
            newErrors.domicile_station = "Domicile Station/Hub is required";
        }

        if (!formData.provider_company_name || formData.provider_company_name.trim() === "") {
            newErrors.provider_company_name = "Service Provider Company Name is required";
        }

        if (!formData.completed_date) {
            newErrors.completed_date = "Date Completed is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const messageEl = document.getElementById('mmr-container');
        if (messageEl) {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => scrollToTop(), 100);
        setGeneralError("");
        setSuccessMessage("");
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                date: formData.date,
                domicile_station: formData.domicile_station,
                provider_company_name: formData.provider_company_name,
                current_mileage: formData.current_mileage || undefined,
                vehicle_id: Number(formData.vehicle_id),
                preventative_maintenance: formData.preventative_maintenance ?? undefined,
                out_of_service: formData.out_of_service ?? undefined,
                signature: formData.signature || undefined,
                declaration: formData.declaration ?? undefined,
                completed_date: formData.completed_date,
                maintenance_records: formData.maintenance_records.length > 0 ? formData.maintenance_records : undefined,
            };

            let response;
            if (isEditMode && id) {
                response = await mmrReportService.update(Number(id), submitData);
            } else {
                response = await mmrReportService.create(submitData);
            }

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                setSuccessMessage(isEditMode ? "MMR report updated successfully!" : "MMR report saved successfully!");

                if (!isEditMode) {
                    setFormData({
                        date: "",
                        domicile_station: "",
                        provider_company_name: "",
                        current_mileage: "",
                        vehicle_id: "",
                        preventative_maintenance: null,
                        out_of_service: null,
                        signature: "",
                        declaration: null,
                        completed_date: "",
                        maintenance_records: [],
                    });
                } else {
                    setTimeout(() => {
                        navigate('/reports/mmr');
                    }, 1500);
                }
            } else {
                setGeneralError(response.data?.message || (isEditMode ? "Failed to update MMR report. Please try again." : "Failed to save MMR report. Please try again."));
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
                        "An error occurred while saving the MMR report. Please try again."
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadMMRReport = async (id: number) => {
        setIsDownloading(true);
        setGeneralError('');
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setGeneralError('Authentication token not found. Please login again.');
                setIsDownloading(false);
                return;
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${API_URL}/mmr-reports/${id}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setGeneralError('Authentication failed. Please login again.');
                } else if (response.status === 404) {
                    setGeneralError('MMR report not found.');
                } else {
                    setGeneralError('Failed to download MMR report.');
                }
                setIsDownloading(false);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `MMR_Report_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch {
            setGeneralError('An error occurred while downloading the MMR report.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Add this helper function at the top of your component, after imports
    const formatMonthYear = (dateString: string): string => {
        if (!dateString) return "";
        const [year, month] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[date.getMonth()]} ${year}`;
    };

    return (
        <>
            <PageMeta
                title="Monthly Maintenance Reports (MMR)"
                description="View and generate monthly maintenance reports"
            />

            <PageBreadcrumb pageTitle={[
                { name: "Monthly Maintenance Reports (MMR)", to: "/reports/mmr" },
                { name: isEditMode ? "Edit" : "Create", to: isEditMode ? `/reports/mmr/${id}` : "/reports/mmr/create" },
            ]} />


            <div className="space-y-6" id='mmr-container'>
                <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEditMode ? "Edit Monthly Maintenance Report (MMR)" : "Monthly Maintenance Reports (MMR)"}
                    </h2>
                    {isEditMode && <Button
                        variant="primary"
                        size="sm"
                        onClick={() => downloadMMRReport(Number(id))}
                        disabled={isSubmitting || isDownloading}
                    >
                        {isDownloading ? 'Downloading...' : 'Download MMR Report'}
                    </Button>}
                </div>

                <div className="w-full max-w-5xl mx-auto border border-gray-200 rounded-xl p-6">
                    {(generalError || successMessage) && (
                        <div className={`mb-4 p-4 rounded-lg ${generalError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                            {generalError || successMessage}
                        </div>
                    )}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Loading MMR report...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div id="mmr-form-container" style={{ width: "100%", fontFamily: "Arial, sans-serif" }}>
                            <form onSubmit={handleSubmit}>
                                <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto" }} cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "20px", textAlign: "center" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ textAlign: "center", backgroundColor: "#e1e1e1", color: "#000", fontSize: "18px", fontWeight: "bold", paddingBottom: "10px", paddingTop: "10px", border: "2px solid #000" }}>
                                                                U.S. Monthly Maintenance Record, MGBA-355
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ textAlign: "right", fontSize: "14px", paddingTop: "10px", width: "150px", fontWeight: "bold", paddingLeft: "10px" }}>
                                                                {formatDate(formData.date || "")}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ padding: "0 20px 15px 20px", fontSize: "14px", lineHeight: "1.5", textAlign: "justify" }}>
                                                To comply with U.S. Federal Regulations, this form must be completed, signed, and submitted to FedEx by the 20th of the month following the month for which repairs, or maintenance were performed on any service provider-owned or -leased equipment. Submit one record for each piece of equipment, even if not regularly providing services.
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ padding: "0 20px" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>
                                                                    Maintenance Record for the Month and Year of:
                                                                </span>
                                                                <div className="monthly-date-picker">
                                                                    <DatePicker
                                                                        id="mmr-month-year-picker"
                                                                        mode="month"
                                                                        defaultDate={formData.date}
                                                                        onChange={(selectedDates) => {
                                                                            if (selectedDates && selectedDates.length > 0) {
                                                                                const date = selectedDates[0];
                                                                                const year = date.getFullYear();
                                                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                                                const formattedDate = `${year}-${month}`;
                                                                                handleInputChange("date", formattedDate);
                                                                            }
                                                                        }}
                                                                        placeholder="Select month and year"
                                                                        error={!!errors.date}
                                                                    />
                                                                </div>
                                                                {errors.date && (
                                                                    <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>
                                                                        {errors.date}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Domicile Station/Hub: <span style={{ color: "#f00" }}>*</span></span>
                                                                <input
                                                                    type="text"
                                                                    value={formData.domicile_station}
                                                                    onChange={(e) => handleInputChange("domicile_station", e.target.value)}
                                                                    style={{ width: "100%", backgroundColor: errors.domicile_station ? "#fee" : "#f1f4ff", border: errors.domicile_station ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }}
                                                                    onFocus={handleInputFocus}
                                                                    onBlur={handleInputBlur}
                                                                    autoComplete="off"
                                                                />
                                                                {errors.domicile_station && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.domicile_station}</div>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Service Provider Company Name: <span style={{ color: "#f00" }}>*</span></span>
                                                                <input
                                                                    type="text"
                                                                    value={formData.provider_company_name}
                                                                    onChange={(e) => handleInputChange("provider_company_name", e.target.value)}
                                                                    style={{ width: "100%", backgroundColor: errors.provider_company_name ? "#fee" : "#f1f4ff", border: errors.provider_company_name ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }}
                                                                    onFocus={handleInputFocus}
                                                                    onBlur={handleInputBlur}
                                                                    autoComplete="off"
                                                                />
                                                                {errors.provider_company_name && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.provider_company_name}</div>}
                                                            </td>
                                                            <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Current Mileage* (Odometer Reading)</span>
                                                                <input
                                                                    type="text"
                                                                    value={formData.current_mileage}
                                                                    onChange={(e) => handleInputChange("current_mileage", e.target.value)}
                                                                    style={{ width: "100%", backgroundColor: errors.current_mileage ? "#fee" : "#f1f4ff", border: errors.current_mileage ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }}
                                                                    onFocus={handleInputFocus}
                                                                    onBlur={handleInputBlur}
                                                                    autoComplete="off"
                                                                />
                                                                {errors.current_mileage && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.current_mileage}</div>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Vehicle Unit #:</span>
                                                                <select
                                                                    value={formData.vehicle_id}
                                                                    onChange={(e) => handleVehicleChange(e.target.value)}
                                                                    style={{ width: "100%", backgroundColor: errors.vehicle_id ? "#fee" : "#f1f4ff", border: errors.vehicle_id ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }}
                                                                    onFocus={handleInputFocus}
                                                                    onBlur={handleInputBlur}
                                                                >
                                                                    <option value="">Select Vehicle</option>
                                                                    {vehicles.map((vehicle) => (
                                                                        <option key={vehicle.id} value={vehicle.id}>
                                                                            {vehicle.vehicle_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.vehicle_id && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.vehicle_id}</div>}
                                                            </td>
                                                            <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                                                                <p>*If reading has decreased due to odometer repair/replacement, proof
                                                                    should also be provided. If unit is undergoing repair and unavailable,
                                                                    “N/A” may be utilized for current mileage.</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ padding: "15px 20px" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', padding: "8px 5px", verticalAlign: "top", width: "70%" }}>
                                                                Were any repairs, or preventative maintenance performed on this unit?
                                                            </td>
                                                            <td style={{ padding: "8px 5px", verticalAlign: "top", width: "30%" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ padding: "0 10px 0 0", fontSize: "12px" }}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="preventative_maintenance"
                                                                                    checked={formData.preventative_maintenance === true}
                                                                                    onChange={() => handleInputChange("preventative_maintenance", true)}
                                                                                    style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }}
                                                                                />
                                                                                Yes
                                                                            </td>
                                                                            <td style={{ padding: "0", fontSize: "12px" }}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="preventative_maintenance"
                                                                                    checked={formData.preventative_maintenance === false}
                                                                                    onChange={() => handleInputChange("preventative_maintenance", false)}
                                                                                    style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }}
                                                                                />
                                                                                No
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', padding: "8px 5px", verticalAlign: "top" }}>
                                                                If "no" maintenance was performed, was the unit out of service and unable to provide service (i.e., awaiting repair, on litigation hold, etc.)?
                                                            </td>
                                                            <td style={{ padding: "8px 5px", verticalAlign: "top" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ padding: "0 10px 0 0", fontSize: "12px" }}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="out_of_service"
                                                                                    checked={formData.out_of_service === true}
                                                                                    onChange={() => handleInputChange("out_of_service", true)}
                                                                                    style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }}
                                                                                />
                                                                                Yes
                                                                            </td>
                                                                            <td style={{ padding: "0", fontSize: "12px" }}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="out_of_service"
                                                                                    checked={formData.out_of_service === false}
                                                                                    onChange={() => handleInputChange("out_of_service", false)}
                                                                                    style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }}
                                                                                />
                                                                                No
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

                                        <tr>
                                            <td style={{ padding: "15px 20px", fontSize: "11px", lineHeight: "1.6" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                                                                All repairs/replacements, or maintenance performed in conformance with a vehicle's Maintenance Interval Form or any other major vehicle system must be reported on an MMR with detailed notations or attached receipts.
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                                                                All notations must provide enough detail for a DOT official to determine what component(s), location(s), and type of work was performed (e.g., replace, repair, adjust, etc.).
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                                                                Annual Federal/State and Pre/Post trip inspections must not be reported on the MMR, however repairs and maintenance of components that resulted from these inspections must be reported on an MMR.
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                                                                General maintenance (e.g., oil/filter changes, lubrication, adjustments) should be reported with adequate detail to clearly convey what components were repaired or maintained. Abbreviations such as "LOF" or "PM" cannot be used, as these do not provide adequate details.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ padding: "15px 20px" }}>
                                                <MMRTaskList
                                                    handleInputFocus={handleInputFocus}
                                                    handleInputBlur={handleInputBlur}
                                                    vehicleId={formData.vehicle_id}
                                                    date={formData.date}
                                                    onTasksChange={handleTasksChange}
                                                    initialTasks={formData.maintenance_records}
                                                />
                                            </td>
                                        </tr>


                                        <tr>
                                            <td style={{ padding: "20px" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: "11px", lineHeight: "1.6", textAlign: "justify", paddingBottom: "15px" }}>
                                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ width: "30px", verticalAlign: "top", paddingTop: "3px" }}>
                                                                                <input type="checkbox" checked={formData.declaration === true} onChange={() => handleInputChange("declaration", !formData.declaration)} style={{ width: "23px", height: "23px", verticalAlign: "top", accentColor: '#f1f4ff' }} />
                                                                            </td>
                                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', textAlign: "justify" }}>
                                                                                By checking this box, I declare that this record is true and correct. Unless otherwise clearly indicated as "out of service" on this record, I confirm that the equipment on this record is in compliance with the Federal Motor Carrier Safety Regulations 49 C.F.R. 396.3(a)(1) and 396.7 (a) and is in safe operating condition and meets all federal, state and local motor vehicle laws. Furthermore, I confirm that preventative maintenance is consistent with the interval schedule per 396.3(b)(2).
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "50%" }}>
                                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Signature of Authorized Officer or Business Contact:</span>
                                                                                <input
                                                                                    type="text"
                                                                                    value={formData.signature}
                                                                                    onChange={(e) => handleInputChange("signature", e.target.value)}
                                                                                    style={{ width: "100%", border: errors.signature ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: 'none', backgroundColor: errors.signature ? '#fee' : '#f1f4ff' }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                    autoComplete="off"
                                                                                />
                                                                                {errors.signature && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.signature}</div>}
                                                                            </td>
                                                                            <td style={{ fontSize: "12px", padding: "8px 8px 8px 20px", verticalAlign: "top", width: "50%" }}>
                                                                                <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Date Completed: <span style={{ color: "#f00" }}>*</span></span>
                                                                                <input
                                                                                    type="date"
                                                                                    value={formData.completed_date}
                                                                                    onChange={(e) => handleInputChange("completed_date", e.target.value)}
                                                                                    style={{ width: "100%", border: errors.completed_date ? "1px solid #f00" : "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: 'none', backgroundColor: errors.completed_date ? '#fee' : '#f1f4ff' }}
                                                                                    onFocus={handleInputFocus}
                                                                                    onBlur={handleInputBlur}
                                                                                    autoComplete="off"
                                                                                />
                                                                                {errors.completed_date && <div style={{ color: "#f00", fontSize: "11px", paddingTop: "2px" }}>{errors.completed_date}</div>}
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

                                        <tr>
                                            <td style={{ padding: "20px 20px 10px 20px", fontSize: "10px", lineHeight: "1.5", borderTop: "1px solid #ccc" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: "14px", lineHeight: '1.5', padding: "8px 0 21px 0", textAlign: "justify", fontStyle: 'italic' }}>
                                                                * The Monthly Maintenance Record (MMR) is FedEx's systematic method of obtaining vehicle maintenance records for service provider-owned vehicles in compliance with the Federal Motor Carrier Safety Regulations which require motor carriers to have a systematic method of causing vehicles operating under their motor carrier operating authority to be repaired and maintained. Therefore, if FedEx does not receive records for a vehicle by the 20th of the month following the month in which maintenance or repairs, were performed, packages will not be made available to this vehicle.
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ borderTop: "1px solid #000", padding: "5px", fontSize: "13px", lineHeight: '1.5', paddingBottom: "5px", }}>
                                                                This form for service providers is accessed through mybizaccount.fedex.com
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style={{ padding: "20px", textAlign: "right" }}>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isSubmitting || !formData.declaration}
                                        variant="primary"
                                    >
                                        {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update MMR Report" : "Save MMR Report")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/reports/mmr")}
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



