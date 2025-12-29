import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { serviceTaskService } from "../../services/serviceTaskService";

interface ServiceTaskFormData {
  name: string;
  description: string;
  labor_cost: string;
}

export default function CreateServiceTask() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [formData, setFormData] = useState<ServiceTaskFormData>({
    name: "",
    description: "",
    labor_cost: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchServiceTaskData(parseInt(id));
    }
  }, [isEditMode, id]);

  const fetchServiceTaskData = async (serviceTaskId: number) => {
    setIsLoading(true);
    setGeneralError("");
    try {
      const response = await serviceTaskService.getForEdit(serviceTaskId);
      const data = response.data as { status: boolean; data?: Record<string, unknown> };

      if (data.status && data.data) {
        const serviceTask = data.data as {
          name?: string;
          description?: string;
          labor_cost?: number;
        };
        setFormData({
          name: String(serviceTask.name || ""),
          description: String(serviceTask.description || ""),
          labor_cost: serviceTask.labor_cost ? String(serviceTask.labor_cost) : "",
        });
      }
    } catch {
      setGeneralError("Failed to load service task data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (name: keyof ServiceTaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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
      const serviceTaskData = {
        name: formData.name,
        description: formData.description || undefined,
        labor_cost: formData.labor_cost ? parseFloat(formData.labor_cost) : undefined,
      };

      const response = isEditMode && id
        ? await serviceTaskService.update(parseInt(id), serviceTaskData)
        : await serviceTaskService.create(serviceTaskData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        navigate("/service-tasks", { replace: true });
      } else {
        setGeneralError(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} service task. Please try again.`);
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
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the service task. Please try again.`
          );
        }
      } else {
        setGeneralError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Service Task" : "Create Service Task"}
        description={isEditMode ? "Edit service task" : "Create a new service task"}
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Edit Service Task" : "Create Service Task"} />

      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading service task data...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {generalError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{generalError}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter service task name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      A brief title for your unique task. See examples comprehensive list of{" "}
                      <b>Standard Service Tasks</b> that cover most common repairs and maintenance.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter description"
                      rows={4}
                      className="h-24 w-full rounded-lg resize-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Additional details about the service/maintenance task.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="labor_cost">Labor Cost</Label>
                    <Input
                      type="number"
                      id="labor_cost"
                      name="labor_cost"
                      value={formData.labor_cost}
                      onChange={(e) => handleInputChange("labor_cost", e.target.value)}
                      placeholder="0.00"
                      className={errors.labor_cost ? "border-red-500" : ""}
                    />
                    {errors.labor_cost && (
                      <p className="mt-1 text-sm text-red-500">{errors.labor_cost}</p>
                    )}
                  </div>

                </div>

                <div className="mt-6 flex justify-end gap-4 border-t border-gray-200 pt-6">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate("/service-tasks")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition px-6 py-3 text-sm bg-green-600 text-white shadow-theme-xs hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
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
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

