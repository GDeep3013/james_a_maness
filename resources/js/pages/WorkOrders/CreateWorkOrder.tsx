import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DateTimePicker from "../../components/form/date-time-picker";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { workOrderService } from "../../services/workOrderService";
import { vehicleService } from "../../services/vehicleService";
import { contactService } from "../../services/contactService";
import Issues from "./Issues";
import LineItems from "./LineItems";
import Notes from "./Notes";
import { WORK_ORDER_STATUS_OPTIONS, REPAIR_PRIORITY_CLASS_OPTIONS } from "../../constants/selectOptions";
import {
  ServiceItem,
  Part,
  Vehicle,
  Contact,
  Vendor,
  WorkOrderFormData,
} from "../../types/workOrderTypes";
import { vendorService } from "../../services/vendorService";


interface SidebarItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export default function CreateWorkOrder() {

  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState<WorkOrderFormData>({
    vehicle_id: "",
    status: "Open",
    repair_priority_class: "",
    issue_date: "",
    scheduled_start_date: "",
    send_scheduled_start_date_reminder: false,
    actual_start_date: "",
    expected_completion_date: "",
    actual_completion_date: "",
    use_start_odometer_for_completion_meter: true,
    assigned_to: "",
    vendor_id: "",
    invoice_number: "",
    po_number: "",
    service_items: [],
    parts: [],
    notes: "",
    discount_type: "percentage",
    discount_value: 0,
    base_value: 0,
    total_value: 0,
    tax_type: "percentage",
    tax_value: 0,
  });

  useEffect(() => {
    fetchDropdownData();
    if (isEditMode && id) {
      fetchWorkOrderData(parseInt(id));
    }
  }, [isEditMode, id]);

  const fetchDropdownData = async () => {
    try {
      const [vehiclesRes, contactsRes,vendorsRes] = await Promise.all([
        vehicleService.getAll({ page: 1 }),
        contactService.getAll({ page: 1 }),
        vendorService.getAll({ page: 1 }),
      ]);

      if (vehiclesRes.data?.status && vehiclesRes.data?.vehical?.data) {
        setVehicles(vehiclesRes.data.vehical.data);
      }

      if (contactsRes.data?.status && contactsRes.data?.contact?.data) {
        setContacts(contactsRes.data.contact.data);
      }

      if (vendorsRes.data?.status && vendorsRes.data?.vendor?.data) {
        setVendors(vendorsRes.data.vendor.data);
      }
    } catch {
      setGeneralError("Failed to load dropdown data");
    }
  };

