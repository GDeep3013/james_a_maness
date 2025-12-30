import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import ReactSelect, { MultiValue } from "react-select";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import MultiSelect from "../../components/form/MultiSelect";
import DateTimePicker from "../../components/form/date-time-picker";
import { InfoIcon } from "../../icons";
import { vehicleService } from "../../services/vehicleService";
import { contactService } from "../../services/contactService";
import { serviceTaskService } from "../../services/serviceTaskService";
import { serviceReminderService } from "../../services/serviceReminderService";
import { Vehicle, Contact } from "../../types/workOrderTypes";

interface ServiceTaskOption {
    value: string;
    label: string;
    id?: number;
    [key: string]: unknown;
}

interface ServiceReminderFormData {
    vehicle_id: string;
    service_task_ids: string[];
    time_interval_value: string;
    time_interval_unit: string;
    time_due_soon_threshold_value: string;
    time_due_soon_threshold_unit: string;
    primary_meter_interval_value: string;
    primary_meter_interval_unit: string;
    primary_meter_due_soon_threshold_value: string;
    manually_set_next_reminder: boolean;
    notifications_enabled: boolean;
    watchers: string[];
    next_due_date: string;
    next_due_meter: string;
}

const TIME_UNIT_OPTIONS = [
    { value: "day", label: "day(s)" },
    { value: "week", label: "week(s)" },
    { value: "month", label: "month(s)" },
    { value: "year", label: "year(s)" },
];

