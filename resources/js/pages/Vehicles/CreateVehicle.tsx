import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDropzone } from "react-dropzone";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { DocsIcon, SettingsIcon, PieChartIcon, IssuesIcon, ArrowRightIcon, PageIcon, LockIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { vehicleService } from "../../services/vehicleService";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { key: "details", label: "Details", icon: <DocsIcon className="w-5 h-5" /> },
  { key: "maintenance", label: "Maintenance", icon: <IssuesIcon className="w-5 h-5" /> },
  { key: "lifecycle", label: "Lifecycle", icon: <ArrowRightIcon className="w-5 h-5" /> },
  { key: "financial", label: "Financial", icon: <PieChartIcon className="w-5 h-5" /> },
  { key: "specifications", label: "Specifications", icon: <PageIcon className="w-5 h-5" /> },
  { key: "settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
];

export default function CreateVehicle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [activeSection, setActiveSection] = useState("details");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [formData, setFormData] = useState({
    vehicle_name: "",
    vin_sn: "",
    license_plate: "",
    type: "car",
    fuel_type: "gasoline",
    year: "",
    make: "",
    model: "",
    trim: "",
    registration_state_province: "",
    labels: "",
    photo: null as File | null,
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

  const onDropPhoto = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      handleInputChange("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    getRootProps: getPhotoRootProps,
    getInputProps: getPhotoInputProps,
    isDragActive: isPhotoDragActive,
  } = useDropzone({
    onDrop: onDropPhoto,
    accept: { "image/*": [] },
    multiple: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchVehicleData(parseInt(id));
    }
  }, [isEditMode, id]);

  const fetchVehicleData = async (vehicleId: number) => {
    setIsLoading(true);
    setGeneralError("");
    try {
      const response = await vehicleService.getForEdit(vehicleId);
      const data = response.data as { status: boolean; data?: Record<string, unknown> };
      
      if (data.status && data.data) {
        const vehicle = data.data;
        setFormData({
          vehicle_name: String(vehicle.vehicle_name || ""),
          vin_sn: String(vehicle.vin_sn || ""),
          license_plate: String(vehicle.license_plate || ""),
          type: String(vehicle.type || "Car"),
          fuel_type: String(vehicle.fuel_type || ""),
          year: String(vehicle.year || ""),
          make: String(vehicle.make || ""),
          model: String(vehicle.model || ""),
          trim: String(vehicle.trim || ""),
          registration_state_province: String(vehicle.registration_state_province || ""),
          labels: String(vehicle.labels || ""),
          photo: null,
        });

        if (vehicle?.photo && typeof vehicle.photo === 'string') {
          setPhotoPreview(vehicle.photo as string);
        }
      }
    } catch {
      setGeneralError("Failed to load vehicle data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicle_name.trim()) {
      newErrors.vehicle_name = "Vehicle name is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
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
      const vehicleData = {
        vehicle_name: formData.vehicle_name,
        vin_sn: formData.vin_sn || undefined,
        license_plate: formData.license_plate || undefined,
        type: formData.type,
        fuel_type: formData.fuel_type || undefined,
        year: formData.year || undefined,
        make: formData.make || undefined,
        model: formData.model || undefined,
        trim: formData.trim || undefined,
        registration_state_province: formData.registration_state_province || undefined,
        labels: formData.labels || undefined,
        photo: formData.photo,
      };

      const response = isEditMode && id
        ? await vehicleService.update(parseInt(id), vehicleData)
        : await vehicleService.create(vehicleData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        navigate("/vehicles", { replace: true });
      } else {
        setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} vehicle. Please try again.`);
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
            if (["vehicle_name", "vin_sn", "license_plate", "type", "fuel_type", "year", "make", "model", "trim", "registration_state_province", "labels", "photo"].includes(firstErrorField)) {
              setActiveSection("details");
            }
          }
        } else {
          setGeneralError(
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the vehicle. Please try again.`
          );
        }
      } else {
        setGeneralError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "car", label: "Car" },
    { value: "bus", label: "Bus" },
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "suv", label: "SUV" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "tractor", label: "Tractor" },
    { value: "trailer", label: "Trailer" },
    { value: "other", label: "Other" },
  ];

  const fuelTypeOptions = [
    { value: "gasoline", label: "Gasoline" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
    { value: "cng", label: "CNG" },
    { value: "lpg", label: "LPG" },
  ];

  const renderDetailsSection = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="vehicle_name">
          Vehicle Name <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="vehicle_name"
          name="vehicle_name"
          value={formData.vehicle_name}
          onChange={(e) => handleInputChange("vehicle_name", e.target.value)}
          placeholder="Enter a nickname to distinguish this vehicle in Fleetio."
          className={errors.vehicle_name ? "border-error-500" : ""}
        />
        <div className="mt-1 flex items-center gap-1">
          <a href="#" className="text-sm text-brand-500 hover:underline">
            Learn More
          </a>
          <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        {errors.vehicle_name && (
          <p className="mt-1 text-sm text-error-500">{errors.vehicle_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="vin_sn">VIN/SN</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              id="vin_sn"
              name="vin_sn"
              value={formData.vin_sn}
              onChange={(e) => handleInputChange("vin_sn", e.target.value)}
              placeholder="Vehicle Identification Number or Serial Number."
              className={errors.vin_sn ? "border-error-500" : ""}
            />
          </div>
          <Button
            variant="outline"
            size="md"
            className="shrink-0"
            startIcon={<LockIcon className="w-4 h-4" />}
          >
            Decode VIN
          </Button>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <a href="#" className="text-sm text-brand-500 hover:underline">
            Learn More
          </a>
          <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        {errors.vin_sn && (
          <p className="mt-1 text-sm text-error-500">{errors.vin_sn}</p>
        )}
      </div>

      <div>
        <Label htmlFor="license_plate">License Plate</Label>
        <Input
          type="text"
          id="license_plate"
          name="license_plate"
          value={formData.license_plate}
          onChange={(e) => handleInputChange("license_plate", e.target.value)}
          placeholder="Enter license plate"
          className={errors.license_plate ? "border-error-500" : ""}
        />
        {errors.license_plate && (
          <p className="mt-1 text-sm text-error-500">{errors.license_plate}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="type">
            Type <span className="text-error-500">*</span>
          </Label>
          <Select
            options={typeOptions}
            placeholder="Categorize this vehicle"
            onChange={handleSelectChange("type")}
            defaultValue={formData.type}
            className={errors.type ? "border-error-500" : ""}
          />
          {errors.type && (
            <p className="mt-1 text-sm text-error-500">{errors.type}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select
            options={fuelTypeOptions}
            placeholder="Please select"
            onChange={handleSelectChange("fuel_type")}
            defaultValue={formData.fuel_type}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            placeholder="e.g. 1999, 2012, etc."
            className={errors.year ? "border-error-500" : ""}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-error-500">{errors.year}</p>
          )}
        </div>

        <div>
          <Label htmlFor="make">Make</Label>
          <Select
            options={[]}
            placeholder="Please select"
            onChange={handleSelectChange("make")}
            defaultValue={formData.make}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            e.g. Toyota, GMC, Chevrolet, etc.
          </p>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Select
            options={[]}
            placeholder="Please select"
            onChange={handleSelectChange("model")}
            defaultValue={formData.model}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            e.g. 4Runner, Yukon, Silverado, etc.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="trim">Trim</Label>
          <Input
            type="text"
            id="trim"
            name="trim"
            value={formData.trim}
            onChange={(e) => handleInputChange("trim", e.target.value)}
            placeholder="e.g. SE, LE, XLE, etc."
            className={errors.trim ? "border-error-500" : ""}
          />
          {errors.trim && (
            <p className="mt-1 text-sm text-error-500">{errors.trim}</p>
          )}
        </div>

        <div>
          <Label htmlFor="registration_state_province">Registration State/Province</Label>
          <Input
            type="text"
            id="registration_state_province"
            name="registration_state_province"
            value={formData.registration_state_province}
            onChange={(e) => handleInputChange("registration_state_province", e.target.value)}
            placeholder="Enter state/province"
            className={errors.registration_state_province ? "border-error-500" : ""}
          />
          {errors.registration_state_province && (
            <p className="mt-1 text-sm text-error-500">{errors.registration_state_province}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="labels">Labels</Label>
        <Select
          options={[]}
          placeholder="Please select"
          onChange={handleSelectChange("labels")}
          defaultValue={formData.labels}
        />
      </div>

      <div>
        <Label>Photo</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
            >
              Pick File
            </Button>
            <div {...getPhotoRootProps()} className="flex-1">
              <Button
                variant="outline"
                size="md"
                className="w-full"
              >
                Or drop file here
              </Button>
            </div>
          </div>
          <div
            className={`border border-dashed rounded-lg p-4 cursor-pointer transition ${
              isPhotoDragActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 hover:border-brand-400"
            }`}
            {...getPhotoRootProps()}
          >
            <input {...getPhotoInputProps()} />
            <div className="flex flex-col items-center justify-center py-4">
              {photoPreview ? (
                <div className="relative w-full max-w-xs">
                  <img
                    src={photoPreview}
                    alt="Vehicle preview"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoPreview(null);
                      handleInputChange("photo", null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error-500 text-white flex items-center justify-center hover:bg-error-600 transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <span className="text-sm leading-none">×</span>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {isPhotoDragActive ? "Drop Image Here" : "No file selected"}
                </p>
              )}
            </div>
          </div>
        </div>
        {formData.photo && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {formData.photo.name}
          </p>
        )}
      </div>
    </div>
  );

  const renderMaintenanceSection = () => (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">Maintenance section content will be added later.</p>
    </div>
  );

  const renderLifecycleSection = () => (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">Lifecycle section content will be added later.</p>
    </div>
  );

  const renderFinancialSection = () => (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">Financial section content will be added later.</p>
    </div>
  );

  const renderSpecificationsSection = () => (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">Specifications section content will be added later.</p>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">Settings section content will be added later.</p>
    </div>
  );

  const getSectionErrors = (sectionKey: string): boolean => {
    const sectionFieldsMap: Record<string, string[]> = {
      details: ["vehicle_name", "vin_sn", "license_plate", "type", "fuel_type", "year", "make", "model", "trim", "registration_state_province", "labels", "photo"],
      maintenance: [],
      lifecycle: [],
      financial: [],
      specifications: [],
      settings: [],
    };

    const fields = sectionFieldsMap[sectionKey] || [];
    return fields.some((field) => errors[field]);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "details":
        return renderDetailsSection();
      case "maintenance":
        return renderMaintenanceSection();
      case "lifecycle":
        return renderLifecycleSection();
      case "financial":
        return renderFinancialSection();
      case "specifications":
        return renderSpecificationsSection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderDetailsSection();
    }
  };

  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Vehicle" : "Create Vehicle"}
        description={isEditMode ? "Edit vehicle profile" : "Create a new vehicle profile"}
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Edit Vehicle" : "Create Vehicle"} />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 shrink-0">
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
                    Loading vehicle data...
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
                    {activeSection === "details" ? "Identification" : sidebarItems.find((item) => item.key === activeSection)?.label}
                  </h2>
                  {renderSectionContent()}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate("/vehicles")}
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
                      isEditMode ? "Update Vehicle" : "Save Vehicle"
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