  const fetchWorkOrderData = async (workOrderId: number) => {
    setIsLoading(true);
    setGeneralError("");
    try {
      const response = await workOrderService.getForEdit(workOrderId);
      const data = response.data as { status: boolean; data?: Record<string, unknown> };

      if (data.status && data.data) {
        const workOrder = data.data;
        setFormData({
          vehicle_id: String(workOrder.vehicle_id || ""),
          status: String(workOrder.status || "Open"),
          repair_priority_class: String(workOrder.repair_priority_class || ""),
          issue_date: String(workOrder.issue_date || ""),
          scheduled_start_date: String(workOrder.scheduled_start_date || ""),
          send_scheduled_start_date_reminder: Boolean(workOrder.send_scheduled_start_date_reminder || false),
          actual_start_date: String(workOrder.actual_start_date || ""),
          expected_completion_date: String(workOrder.expected_completion_date || ""),
          actual_completion_date: String(workOrder.actual_completion_date || ""),
          use_start_odometer_for_completion_meter: Boolean(workOrder.use_start_odometer_for_completion_meter !== false),
          assigned_to: String(workOrder.assigned_to || ""),
          vendor_id: String(workOrder.vendor_id || ""),
          invoice_number: String(workOrder.invoice_number || ""),
          po_number: String(workOrder.po_number || ""),
          service_items: Array.isArray(workOrder.service_items)
            ? (workOrder.service_items as ServiceItem[])
            : [] as ServiceItem[],
          parts: Array.isArray(workOrder.parts)
            ? (workOrder.parts as Part[])
            : [] as Part[],
          notes: String(workOrder.notes || ""),
          discount_type: (workOrder.discount_type as "percentage" | "fixed") || "percentage",
          discount_value: Number(workOrder.discount_value || 0),
          base_value: Number(workOrder.base_value || 0),
          total_value: Number(workOrder.total_value || 0),
          tax_type: (workOrder.tax_type as "percentage" | "fixed") || "percentage",
          tax_value: Number(workOrder.tax_value || 0),
        });
      }
    } catch {
      setGeneralError("Failed to load work order data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDateTimeChange = (name: string) => (_dates: unknown, dateString: string) => {
    setFormData((prev) => ({ ...prev, [name]: dateString }));
    // if (errors[name]) {
    //   setErrors((prev) => {
    //     const newErrors = { ...prev };
    //     delete newErrors[name];
    //     return newErrors;
    //   });
    // }
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

  const calculateValues = useMemo(() => {
    const getLaborPrice = (item: ServiceItem | Part): number => {
      if ('name' in item) {
        return (item as ServiceItem).labor_cost || 0;
      }
      return 0;
    };

    const getPartsPrice = (item: ServiceItem | Part): number => {
      if ('name' in item) {
        return (item as ServiceItem & { unit_price?: number }).unit_price || 0;
      }
      const part = item as Part;
      const unitPrice = part.unit_price || 0;
      const quantity = part.quantity || 1;
      return unitPrice * quantity;
    };

    let laborTotal = 0;
    let partsTotal = 0;

    formData.service_items.forEach((item) => {
      laborTotal += getLaborPrice(item);
    });

    formData.parts.forEach((item) => {
      partsTotal += getPartsPrice(item);
    });

    const baseValue = laborTotal + partsTotal;

    let discountAmount = 0;
    if (formData.discount_value && formData.discount_value > 0) {
      if (formData.discount_type === "percentage") {
        discountAmount = (baseValue * formData.discount_value) / 100;
      } else {
        discountAmount = formData.discount_value;
      }
    }

    const afterDiscount = baseValue - discountAmount;

    let taxAmount = 0;
    if (formData.tax_value && formData.tax_value > 0) {
      if (formData.tax_type === "percentage") {
        taxAmount = (afterDiscount * formData.tax_value) / 100;
      } else {
        taxAmount = formData.tax_value;
      }
    }

    const totalValue = afterDiscount + taxAmount;

    return {
      baseValue: parseFloat((Number(baseValue) || 0).toFixed(2)),
      totalValue: parseFloat((Number(totalValue) || 0).toFixed(2)),
    };
  }, [formData.service_items, formData.parts, formData.discount_type, formData.discount_value, formData.tax_type, formData.tax_value]);

  useEffect(() => {
    setFormData((prev) => {
      if (prev.base_value === calculateValues.baseValue && prev.total_value === calculateValues.totalValue) {
        return prev;
      }
      return {
        ...prev,
        base_value: calculateValues.baseValue,
        total_value: calculateValues.totalValue,
      };
    });
  }, [calculateValues.baseValue, calculateValues.totalValue]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicle_id.trim()) {
      newErrors.vehicle_id = "Vehicle is required";
    }

    if (!formData.status.trim()) {
      newErrors.status = "Status is required";
    }

    if (!formData.issue_date.trim()) {
      newErrors.issue_date = "Issue date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareWorkOrderData = () => {
    return {
      vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
      status: formData.status || undefined,
      repair_priority_class: formData.repair_priority_class || undefined,
      issue_date: formData.issue_date || undefined,
      scheduled_start_date: formData.scheduled_start_date || undefined,
      send_scheduled_start_date_reminder: Boolean(formData.send_scheduled_start_date_reminder),
      actual_start_date: formData.actual_start_date || undefined,
      expected_completion_date: formData.expected_completion_date || undefined,
      actual_completion_date: formData.actual_completion_date || undefined,
      use_start_odometer_for_completion_meter: Boolean(formData.use_start_odometer_for_completion_meter),
      assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : undefined,
      vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : undefined,
      invoice_number: formData.invoice_number || undefined,
      po_number: formData.po_number || undefined,
      service_items: formData.service_items,
      parts: formData.parts,
      notes: formData.notes || undefined,
      discount_type: formData.discount_type || undefined,
      discount_value: formData.discount_value !== undefined ? formData.discount_value : undefined,
      base_value: formData.base_value !== undefined ? formData.base_value : undefined,
      total_value: formData.total_value !== undefined ? formData.total_value : undefined,
      tax_type: formData.tax_type || undefined,
      tax_value: formData.tax_value !== undefined ? formData.tax_value : undefined,
    };
  };

  const handleSubmit = async (e?: React.FormEvent, continueEditing: boolean = false) => {
    if (e) {
      e.preventDefault();
    }

    if (continueEditing && isEditMode) {
      return;
    }

    setGeneralError("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const workOrderData = prepareWorkOrderData();

      const response = isEditMode && id
        ? await workOrderService.update(parseInt(id), workOrderData)
        : await workOrderService.create(workOrderData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        if (continueEditing && !isEditMode) {
          const workOrderId = (response.data?.data as { id?: number })?.id;
          if (workOrderId) {
            navigate(`/work-orders/${workOrderId}`, { replace: true });
          } else {
            setGeneralError("Work order created but ID not found. Redirecting to list...");
            setTimeout(() => {
              navigate("/work-orders", { replace: true });
            }, 2000);
          }
        } else {
          navigate("/work-orders", { replace: true });
        }
      } else {
        setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} work order. Please try again.`);
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
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the work order. Please try again.`
          );
        }
      } else {
        setGeneralError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinue = () => {
    handleSubmit(undefined, true);
  };

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id.toString(),
    label: vehicle.vehicle_name,
  }));