export default function CreateServiceReminder() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");
    const [vehicles, setVehicles] = useState<Array<Vehicle & { current_mileage?: string }>>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [serviceTaskOptions, setServiceTaskOptions] = useState<ServiceTaskOption[]>([]);
    const [allServiceTasks, setAllServiceTasks] = useState<ServiceTaskOption[]>([]);
    const [isLoadingServiceTasks, setIsLoadingServiceTasks] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const selectedTasksRef = useRef<ServiceTaskOption[]>([]);
    const dataLoadedRef = useRef(false);
    const [currentMileage, setCurrentMileage] = useState<string>("");
    const [formData, setFormData] = useState<ServiceReminderFormData>({
        vehicle_id: "",
        service_task_ids: [],
        time_interval_value: "",
        time_interval_unit: "month",
        time_due_soon_threshold_value: "",
        time_due_soon_threshold_unit: "week",
        primary_meter_interval_value: "",
        primary_meter_interval_unit: "mi",
        primary_meter_due_soon_threshold_value: "",
        manually_set_next_reminder: false,
        notifications_enabled: true,
        watchers: [],
        next_due_date: "",
        next_due_meter: "",
    });

    const fetchServiceTasks = useCallback(async (search: string = "") => {
        setIsLoadingServiceTasks(true);
        try {
            const response = await serviceTaskService.getAll({ search });
            const data = response.data as { status: boolean; service_tasks?: { data: Array<{ id: number; name: string }> } };

            if (data.status && data.service_tasks?.data) {
                const fetchedTasks = data.service_tasks.data.map((task) => ({
                    value: task.id.toString(),
                    label: task.name,
                    id: task.id,
                }));

                if (!search) {
                    setAllServiceTasks(fetchedTasks);
                }

                setServiceTaskOptions((prevOptions) => {
                    const currentSelected = selectedTasksRef.current;

                    const mergedOptions = [...currentSelected];
                    fetchedTasks.forEach(task => {
                        if (!mergedOptions.find(opt => opt.value === task.value)) {
                            mergedOptions.push(task);
                        }
                    });

                    return mergedOptions.length > 0 ? mergedOptions : prevOptions;
                });
            }
        } catch {
            setServiceTaskOptions((prevOptions) => {
                const currentSelected = selectedTasksRef.current;
                return currentSelected.length > 0 ? currentSelected : (prevOptions.length > 0 ? prevOptions : []);
            });
        } finally {
            setIsLoadingServiceTasks(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [vehiclesRes, contactsRes, serviceTasksRes] = await Promise.all([
                vehicleService.getAll({ page: 1 }),
                contactService.getAll({ page: 1 }),
                serviceTaskService.getAll({ page: 1 }),
            ]);

            if (vehiclesRes.data?.status && vehiclesRes.data?.vehical?.data) {
                const vehiclesData = vehiclesRes.data.vehical.data.map((vehicle: Vehicle & { current_mileage?: string }) => ({
                    ...vehicle,
                    current_mileage: vehicle.current_mileage || "",
                }));
                setVehicles(vehiclesData);
            }

            if (contactsRes.data?.status && contactsRes.data?.contact?.data) {
                setContacts(contactsRes.data.contact.data);
            }

            if (serviceTasksRes.data?.status && serviceTasksRes.data?.service_tasks?.data) {
                const fetchedTasks = serviceTasksRes.data.service_tasks.data.map((task: { id: number; name: string }) => ({
                    value: task.id.toString(),
                    label: task.name,
                    id: task.id,
                }));
                setAllServiceTasks(fetchedTasks);
                setServiceTaskOptions(fetchedTasks);
            }
        } catch {
            setGeneralError("Failed to load dropdown data");
        }
    }, []);


    const fetchServiceReminderData = useCallback(async (reminderId: number) => {
        setIsLoading(true);
        setGeneralError("");
        try {
            const response = await serviceReminderService.getForEdit(reminderId);
            const data = response.data as { status: boolean; data?: Record<string, unknown> };

            if (data.status && data.data) {
                const reminder = data.data;
                const nextDueMeterStr = String(reminder.next_due_meter || "");
                let nextDueMeterValue = "";

                if (nextDueMeterStr) {
                    const parts = nextDueMeterStr.trim().split(/\s+/);
                    if (parts.length >= 1) {
                        nextDueMeterValue = parts[0];
                    }
                }

                const reminderServiceTaskIds = Array.isArray(reminder.service_task_ids)
                    ? reminder.service_task_ids.map((id: unknown) => String(id))
                    : reminder.service_task_id
                        ? [String(reminder.service_task_id)]
                        : [];

                setFormData({
                    vehicle_id: String(reminder.vehicle_id || ""),
                    service_task_ids: reminderServiceTaskIds,
                    time_interval_value: String(reminder.time_interval_value || ""),
                    time_interval_unit: String(reminder.time_interval_unit || "month"),
                    time_due_soon_threshold_value: String(reminder.time_due_soon_threshold_value || ""),
                    time_due_soon_threshold_unit: String(reminder.time_due_soon_threshold_unit || "week"),
                    primary_meter_interval_value: String(reminder.primary_meter_interval_value || ""),
                    primary_meter_interval_unit: String(reminder.primary_meter_interval_unit || "mi"),
                    primary_meter_due_soon_threshold_value: String(reminder.primary_meter_due_soon_threshold_value || ""),
                    manually_set_next_reminder: Boolean(reminder.manually_set_next_reminder || false),
                    notifications_enabled: Boolean(reminder.notifications_enabled !== false),
                    watchers: Array.isArray(reminder.watchers)
                        ? reminder.watchers.map((w: unknown) => String(w))
                        : [],
                    next_due_date: reminder.next_due_date ? String(reminder.next_due_date) : "",
                    next_due_meter: nextDueMeterValue,
                });

                if (reminder.vehicle_id && vehicles.length > 0) {
                    const selectedVehicle = vehicles.find((v) => v.id.toString() === String(reminder.vehicle_id));
                    setCurrentMileage(selectedVehicle?.current_mileage || "");
                }

                if (reminderServiceTaskIds.length > 0) {
                    setTimeout(() => {
                        const selectedOptions = allServiceTasks.filter((task: ServiceTaskOption) =>
                            reminderServiceTaskIds.includes(task.value)
                        );
                        if (selectedOptions.length > 0) {
                            selectedTasksRef.current = selectedOptions;
                            setServiceTaskOptions((prev) => {
                                const merged = [...selectedOptions];
                                prev.forEach(task => {
                                    if (!merged.find(opt => opt.value === task.value)) {
                                        merged.push(task);
                                    }
                                });
                                return merged;
                            });
                        }
                    }, 100);
                }
            }
        } catch {
            setGeneralError("Failed to load service reminder data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [allServiceTasks, vehicles]);

    useEffect(() => {
        if (dataLoadedRef.current) return;
        dataLoadedRef.current = true;

        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        if (!isEditMode || !id || dataLoadedRef.current === false) return;

        if (allServiceTasks.length > 0) {
            fetchServiceReminderData(parseInt(id));
        }
    }, [isEditMode, id, allServiceTasks, fetchServiceReminderData]);

    const handleInputChange = (name: string, value: string | boolean) => {
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

        if (name === "vehicle_id" && value) {
            const selectedVehicle = vehicles.find((v) => v.id.toString() === value);
            setCurrentMileage(selectedVehicle?.current_mileage || "");
        } else if (name === "vehicle_id" && !value) {
            setCurrentMileage("");
        }
    };

    const handleServiceTaskChange = (selectedOptions: MultiValue<ServiceTaskOption>) => {
        if (selectedOptions && selectedOptions.length > 0) {
            const values = selectedOptions.map(option => option.value);
            selectedTasksRef.current = selectedOptions as ServiceTaskOption[];
            setFormData((prev) => ({ ...prev, service_task_ids: values }));
            if (errors.service_task_ids) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.service_task_ids;
                    return newErrors;
                });
            }
        } else {
            selectedTasksRef.current = [];
            setFormData((prev) => ({ ...prev, service_task_ids: [] }));
        }
    };

    const handleServiceTaskSearch = (inputValue: string) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        if (inputValue.trim() === "") {
            return;
        }

        const timeout = setTimeout(() => {
            fetchServiceTasks(inputValue);
        }, 300);

        setSearchTimeout(timeout);
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

    const handleWatchersChange = (selected: string[]) => {
        setFormData((prev) => ({ ...prev, watchers: selected }));
    };

    const handleDateTimeChange = (name: string) => (selectedDates: Date[]) => {
        if (selectedDates && selectedDates.length > 0) {
            const date = selectedDates[0];
            const formattedDate = date.toLocaleDateString('en-CA');
            handleInputChange(name, formattedDate);
        } else {
            handleInputChange(name, "");
        }
    };



    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.vehicle_id.trim()) {
            newErrors.vehicle_id = "Vehicle is required";
        }

        if (!formData.service_task_ids || formData.service_task_ids.length === 0) {
            newErrors.service_task_ids = "At least one Service Task is required";
        }

        if (!formData.time_due_soon_threshold_value) {
            newErrors.time_due_soon_threshold_value = "Time Due Threshold is required";
        }

        if (!formData.primary_meter_due_soon_threshold_value) {
            newErrors.primary_meter_due_soon_threshold_value = " At least Value must be zero or a positive number";
        }

        if (formData.primary_meter_interval_value && currentMileage) {
            const intervalValue = parseFloat(formData.primary_meter_interval_value);
            const currentMileageValue = parseFloat(currentMileage);

            if (!isNaN(intervalValue) && !isNaN(currentMileageValue) && intervalValue <= currentMileageValue) {
                newErrors.primary_meter_interval_value = `Primary Meter Interval must be greater than current mileage (${currentMileage})`;
            }
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
            const nextDueMeter = formData.next_due_meter && formData.primary_meter_interval_unit
                ? `${formData.next_due_meter} ${formData.primary_meter_interval_unit}`
                : formData.next_due_meter || undefined;

            const reminderData = {
                vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
                service_task_ids: formData.service_task_ids.map((id) => parseInt(id)),
                time_interval_value: formData.time_interval_value || undefined,
                time_interval_unit: formData.time_interval_unit || undefined,
                time_due_soon_threshold_value: formData.time_due_soon_threshold_value || undefined,
                time_due_soon_threshold_unit: formData.time_due_soon_threshold_unit || undefined,
                primary_meter_interval_value: formData.primary_meter_interval_value || undefined,
                primary_meter_interval_unit: formData.primary_meter_interval_unit || undefined,
                primary_meter_due_soon_threshold_value: formData.primary_meter_due_soon_threshold_value || undefined,
                primary_meter_due_soon_threshold_unit: formData.primary_meter_interval_unit || undefined,
                manually_set_next_reminder: Boolean(formData.manually_set_next_reminder),
                notifications_enabled: Boolean(formData.notifications_enabled),
                watchers: formData.watchers.map((w) => parseInt(w)),
                next_due_date: formData.next_due_date || undefined,
                next_due_meter: nextDueMeter,
            };
            const response = isEditMode && id
                ? await serviceReminderService.update(parseInt(id), reminderData)
                : await serviceReminderService.create(reminderData);

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                navigate("/service-reminders", { replace: true });
            } else {
                setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} service reminder. Please try again.`);
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
                        `An error occurred while ${isEditMode ? 'updating' : 'creating'} the service reminder. Please try again.`
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const vehicleOptions = vehicles.map((vehicle) => ({
        value: vehicle.id.toString(),
        label: vehicle.vehicle_name,
    }));

    const watcherOptions = contacts.map((contact) => ({
        value: contact.id.toString(),
        text: `${contact.first_name} ${contact.last_name || ""}`.trim(),
    }));

    const renderIntervalInput = (
        label: string,
        valueName: string,
        value: string,
        showInfoIcon: boolean = false
    ) => (
        <div>
            <Label htmlFor={valueName} className="flex items-center gap-2">
                {label}
                {showInfoIcon && (
                    <span className="cursor-help">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                    </span>
                )}
            </Label>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input
                        type="text"
                        id={valueName}
                        name={valueName}
                        value={value}
                        onChange={(e) => handleInputChange(valueName, e.target.value)}
                        placeholder="Every"
                        className={errors[valueName] ? "border-error-500" : ""}
                    />
                </div>
            </div>
            {valueName === "primary_meter_interval_value" && currentMileage && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Current mileage: <span className="font-medium">{currentMileage}</span>
                </p>
            )}
            {errors[valueName] && (
                <p className="mt-1 text-sm text-error-500">{errors[valueName]}</p>
            )}
        </div>
    );

    const renderThresholdInput = (
        label: string,
        valueName: string,
        unitName: string,
        value: string,
        unit: string,
        unitOptions: { value: string; label: string }[],
        showInfoIcon: boolean = false
    ) => (
        <div>
            <Label htmlFor={valueName} className="flex items-center gap-2">
                {label}
                {showInfoIcon && (
                    <span className="cursor-help">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                    </span>
                )} <span className="text-error-500">*</span>
            </Label>
            <div className="flex gap-2">
                <div className="flex-1">
                    {/* <Input
                        type="number"
                        id={valueName}
                        name={valueName}
                        value={value}
                        onChange={(e) => handleInputChange(valueName, e.target.value)}
                        placeholder="Enter value"
                    /> */}
                    <Input
                        type="number"
                        min="0"
                        id={valueName}
                        name={valueName}
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;

                            if (val === "" || Number(val) >= 0) {
                                handleInputChange(valueName, val);
                            }
                        }}
                        placeholder="Enter value"
                    />

                </div>
                <div className="w-32">
                    <Select
                        options={unitOptions}
                        placeholder="Select"
                        onChange={handleSelectChange(unitName)}
                        defaultValue={unit}
                    />
                </div>
            </div>
            {errors[valueName] && (
                <p className="mt-1 text-sm text-error-500">{errors[valueName]}</p>
            )}
        </div>
    );

    return (
        <>
            <PageMeta
                title={isEditMode ? "Edit Service Reminder" : "Create Service Reminder"}
                description={isEditMode ? "Edit service reminder" : "Create a new service reminder"}
            />
            <PageBreadcrumb pageTitle={isEditMode ? "Edit Service Reminder" : "Create Service Reminder"} />

            <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-5xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="flex-1">
                        {isEditMode && isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Loading service reminder data...
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

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                        Details
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="vehicle_id">
                                                Vehicle <span className="text-error-500">*</span>
                                            </Label>
                                            <Select
                                                options={vehicleOptions}
                                                placeholder="Please select"
                                                onChange={handleSelectChange("vehicle_id")}
                                                defaultValue={formData.vehicle_id}
                                            />
                                            {errors.vehicle_id && (
                                                <p className="mt-1 text-sm text-error-500">{errors.vehicle_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="service_task_ids">
                                                Service Task <span className="text-error-500">*</span>
                                            </Label>
                                            <ReactSelect<ServiceTaskOption, true>
                                                isMulti={true}
                                                isClearable
                                                isSearchable
                                                isLoading={isLoadingServiceTasks}
                                                options={serviceTaskOptions}
                                                onChange={handleServiceTaskChange}
                                                onInputChange={handleServiceTaskSearch}
                                                value={serviceTaskOptions.filter(option => formData.service_task_ids.includes(option.value))}
                                                placeholder="Search and select service tasks"
                                                noOptionsMessage={({ inputValue }) =>
                                                    inputValue ? `No service tasks found for "${inputValue}"` : "No service tasks available"
                                                }
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        minHeight: "44px",
                                                        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                                                        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                                                        "&:hover": {
                                                            borderColor: "#3b82f6",
                                                        },
                                                    }),
                                                    multiValue: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: "#f3f4f6",
                                                    }),
                                                    multiValueLabel: (baseStyles) => ({
                                                        ...baseStyles,
                                                        color: "#1f2937",
                                                    }),
                                                    multiValueRemove: (baseStyles) => ({
                                                        ...baseStyles,
                                                        color: "#6b7280",
                                                        "&:hover": {
                                                            backgroundColor: "#e5e7eb",
                                                            color: "#374151",
                                                        },
                                                    }),
                                                }}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                            {errors.service_task_ids && (
                                                <p className="mt-1 text-sm text-error-500">{errors.service_task_ids}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {renderIntervalInput(
                                                "Time Interval",
                                                "time_interval_value",
                                                formData.time_interval_value,
                                                false
                                            )}

                                            {renderThresholdInput(
                                                "Time Due Soon Threshold",
                                                "time_due_soon_threshold_value",
                                                "time_due_soon_threshold_unit",
                                                formData.time_due_soon_threshold_value,
                                                formData.time_due_soon_threshold_unit,
                                                TIME_UNIT_OPTIONS,
                                                false
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {renderIntervalInput(
                                                "Primary Meter Interval",
                                                "primary_meter_interval_value",
                                                formData.primary_meter_interval_value,
                                                false
                                            )}

                                            <div>
                                                <Label htmlFor="primary_meter_due_soon_threshold_value" className="flex items-center gap-2">
                                                    Primary Meter Due Soon Threshold
                                                    {/* <span className="cursor-help">
                            <InfoIcon className="w-4 h-4 text-gray-400" />
                          </span> */}<span className="text-error-500">*</span>

                                                </Label>
                                                {/* <Input
                                                    type="number"
                                                    id="primary_meter_due_soon_threshold_value"
                                                    name="primary_meter_due_soon_threshold_value"
                                                    value={formData.primary_meter_due_soon_threshold_value}
                                                    onChange={(e) => handleInputChange("primary_meter_due_soon_threshold_value", e.target.value)}
                                                    placeholder={formData.primary_meter_interval_unit}
                                                /> */}
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    id="primary_meter_due_soon_threshold_value"
                                                    name="primary_meter_due_soon_threshold_value"
                                                    value={formData.primary_meter_due_soon_threshold_value}
                                                    placeholder={formData.primary_meter_interval_unit}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || Number(value) >= 0) {
                                                            handleInputChange(
                                                                "primary_meter_due_soon_threshold_value",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                />

                                                {errors.primary_meter_due_soon_threshold_value && (
                                                    <p className="mt-1 text-sm text-error-500">{errors.primary_meter_due_soon_threshold_value}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="manually_set_next_reminder"
                                                checked={formData.manually_set_next_reminder}
                                                onChange={handleCheckboxChange("manually_set_next_reminder")}
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="manually_set_next_reminder"
                                                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                                                >
                                                    Manually set the due date and/or meter for the next reminder
                                                </label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Adjust the schedule by updating the next reminder's meter and/or date.
                                                </p>
                                            </div>
                                        </div>

                                        {formData.manually_set_next_reminder && (
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="next_due_date">Next Due Date</Label>
                                                    <DateTimePicker
                                                        // id="next_due_date"
                                                        // label=""
                                                        // placeholder="Select date"
                                                        // onChange={handleDateTimeChange("next_due_date")}

                                                        // defaultDate={formData.next_due_date ? new Date(formData.next_due_date) : undefined}
                                                        // enableTime={false}
                                                        // dateFormat="m/d/Y"

                                                        id="next_due_date"
                                                        label=""
                                                        placeholder="Select date"
                                                        onChange={handleDateTimeChange("next_due_date")}
                                                        defaultDate={formData.next_due_date ? new Date(formData.next_due_date) : undefined}
                                                        enableTime={false}
                                                        dateFormat="m/d/Y"
                                                    />
                                                    {errors.next_due_date && (
                                                        <p className="mt-1 text-sm text-error-500">{errors.next_due_date}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="next_due_meter">Next Due Primary Meter</Label>
                                                    <Input
                                                        type="number"
                                                        id="next_due_meter"
                                                        name="next_due_meter"
                                                        value={formData.next_due_meter}
                                                        onChange={(e) => handleInputChange("next_due_meter", e.target.value)}
                                                        placeholder={formData.primary_meter_interval_unit}
                                                    />
                                                    {errors.next_due_meter && (
                                                        <p className="mt-1 text-sm text-error-500">{errors.next_due_meter}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="notifications_enabled"
                                                checked={formData.notifications_enabled}
                                                onChange={handleCheckboxChange("notifications_enabled")}
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="notifications_enabled"
                                                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
                                                >
                                                    Notifications
                                                </label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    If ON, and the user has Notification Settings enabled for Service Reminders, the user will receive a notification at 7:00 am once the reminder becomes Due Soon or Overdue, and then weekly until the Reminder is resolved.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="watchers">Watchers</Label>
                                            <MultiSelect
                                                label=""
                                                options={watcherOptions}
                                                value={formData.watchers}
                                                onChange={handleWatchersChange}
                                                placeholder="Select watchers"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/service-reminders")}
                                        disabled={isSubmitting}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            if (validateForm()) {
                                                const nextDueMeter = formData.next_due_meter && formData.primary_meter_interval_unit
                                                    ? `${formData.next_due_meter} ${formData.primary_meter_interval_unit}`
                                                    : formData.next_due_meter || undefined;

                                                const reminderData = {
                                                    vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
                                                    service_task_ids: formData.service_task_ids.map((id) => parseInt(id)),
                                                    time_interval_value: formData.time_interval_value || undefined,
                                                    time_interval_unit: formData.time_interval_unit || undefined,
                                                    time_due_soon_threshold_value: formData.time_due_soon_threshold_value || undefined,
                                                    time_due_soon_threshold_unit: formData.time_due_soon_threshold_unit || undefined,
                                                    primary_meter_interval_value: formData.primary_meter_interval_value || undefined,
                                                    primary_meter_interval_unit: formData.primary_meter_interval_unit || undefined,
                                                    primary_meter_due_soon_threshold_value: formData.primary_meter_due_soon_threshold_value || undefined,
                                                    primary_meter_due_soon_threshold_unit: formData.primary_meter_interval_unit || undefined,
                                                    manually_set_next_reminder: Boolean(formData.manually_set_next_reminder),
                                                    notifications_enabled: Boolean(formData.notifications_enabled),
                                                    watchers: formData.watchers.map((w) => parseInt(w)),
                                                    next_due_date: formData.next_due_date || undefined,
                                                    next_due_meter: nextDueMeter,
                                                };
                                                setIsSubmitting(true);
                                                try {
                                                    await serviceReminderService.create(reminderData);
                                                    setFormData({
                                                        vehicle_id: "",
                                                        service_task_ids: [],
                                                        time_interval_value: "",
                                                        time_interval_unit: "month",
                                                        time_due_soon_threshold_value: "",
                                                        time_due_soon_threshold_unit: "week",
                                                        primary_meter_interval_value: "",
                                                        primary_meter_interval_unit: "mi",
                                                        primary_meter_due_soon_threshold_value: "",
                                                        manually_set_next_reminder: false,
                                                        notifications_enabled: true,
                                                        watchers: [],
                                                        next_due_date: "",
                                                        next_due_meter: "",
                                                    });
                                                    setErrors({});
                                                } catch {
                                                    // Error handling
                                                } finally {
                                                    setIsSubmitting(false);
                                                }
                                            }
                                        }}
                                    >
                                        Save & Add Another
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="sm"
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
                                            isEditMode ? "Update Service Reminder" : "Save Service Reminder"
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
