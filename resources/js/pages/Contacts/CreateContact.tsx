import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { contactService } from "../../services/contactService";

interface SidebarItem {
    key: string;
    label: string;
    content: React.ReactNode;
}

export default function CreateContact() {

    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [formData, setFormData] = useState({
        profile_picture: null as File | null,
        first_name: "",
        last_name: "",
        gender: "male",
        dob: "",
        sin_no: "",
        phone: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zip: "",
        license_no: "",
        license_no_file: null as File | null,
        license_class: "Class 1",
        license_issue_country: "",
        license_issue_state: "",
        license_issue_date: "",
        license_expire_date: "",
        status_in_country: "",
        doc_expiry_date: "",
        job_join_date: "",
        offer_letter_file: null as File | null,
        job_leave_date: "",
        job_title: "",
        employee_number: "",
        hourly_labor_rate: "",
        emergency_contact_name: "",
        emergency_contact_no: "",
        emergency_contact_address: "",
        password: "",
        designation: "",
        status: "Active",
        immigration_status: "Other",
        comment: "",
        is_operator: false,
        is_technician: false,
        is_employee: false,
    });

    const handleInputChange = (name: string, value: string | File | null) => {
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
    };

    const handleDateChange = (name: string) => (_dates: unknown, currentDateString: string) => {
        setFormData((prev) => ({ ...prev, [name]: currentDateString }));
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

    useEffect(() => {
        if (isEditMode && id) {
            fetchContactData(parseInt(id));
        }
    }, [isEditMode, id]);

    const fetchContactData = async (contactId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await contactService.getForEdit(contactId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const contact = data.data;
                setFormData({
                    profile_picture: null,
                    first_name: String(contact.first_name || ""),
                    last_name: String(contact.last_name || ""),
                    gender: String(contact.gender || "male"),
                    dob: String(contact.dob || ""),
                    sin_no: String(contact.sin_no || ""),
                    phone: String(contact.phone || ""),
                    email: String(contact.email || ""),
                    address: String((contact.user && typeof contact.user === "object" && "address" in contact.user) ? (contact.user as Record<string, unknown>).address || "" : ""),
                    country: String((contact.user && typeof contact.user === "object" && "country" in contact.user) ? (contact.user as Record<string, unknown>).country || "" : ""),
                    state: String((contact.user && typeof contact.user === "object" && "state" in contact.user) ? (contact.user as Record<string, unknown>).state || "" : ""),
                    city: String((contact.user && typeof contact.user === "object" && "city" in contact.user) ? (contact.user as Record<string, unknown>).city || "" : ""),
                    zip: String((contact.user && typeof contact.user === "object" && "zip" in contact.user) ? (contact.user as Record<string, unknown>).zip || "" : ""),
                    license_no: String(contact.license_no || ""),
                    license_no_file: null,
                    license_class: String(contact.license_class || "Class 1"),
                    license_issue_country: String(contact.license_issue_country || ""),
                    license_issue_state: String(contact.license_issue_state || ""),
                    license_issue_date: String(contact.license_issue_date || ""),
                    license_expire_date: String(contact.license_expire_date || ""),
                    status_in_country: String(contact.status_in_country || ""),
                    doc_expiry_date: String(contact.doc_expiry_date || ""),
                    job_join_date: String(contact.job_join_date || ""),
                    offer_letter_file: null,
                    job_leave_date: String(contact.job_leave_date || ""),
                    job_title: String(contact.job_title || ""),
                    employee_number: String(contact.employee_number || ""),
                    hourly_labor_rate: String(contact.hourly_labor_rate || ""),
                    emergency_contact_name: String(contact.emergency_contact_name || ""),
                    emergency_contact_no: String(contact.emergency_contact_no || ""),
                    emergency_contact_address: String(contact.emergency_contact_address || ""),
                    password: "",
                    designation: String(contact.designation || ""),
                    status: String(contact.status || "Active"),
                    immigration_status: String(contact.immigration_status || "Other"),
                    comment: String(contact.comment || ""),
                    is_operator: false,
                    is_technician: false,
                    is_employee: false,
                });

                if (contact.classification) {
                    const classifications = String(contact.classification).split(",").map((c: string) => c.trim());
                    setFormData((prev) => ({
                        ...prev,
                        is_operator: classifications.includes("Operator"),
                        is_technician: classifications.includes("Technician"),
                        is_employee: classifications.includes("Employee"),
                    }));
                }

            }
        } catch {
            setGeneralError("Failed to load contact data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // if (!isEditMode) {
        //   if (!formData.password.trim()) {
        //     newErrors.password = "Password is required";
        //   } else if (formData.password.length < 6) {
        //     newErrors.password = "Password must be at least 6 characters";
        //   }
        // } else if (formData.password.trim() && formData.password.length < 6) {
        //   newErrors.password = "Password must be at least 6 characters";
        // }

        if (!formData.license_no.trim()) {
            newErrors.license_no = "License number is required";
        } else if (formData.license_no.length < 10) {
            newErrors.license_no = "License number must be at least 10 characters";
        }
        console.log(newErrors);

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
            const baseContactData = {
                first_name: formData.first_name,
                last_name: formData.last_name || "",
                gender: formData.gender as 'male' | 'female' | undefined,
                dob: formData.dob || undefined,
                sin_no: formData.sin_no || undefined,
                phone: formData.phone,
                email: formData.email,
                address: formData.address || undefined,
                country: formData.country || undefined,
                state: formData.state || undefined,
                city: formData.city || undefined,
                zip: formData.zip || undefined,
                license_no: formData.license_no || undefined,
                license_no_file: formData.license_no_file,
                license_class: (formData.license_class as 'Class 1' | 'Class 5' | undefined) || undefined,
                license_issue_country: formData.license_issue_country || undefined,
                license_issue_state: formData.license_issue_state || undefined,
                license_issue_date: formData.license_issue_date || undefined,
                license_expire_date: formData.license_expire_date || undefined,
                status_in_country: (formData.status_in_country as 'study' | 'work' | 'permanent' | 'citizen' | undefined) || undefined,
                doc_expiry_date: formData.doc_expiry_date || undefined,
                job_join_date: formData.job_join_date || undefined,
                offer_letter_file: formData.offer_letter_file,
                job_leave_date: formData.job_leave_date || undefined,
                job_title: formData.job_title || undefined,
                employee_number: formData.employee_number || undefined,
                hourly_labor_rate: formData.hourly_labor_rate ? parseFloat(formData.hourly_labor_rate) : undefined,
                emergency_contact_name: formData.emergency_contact_name || undefined,
                emergency_contact_no: formData.emergency_contact_no || undefined,
                emergency_contact_address: formData.emergency_contact_address || undefined,
                designation: formData.designation || undefined,
                status: formData.status as 'Active' | 'Inactive',
                immigration_status: formData.immigration_status as 'LMIA' | 'SINP' | 'Other',
                comment: formData.comment || undefined,
                profile_picture: formData.profile_picture,
                classification: (() => {
                    const classifications: string[] = [];
                    if (formData.is_operator) classifications.push("Operator");
                    if (formData.is_technician) classifications.push("Technician");
                    if (formData.is_employee) classifications.push("Employee");
                    return classifications.length > 0 ? classifications.join(",") : undefined;
                })(),
            };

            const response = isEditMode && id
                ? await contactService.update(parseInt(id), baseContactData)
                : await contactService.create(baseContactData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                navigate("/contacts", { replace: true });
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} contact. Please try again.`);
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
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the contact. Please try again.`
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
    ];

    const licenseClassOptions = [
        { value: "Class 1", label: "Class 1" },
        { value: "Class 5", label: "Class 5" },
    ];

    const statusInCountryOptions = [
        { value: "study", label: "Study" },
        { value: "work", label: "Work" },
        { value: "permanent", label: "Permanent" },
        { value: "citizen", label: "Citizen" },
    ];

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    const immigrationStatusOptions = [
        { value: "LMIA", label: "LMIA" },
        { value: "SINP", label: "SINP" },
        { value: "Other", label: "Other" },
    ];


    const renderDetailsSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="first_name">
                        First Name <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        placeholder="Enter first name"
                        className={errors.first_name ? "border-error-500" : ""}
                    />
                    {errors.first_name && (
                        <p className="mt-1 text-sm text-error-500">{errors.first_name}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="last_name">
                        Last Name
                    </Label>
                    <Input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        placeholder="Enter last name"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                        options={genderOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("gender")}
                        defaultValue={formData.gender}
                    />
                </div>

                <div>
                    <DatePicker
                        id="dob"
                        label="Date of Birth"
                        placeholder="Select date of birth"
                        onChange={handleDateChange("dob")}
                        defaultDate={formData.dob || undefined}
                    />
                </div>
            </div>



            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="phone">
                        Phone <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        maxLength={12}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // digits only
                            if (value.length <= 12) {
                                handleInputChange("phone", value);
                            }
                        }}
                        placeholder="Enter phone number"
                        className={errors.phone ? "border-error-500" : ""}
                    />

                    {/* <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number"
                        className={errors.phone ? "border-error-500" : ""}
                    /> */}
                    {errors.phone && (
                        <p className="mt-1 text-sm text-error-500">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="email">
                        Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        className={errors.email ? "border-error-500" : ""}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-error-500">{errors.email}</p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="sin_no">SIN Number</Label>
                <Input
                    type="text"
                    id="sin_no"
                    name="sin_no"
                    value={formData.sin_no}
                    onChange={(e) => handleInputChange("sin_no", e.target.value)}
                    placeholder="Enter SIN number"
                />
            </div>

            <div>
                <Label htmlFor="address">Address</Label>
                <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter address"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Enter country"
                    />
                </div>

                <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Enter state/province"
                    />
                </div>

                <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter city"
                    />
                </div>

                <div>
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={(e) => handleInputChange("zip", e.target.value)}
                        placeholder="Enter ZIP code"
                    />
                </div>
            </div>
        </div>
    );

    const renderLicenseSection = () => (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                    <Label htmlFor="license_no">License Number <span className="text-error-500">*</span></Label>
                    <Input
                        type="text"
                        id="license_no"
                        name="license_no"
                        value={formData.license_no}
                        onChange={(e) => handleInputChange("license_no", e.target.value)}
                        placeholder="Enter license number"
                        className={errors.license_no ? "border-error-500" : ""}
                    />
                    {errors.license_no && (
                        <p className="mt-1 text-sm text-error-500">{errors.license_no}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="license_class">
                        License Class <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={licenseClassOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("license_class")}
                        defaultValue={formData.license_class}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="license_issue_country">License Issue Country</Label>
                    <Input
                        type="text"
                        id="license_issue_country"
                        name="license_issue_country"
                        value={formData.license_issue_country}
                        onChange={(e) => handleInputChange("license_issue_country", e.target.value)}
                        placeholder="Enter country"
                    />
                </div>

                <div>
                    <Label htmlFor="license_issue_state">License Issue State/Province</Label>
                    <Input
                        type="text"
                        id="license_issue_state"
                        name="license_issue_state"
                        value={formData.license_issue_state}
                        onChange={(e) => handleInputChange("license_issue_state", e.target.value)}
                        placeholder="Enter state/province"

                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <DatePicker
                        id="license_issue_date"
                        label="License Issue Date"
                        placeholder="Select issue date"
                        onChange={handleDateChange("license_issue_date")}
                        defaultDate={formData.license_issue_date || undefined}
                    />
                </div>

                <div>
                    <DatePicker
                        id="license_expire_date"
                        label="License Expiry Date"
                        placeholder="Select expiry date"
                        onChange={handleDateChange("license_expire_date")}
                        defaultDate={formData.license_expire_date || undefined}
                    />
                </div>
            </div>
        </div>
    );

    const renderImmigrationSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="status_in_country">Status in Country</Label>
                    <Select
                        options={statusInCountryOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("status_in_country")}
                        defaultValue={formData.status_in_country}
                    />
                </div>

                <div>
                    <Label htmlFor="immigration_status">Immigration Status</Label>
                    <Select
                        options={immigrationStatusOptions}
                        placeholder="Please select"
                        onChange={handleSelectChange("immigration_status")}
                        defaultValue={formData.immigration_status}
                    />
                </div>
            </div>

            <div>
                <DatePicker
                    id="doc_expiry_date"
                    label="Document Expiry Date"
                    placeholder="Select expiry date"
                    onChange={handleDateChange("doc_expiry_date")}
                    defaultDate={formData.doc_expiry_date || undefined} />
            </div>
        </div>
    );

    const renderEmploymentSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange("job_title", e.target.value)}
                        placeholder="Enter job title"
                    />
                </div>

                <div>
                    <Label htmlFor="employee_number">Employee Number</Label>
                    <Input
                        type="text"
                        id="employee_number"
                        name="employee_number"
                        value={formData.employee_number}
                        onChange={(e) => handleInputChange("employee_number", e.target.value)}
                        placeholder="Enter employee number"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <DatePicker
                        id="job_join_date"
                        label="Job Join Date"
                        placeholder="Select join date"
                        onChange={handleDateChange("job_join_date")}
                        defaultDate={formData.job_join_date || undefined}
                    />
                </div>

                <div>
                    <DatePicker
                        id="job_leave_date"
                        label="Job Leave Date"
                        placeholder="Select leave date"
                        onChange={handleDateChange("job_leave_date")}
                        defaultDate={formData.job_leave_date || undefined}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                        type="text"
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        placeholder="Enter designation"
                    />
                </div>

                <div>
                    <Label htmlFor="hourly_labor_rate">Hourly Labor Rate</Label>
                    <Input
                        type="number"
                        id="hourly_labor_rate"
                        name="hourly_labor_rate"
                        value={formData.hourly_labor_rate}
                        onChange={(e) => handleInputChange("hourly_labor_rate", e.target.value)}
                        placeholder="Enter hourly labor rate"
                    />
                </div>
            </div>
        </div>
    );

    const renderEmergencySection = () => (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                        type="text"
                        id="emergency_contact_name"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                        placeholder="Enter emergency contact name"
                    />
                </div>

                <div>
                    <Label htmlFor="emergency_contact_no">Emergency Contact Number</Label>
                    <Input
                        type="tel"
                        id="emergency_contact_no"
                        name="emergency_contact_no"
                        value={formData.emergency_contact_no}
                        onChange={(e) => handleInputChange("emergency_contact_no", e.target.value)}
                        placeholder="Enter emergency contact number"
                    />
                </div>

            </div>


            <div>
                <Label htmlFor="emergency_contact_address">Emergency Contact Address</Label>
                <TextArea
                    rows={4}
                    value={formData.emergency_contact_address}
                    onChange={(value) => handleInputChange("emergency_contact_address", value)}
                    placeholder="Enter emergency contact address"
                />
            </div>
        </div>
    );

    const renderClassificationsSection = () => (
        <div className="space-y-6">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="is_operator"
                                checked={formData.is_operator}
                                onChange={handleCheckboxChange("is_operator")}
                            />
                            <div className="flex-1">
                                <label
                                    htmlFor="is_operator"
                                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                                >
                                    Operator
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Allow this Contact to be assigned to assets
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="is_technician"
                                checked={formData.is_technician}
                                onChange={handleCheckboxChange("is_technician")}
                            />
                            <div className="flex-1">
                                <label
                                    htmlFor="is_technician"
                                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                                >
                                    Technician
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Allow this Contact to be selected in labor line items on work orders
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="is_employee"
                                checked={formData.is_employee}
                                onChange={handleCheckboxChange("is_employee")}
                            />
                            <div className="flex-1">
                                <label
                                    htmlFor="is_employee"
                                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                                >
                                    Employee
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Current or former employee, for identification purposes only
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSettingsSection = () => (
        <div className="space-y-6">

            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    options={statusOptions}
                    placeholder="Please select"
                    onChange={handleSelectChange("status")}
                    defaultValue={formData.status}
                />
            </div>

            <div>
                <Label htmlFor="comment">Comments</Label>
                <TextArea
                    rows={4}
                    value={formData.comment}
                    onChange={(value) => handleInputChange("comment", value)}
                    placeholder="Enter any additional comments"
                />
            </div>
        </div>
    );

    const sidebarItems: SidebarItem[] = [
        { key: "details", label: "Basic Details", content: renderDetailsSection() },
        { key: "classifications", label: "Classifications", content: renderClassificationsSection() },
        { key: "license", label: "License", content: renderLicenseSection() },
        { key: "immigration", label: "Immigration", content: renderImmigrationSection() },
        { key: "employment", label: "Employment", content: renderEmploymentSection() },
        { key: "emergency", label: "Emergency Contact", content: renderEmergencySection() },
        { key: "settings", label: "Settings", content: renderSettingsSection() },
    ];

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Contact" : "Create Contact"}
                description={isEditMode ? "Edit contact profile" : "Create a new contact profile"}
            />
            <PageBreadcrumb pageTitle={isEditMode ? "Edit Contact" : "Create Contact"} />

            <div className="flex flex-col lg:flex-row gap-6 justify-center">
                <form onSubmit={handleSubmit}>

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
                                {generalError && (
                                    <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                                        <p className="text-sm text-error-600 dark:text-error-400">{generalError}</p>
                                    </div>
                                )}

                                {sidebarItems.map((item) => (
                                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                        <h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                                            {item.label}
                                        </h2>
                                        {item.content}
                                    </div>
                                ))}


                                <div className="mt-6 flex justify-end gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/contacts")}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        type="submit"
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
                                            isEditMode ? "Update Contact" : "Save Contact"
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