  const contactOptions = contacts.map((contact) => ({
    value: contact.id.toString(),
    label: `${contact.first_name} ${contact.last_name}`.trim(),
  }));

  const vendorOptions = vendors.map((vendor) => ({
    value: vendor.id.toString(),
    label: vendor.name
  }));

  const renderDetailsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <Label htmlFor="status">
            Status <span className="text-error-500">*</span>
          </Label>
          <Select
            options={WORK_ORDER_STATUS_OPTIONS}
            placeholder="Please select"
            onChange={handleSelectChange("status")}
            defaultValue={formData.status}
          />
          {errors.status && (
            <p className="mt-1 text-sm text-error-500">{errors.status}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="repair_priority_class">Repair Priority Class</Label>
        <Select
          options={REPAIR_PRIORITY_CLASS_OPTIONS}
          placeholder="Please select"
          onChange={handleSelectChange("repair_priority_class")}
          defaultValue={formData.repair_priority_class}
        />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Repair Priority Class is a simple way to classify whether a service or repair was scheduled, non-scheduled, or an emergency.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="issue_date">
            Issue Date <span className="text-error-500">*</span>
          </Label>
          <DateTimePicker
            id="issue_date"
            label=""
            placeholder="Select issue date and time"
            onChange={handleDateTimeChange("issue_date")}
            defaultDate={formData.issue_date || undefined}
          />
          {errors.issue_date && (
            <p className="mt-1 text-sm text-error-500">{errors.issue_date}</p>
          )}
        </div>

        <div>
          <Label htmlFor="scheduled_start_date">Scheduled Start Date</Label>
          <DateTimePicker
            id="scheduled_start_date"
            label=""
            placeholder="Select scheduled start date and time"
            onChange={handleDateTimeChange("scheduled_start_date")}
            defaultDate={formData.scheduled_start_date || undefined}
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="send_scheduled_start_date_reminder"
          checked={formData.send_scheduled_start_date_reminder}
          onChange={handleCheckboxChange("send_scheduled_start_date_reminder")}
        />
        <div className="flex-1">
          <label
            htmlFor="send_scheduled_start_date_reminder"
            className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
          >
            Send a Scheduled Start Date Reminder
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check if you would like to send selected users a Scheduled Start Date reminder notification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="actual_start_date">Actual Start Date</Label>
          <DateTimePicker
            id="actual_start_date"
            label=""
            placeholder="Select actual start date and time"
            onChange={handleDateTimeChange("actual_start_date")}
            defaultDate={formData.actual_start_date || undefined}
          />
        </div>

        <div>
          <Label htmlFor="expected_completion_date">Expected Completion Date</Label>
          <DateTimePicker
            id="expected_completion_date"
            label=""
            placeholder="Select expected date and time"
            onChange={handleDateTimeChange("expected_completion_date")}
            defaultDate={formData.expected_completion_date || undefined}
          />
        </div>

        <div>
          <Label htmlFor="actual_completion_date">Actual Completion Date</Label>
          <DateTimePicker
            id="actual_completion_date"
            label=""
            placeholder="Select actual date and time"
            onChange={handleDateTimeChange("actual_completion_date")}
            defaultDate={formData.actual_completion_date || undefined}
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="use_start_odometer_for_completion_meter"
          checked={formData.use_start_odometer_for_completion_meter}
          onChange={handleCheckboxChange("use_start_odometer_for_completion_meter")}
        />
        <div className="flex-1">
          <label
            htmlFor="use_start_odometer_for_completion_meter"
            className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 cursor-pointer"
          >
            Use start odometer for completion meter
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Uncheck if meter usage has increased since work order start date
          </p>
        </div>
      </div>
    </div>
  );

  const renderAssignmentSection = () => (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Select
            options={contactOptions}
            placeholder="Please select"
            onChange={handleSelectChange("assigned_to")}
            defaultValue={formData.assigned_to}
          />
        </div>

        <div>
          <Label htmlFor="vendor_id">Vendor</Label>
          <Select
            options={vendorOptions}
            placeholder="Please select"
            onChange={handleSelectChange("vendor_id")}
            defaultValue={formData.vendor_id}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input
            type="text"
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={(e) => handleInputChange("invoice_number", e.target.value)}
            placeholder="Enter invoice number"
          />
        </div>

        <div>
          <Label htmlFor="po_number">PO Number</Label>
          <Input
            type="text"
            id="po_number"
            name="po_number"
            value={formData.po_number}
            onChange={(e) => handleInputChange("po_number", e.target.value)}
            placeholder="Enter PO number"
          />
        </div>
      </div>
    </div>
  );

  const renderIssuesSection = () => {
    const selectedVehicle = vehicles.find(
      (v) => v.id.toString() === formData.vehicle_id
    );
    return (
      <Issues
        workOrderId={id ? parseInt(id) : undefined}
        vehicleId={selectedVehicle?.id}
        vehicleName={selectedVehicle?.vehicle_name}
      />
    );
  };

  const renderLineItemsSection = () => (
    <LineItems
      serviceItems={formData.service_items}
      parts={formData.parts}
      setFormData={setFormData}
      onDeleteLineItem={() => {}}
    />
  );

  const renderNotesSection = () => (
    <Notes
      notes={formData.notes}
      setNotes={(notes) => setFormData((prev) => ({ ...prev, notes: notes }))}
      serviceItems={formData.service_items}
      parts={formData.parts}
      discountType={formData.discount_type}
      discountValue={formData.discount_value}
      taxType={formData.tax_type}
      taxValue={formData.tax_value}
      setDiscountType={(type) => setFormData((prev) => ({ ...prev, discount_type: type }))}
      setDiscountValue={(value) => setFormData((prev) => ({ ...prev, discount_value: value }))}
      setTaxType={(type) => setFormData((prev) => ({ ...prev, tax_type: type }))}
      setTaxValue={(value) => setFormData((prev) => ({ ...prev, tax_value: value }))}
    />
  );

  const sidebarItems: SidebarItem[] = [
    { key: "details", label: "Details", content: renderDetailsSection() },
    { key: "assignment", label: "Assignment", content: renderAssignmentSection() },
    { key: "issues", label: "", content: renderIssuesSection() },
    { key: "lineItems", label: "", content: renderLineItemsSection() },
    { key: "notes", label: "", content: renderNotesSection() },
  ];

  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Work Order" : "Create Work Order"}
        description={isEditMode ? "Edit work order" : "Create a new work order"}
      />
      <PageBreadcrumb pageTitle={[
        { name: "Work Orders", to: "/work-orders" },
        { name: isEditMode ? "Edit Work Order" : "Create Work Order", to: isEditMode ? `/work-orders/${id}` : "/work-orders/create" },
      ]} />

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isEditMode ? "Edit Work Order" : "Create Work Order"}
            </h2>
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-6 justify-center max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading work order data...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                {generalError && (
                  <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <p className="text-sm text-error-600 dark:text-error-400">{generalError}</p>
                  </div>
                )}

                {sidebarItems.map((item) => (
                  <div key={item.key} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                    {item.label && <h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                        {item.label}
                      </h2>
                    }
                    {item.content}
                  </div>
                ))}

                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/work-orders")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  {!isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handleSaveAndContinue}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                          Saving...
                        </>
                      ) : (
                        "Save and Continue"
                      )}
                    </Button>
                  )}
                  
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
                      isEditMode ? "Update Work Order" : "Save Work Order"
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

