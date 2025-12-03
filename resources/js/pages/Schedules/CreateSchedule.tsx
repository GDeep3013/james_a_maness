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
import { vehicleService } from "../../services/vehicleService";
import { contactService } from "../../services/contactService";
import { serviceTaskService } from "../../services/serviceTaskService";
import { scheduleService } from "../../services/scheduleService";
import { Vehicle, Contact } from "../../types/workOrderTypes";

interface ServiceTaskOption {
  value: string;
  label: string;
  id?: number;
  [key: string]: unknown;
}

interface ScheduleFormData {
  vehicle_id: string;
  service_task_ids: string[];
  notifications_enabled: boolean;
  watchers: string[];
  next_due_date: string;
  next_due_meter: string;
}


export default function CreateSchedule() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [serviceTaskOptions, setServiceTaskOptions] = useState<ServiceTaskOption[]>([]);
  const [allServiceTasks, setAllServiceTasks] = useState<ServiceTaskOption[]>([]);
  const [isLoadingServiceTasks, setIsLoadingServiceTasks] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const selectedTasksRef = useRef<ServiceTaskOption[]>([]);
  const dataLoadedRef = useRef(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    vehicle_id: "",
    service_task_ids: [],
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

  const fetchDropdownData = useCallback(async () => {
    try {
      const [vehiclesRes, contactsRes, serviceTasksRes] = await Promise.all([
        vehicleService.getAll({ page: 1 }),
        contactService.getAll({ page: 1 }),
        serviceTaskService.getAll({ page: 1 }),
      ]);

      if (vehiclesRes.data?.status && vehiclesRes.data?.vehical?.data) {
        setVehicles(vehiclesRes.data.vehical.data);
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

  useEffect(() => {
    if (dataLoadedRef.current) return;
    dataLoadedRef.current = true;

    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (!isEditMode || !id || dataLoadedRef.current === false) return;

    const loadScheduleData = async () => {
      const scheduleId = parseInt(id);
      setIsLoading(true);
      setGeneralError("");
      try {
        const response = await scheduleService.getForEdit(scheduleId);
        const data = response.data as { status: boolean; data?: Record<string, unknown> };
        
        if (data.status && data.data) {
          const schedule = data.data;
          const nextDueMeterStr = String(schedule.next_due_meter || "");
          let nextDueMeterValue = "";
          
          if (nextDueMeterStr) {
            const parts = nextDueMeterStr.trim().split(/\s+/);
            if (parts.length >= 1) {
              nextDueMeterValue = parts[0];
            }
          }
          
          const scheduleServiceTaskIds = Array.isArray(schedule.service_task_ids) 
            ? schedule.service_task_ids.map((id: unknown) => String(id))
            : [];

          setFormData({
            vehicle_id: String(schedule.vehicle_id || ""),
            service_task_ids: scheduleServiceTaskIds,
            notifications_enabled: Boolean(schedule.notifications_enabled !== false),
            watchers: Array.isArray(schedule.watchers) 
              ? schedule.watchers.map((w: unknown) => String(w))
              : [],
            next_due_date: schedule.next_due_date ? String(schedule.next_due_date) : "",
            next_due_meter: nextDueMeterValue,
          });

          if (scheduleServiceTaskIds.length > 0) {
            setTimeout(() => {
              const selectedOptions = allServiceTasks.filter((task: ServiceTaskOption) => 
                scheduleServiceTaskIds.includes(task.value)
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
        setGeneralError("Failed to load schedule data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (allServiceTasks.length > 0) {
      loadScheduleData();
    }
  }, [isEditMode, id, allServiceTasks]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);


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
      const formattedDate = date.toISOString().split('T')[0];
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

    if (!formData.next_due_date.trim()) {
      newErrors.next_due_date = "Next Due Date is required";
    }

    if (!formData.next_due_meter.trim()) {
      newErrors.next_due_meter = "Next Due Primary Meter is required";
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
      const scheduleData = {
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
        service_task_ids: formData.service_task_ids.map((id) => parseInt(id)),
        notifications_enabled: Boolean(formData.notifications_enabled),
        watchers: formData.watchers.map((w) => parseInt(w)),
        next_due_date: formData.next_due_date ? formData.next_due_date.trim() : undefined,
        next_due_meter: formData.next_due_meter ? formData.next_due_meter.trim() : undefined,
      };

      const response = isEditMode && id
        ? await scheduleService.update(parseInt(id), scheduleData)
        : await scheduleService.create(scheduleData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        navigate("/schedules", { replace: true });
      } else {
        setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} schedule. Please try again.`);
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
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the schedule. Please try again.`
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


  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Schedule" : "Create Schedule"}
        description={isEditMode ? "Edit schedule" : "Create a new schedule"}
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Edit Schedule" : "Create Schedule"} />
      
      <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading schedule data...
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
                      <Label htmlFor="service_task_id">
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
                        <div>
                          <Label htmlFor="next_due_date">
                            Next Due Date <span className="text-error-500">*</span>
                          </Label>
                          <DateTimePicker
                            id="next_due_date"
                            label=""
                            placeholder="Select date"
                            onChange={handleDateTimeChange("next_due_date")}
                            defaultDate={formData.next_due_date || undefined}
                            enableTime={false}
                            dateFormat="m/d/Y"
                          />
                          {errors.next_due_date && (
                            <p className="mt-1 text-sm text-error-500">{errors.next_due_date}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="next_due_meter">
                            Next Due Primary Meter <span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            id="next_due_meter"
                            name="next_due_meter"
                            value={formData.next_due_meter}
                            onChange={(e) => handleInputChange("next_due_meter", e.target.value)}
                            placeholder="Enter meter value"
                          />
                          {errors.next_due_meter && (
                            <p className="mt-1 text-sm text-error-500">{errors.next_due_meter}</p>
                          )}
                        </div>
                      </div>
                  

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
                          If ON, and the user has Notification Settings enabled for Schedules, the user will receive a notification at 7:00 am once the schedule becomes Due Soon or Overdue, and then weekly until the Schedule is resolved.
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
                    onClick={() => navigate("/schedules")}
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
                        const scheduleData = {
                          vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
                          service_task_ids: formData.service_task_ids.map((id) => parseInt(id)),
                          notifications_enabled: Boolean(formData.notifications_enabled),
                          watchers: formData.watchers.map((w) => parseInt(w)),
                          next_due_date: formData.next_due_date ? formData.next_due_date.trim() : undefined,
                          next_due_meter: formData.next_due_meter ? formData.next_due_meter.trim() : undefined,
                        };
                        setIsSubmitting(true);
                        try {
                          await scheduleService.create(scheduleData);
                          setFormData({
                            vehicle_id: "",
                            service_task_ids: [],
                            notifications_enabled: true,
                            watchers: [],
                            next_due_date: "",
                            next_due_meter: "",
                          });
                          setErrors({});
                        } catch {
                          setGeneralError("Failed to save schedule. Please try again.");
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
                      isEditMode ? "Update Schedule" : "Save Schedule"
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

