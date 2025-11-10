import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDropzone } from "react-dropzone";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import { EyeIcon, EyeCloseIcon, FileIcon, DocsIcon, UserCircleIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { driverService } from "../../services/driverService";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { key: "details", label: "Details", icon: <DocsIcon className="w-5 h-5" /> },
  { key: "license", label: "License", icon: <FileIcon className="w-5 h-5" /> },
  { key: "immigration", label: "Immigration", icon: <FileIcon className="w-5 h-5" /> },
  { key: "employment", label: "Employment", icon: <FileIcon className="w-5 h-5" /> },
  { key: "emergency", label: "Emergency Contact", icon: <FileIcon className="w-5 h-5" /> },
  { key: "settings", label: "Settings", icon: <FileIcon className="w-5 h-5" /> },
];

export default function CreateDriver() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [activeSection, setActiveSection] = useState("profile-picture");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
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
    emergency_contact_name: "",
    emergency_contact_no: "",
    emergency_contact_address: "",
    password: "",
    designation: "",
    status: "Active",
    immigration_status: "Other",
    comment: "",
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

  const onDropProfilePicture = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      handleInputChange("profile_picture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDropLicenseFile = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleInputChange("license_no_file", acceptedFiles[0]);
    }
  };

  const onDropOfferLetter = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleInputChange("offer_letter_file", acceptedFiles[0]);
    }
  };

  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
    isDragActive: isProfileDragActive,
  } = useDropzone({
    onDrop: onDropProfilePicture,
    accept: { "image/*": [] },
    multiple: false,
  });

  const {
    getRootProps: getLicenseRootProps,
    getInputProps: getLicenseInputProps,
    isDragActive: isLicenseDragActive,
  } = useDropzone({
    onDrop: onDropLicenseFile,
    accept: { "application/pdf": [], "image/*": [] },
    multiple: false,
  });

  const {
    getRootProps: getOfferLetterRootProps,
    getInputProps: getOfferLetterInputProps,
    isDragActive: isOfferLetterDragActive,
  } = useDropzone({
    onDrop: onDropOfferLetter,
    accept: { "application/pdf": [], "image/*": [] },
    multiple: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchDriverData(parseInt(id));
    }
  }, [isEditMode, id]);

  const fetchDriverData = async (driverId: number) => {
    setIsLoading(true);
    setGeneralError("");
    try {
      const response = await driverService.getForEdit(driverId);
      const data = response.data as { status: boolean; data?: Record<string, unknown> };
      
      if (data.status && data.data) {
        const driver = data.data;
        setFormData({
          profile_picture: null,
          first_name: String(driver.first_name || ""),
          last_name: String(driver.last_name || ""),
          gender: String(driver.gender || "male"),
          dob: String(driver.dob || ""),
          sin_no: String(driver.sin_no || ""),
          phone: String(driver.phone || ""),
          email: String(driver.email || ""),
          address: String(driver.user.address || ""),
          country: String(driver.user.country || ""),
          state: String(driver.user.state || ""),
          city: String(driver.user.city || ""),
          zip: String(driver.user.zip || ""),
          license_no: String(driver.license_no || ""),
          license_no_file: null,
          license_class: String(driver.license_class || "Class 1"),
          license_issue_country: String(driver.license_issue_country || ""),
          license_issue_state: String(driver.license_issue_state || ""),
          license_issue_date: String(driver.license_issue_date || ""),
          license_expire_date: String(driver.license_expire_date || ""),
          status_in_country: String(driver.status_in_country || ""),
          doc_expiry_date: String(driver.doc_expiry_date || ""),
          job_join_date: String(driver.job_join_date || ""),
          offer_letter_file: null,
          job_leave_date: String(driver.job_leave_date || ""),
          emergency_contact_name: String(driver.emergency_contact_name || ""),
          emergency_contact_no: String(driver.emergency_contact_no || ""),
          emergency_contact_address: String(driver.emergency_contact_address || ""),
          password: "",
          designation: String(driver.designation || ""),
          status: String(driver.status || "Active"),
          immigration_status: String(driver.immigration_status || "Other"),
          comment: String(driver.comment || ""),
        });

        if (driver?.user?.profile_picture && typeof driver.user?.profile_picture === 'string') {
          setProfilePicturePreview(driver?.user?.profile_picture as string);
        }

      }
    } catch {
      setGeneralError("Failed to load driver data. Please try again.");
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

    if (!isEditMode) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.license_no.trim()) {
      newErrors.license_no = "License number is required";
    } else if (formData.license_no.length < 10) {
      newErrors.license_no = "License number must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    if (!validateForm()) {
      setActiveSection("details");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseDriverData = {
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
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_no: formData.emergency_contact_no || undefined,
        emergency_contact_address: formData.emergency_contact_address || undefined,
        designation: formData.designation || undefined,
        status: formData.status as 'Active' | 'Inactive',
        immigration_status: formData.immigration_status as 'LMIA' | 'SINP' | 'Other',
        comment: formData.comment || undefined,
        profile_picture: formData.profile_picture,
      };

      const driverData = isEditMode && !formData.password.trim()
        ? baseDriverData
        : { ...baseDriverData, password: formData.password };

      const response = isEditMode && id
        ? await driverService.update(parseInt(id), driverData)
        : await driverService.create(driverData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        navigate("/drivers", { replace: true });
      } else {
        setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} driver. Please try again.`);
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

          const firstErrorField = Object.keys(validationErrors)[0];
          if (firstErrorField) {
            if (["first_name", "last_name", "gender", "dob", "sin_no", "phone", "email", "address", "country", "state", "city", "zip"].includes(firstErrorField)) {
              setActiveSection("details");
            } else if (["license_no", "license_no_file", "license_class", "license_issue_country", "license_issue_state", "license_issue_date", "license_expire_date"].includes(firstErrorField)) {
              setActiveSection("license");
            } else if (["status_in_country", "immigration_status", "doc_expiry_date"].includes(firstErrorField)) {
              setActiveSection("immigration");
            } else if (["job_join_date", "offer_letter_file", "job_leave_date", "designation"].includes(firstErrorField)) {
              setActiveSection("employment");
            } else if (["emergency_contact_name", "emergency_contact_no", "emergency_contact_address"].includes(firstErrorField)) {
              setActiveSection("emergency");
            } else if (["password", "status", "comment"].includes(firstErrorField)) {
              setActiveSection("settings");
            }
          }
        } else {
          setGeneralError(
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the driver. Please try again.`
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

  const renderProfilePictureSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        {profilePicturePreview ? (
          <div className="relative">
            <img
              src={profilePicturePreview}
              alt="Profile preview"
              className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg"
            />
            <button
              type="button"
              onClick={() => {
                setProfilePicturePreview(null);
                handleInputChange("profile_picture", null);
              }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error-500 text-white flex items-center justify-center hover:bg-error-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        ) : (
          <div
            {...getProfileRootProps()}
            className={`w-48 h-48 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition ${
              isProfileDragActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 hover:border-brand-400"
            }`}
          >
            <input {...getProfileInputProps()} />
            <div className="flex flex-col items-center px-4">
              <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {isProfileDragActive ? "Drop Image Here" : "Click or drag to upload"}
              </span>
            </div>
          </div>
        )}
      </div>

      {formData.profile_picture && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected: <span className="font-medium">{formData.profile_picture.name}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Size: {(formData.profile_picture.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
    </div>
  );

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
          />
        </div>
      </div>

      

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="phone">
            Phone <span className="text-error-500">*</span>
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className={errors.phone ? "border-error-500" : ""}
          />
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
        <Label>License File</Label>
        <div
          {...getLicenseRootProps()}
          className={`border border-dashed rounded-xl p-7 cursor-pointer transition ${
            isLicenseDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
        >
          <input {...getLicenseInputProps()} />
          <div className="flex flex-col items-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <FileIcon className="w-8 h-8" />
              </div>
            </div>
            <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
              {isLicenseDragActive ? "Drop File Here" : "Drag & Drop File Here"}
            </h4>
            <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your file here or browse
            </span>
            <span className="text-sm font-medium text-brand-500 underline">
              Browse File
            </span>
            {formData.license_no_file && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected: {formData.license_no_file.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          />
        </div>

        <div>
          <DatePicker
            id="license_expire_date"
            label="License Expiry Date"
            placeholder="Select expiry date"
            onChange={handleDateChange("license_expire_date")}
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
        />
      </div>
    </div>
  );

  const renderEmploymentSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <DatePicker
            id="job_join_date"
            label="Job Join Date"
            placeholder="Select join date"
            onChange={handleDateChange("job_join_date")}
          />
        </div>

        <div>
          <DatePicker
            id="job_leave_date"
            label="Job Leave Date"
            placeholder="Select leave date"
            onChange={handleDateChange("job_leave_date")}
          />
        </div>
      </div>

      <div>
        <Label>Offer Letter File</Label>
        <div
          {...getOfferLetterRootProps()}
          className={`border border-dashed rounded-xl p-7 cursor-pointer transition ${
            isOfferLetterDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
        >
          <input {...getOfferLetterInputProps()} />
          <div className="flex flex-col items-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <FileIcon className="w-8 h-8" />
              </div>
            </div>
            <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
              {isOfferLetterDragActive ? "Drop File Here" : "Drag & Drop File Here"}
            </h4>
            <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your file here or browse
            </span>
            <span className="text-sm font-medium text-brand-500 underline">
              Browse File
            </span>
            {formData.offer_letter_file && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected: {formData.offer_letter_file.name}
              </p>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );

  const renderEmergencySection = () => (
    <div className="space-y-6">
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

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="password">
          Password {!isEditMode && <span className="text-error-500">*</span>}
          {isEditMode && <span className="text-gray-500 text-xs ml-2">(Leave empty to keep current password)</span>}
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter password"
            className={errors.password ? "border-error-500" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            ) : (
              <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error-500">{errors.password}</p>
        )}
      </div>

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

  const getSectionErrors = (sectionKey: string): boolean => {
    const sectionFieldsMap: Record<string, string[]> = {
      details: ["first_name", "last_name", "gender", "dob", "sin_no", "phone", "email", "address", "country", "state", "city", "zip"],
      license: ["license_no", "license_no_file", "license_class", "license_issue_country", "license_issue_state", "license_issue_date", "license_expire_date"],
      immigration: ["status_in_country", "immigration_status", "doc_expiry_date"],
      employment: ["job_join_date", "offer_letter_file", "job_leave_date", "designation"],
      emergency: ["emergency_contact_name", "emergency_contact_no", "emergency_contact_address"],
      settings: ["password", "status", "comment"],
    };

    const fields = sectionFieldsMap[sectionKey] || [];
    return fields.some((field) => errors[field]);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "details":
        return renderDetailsSection();
      case "license":
        return renderLicenseSection();
      case "immigration":
        return renderImmigrationSection();
      case "employment":
        return renderEmploymentSection();
      case "emergency":
        return renderEmergencySection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderDetailsSection();
    }
  };

  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Driver" : "Create Driver"}
        description={isEditMode ? "Edit driver profile" : "Create a new driver profile"}
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Edit Driver" : "Create Driver"} />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 shrink-0">
            
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-2">
                {renderProfilePictureSection()}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const hasError = getSectionErrors(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative ${
                        activeSection === item.key
                          ? hasError
                            ? "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400 border-l-4 border-error-500"
                            : "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 border-l-4 border-brand-500"
                          : hasError
                          ? "text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/10 border-l-4 border-error-500"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {hasError && (
                        <span className="w-2 h-2 bg-error-500 rounded-full shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading driver data...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {generalError && (
                  <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <p className="text-sm text-error-600 dark:text-error-400">{generalError}</p>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                {sidebarItems.find((item) => item.key === activeSection)?.label}
              </h2>
              {renderSectionContent()}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/drivers")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-3 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
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
                  isEditMode ? "Update Driver" : "Save Driver"
                )}
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
