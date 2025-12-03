import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { serviceTaskService } from "../../services/serviceTaskService";
import { PencilIcon } from "../../icons";

interface ServiceTask {
  id: number;
  name: string;
  description?: string;
  labor_cost?: number;
  subtasks?: Array<{
    id: number;
    name: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export default function ViewServiceTask() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [serviceTask, setServiceTask] = useState<ServiceTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchServiceTask(parseInt(id));
    }
  }, [id]);

  const fetchServiceTask = async (serviceTaskId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await serviceTaskService.getById(serviceTaskId);
      const data = response.data as { status: boolean; service_task?: ServiceTask };

      if (data.status && data.service_task) {
        setServiceTask(data.service_task);
      } else {
        setError("Service task not found");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load service task");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title="View Service Task" description="View service task details" />
        <PageBreadcrumb pageTitle="View Service Task" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            <p className="mt-2 text-sm text-gray-600">Loading service task...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !serviceTask) {
    return (
      <>
        <PageMeta title="View Service Task" description="View service task details" />
        <PageBreadcrumb pageTitle="View Service Task" />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error || "Service task not found"}</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate("/service-tasks")}
              className="mt-4"
            >
              Back to List
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="View Service Task" description="View service task details" />
      <PageBreadcrumb pageTitle="View Service Task" />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base md:text-2xl font-semibold text-gray-800">{serviceTask.name}</h1>
          <Button
            variant="none"
            size="md"
            onClick={() => navigate(`/service-tasks/${serviceTask.id}/edit`)}
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Name</Label>
            <p className="mt-1 text-sm text-gray-800">{serviceTask.name}</p>
          </div>

          <div>
            <Label>Description</Label>
            <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
              {serviceTask.description || "-"}
            </p>
          </div>

          <div>
            <Label>Labor Cost</Label>
            <p className="mt-1 text-sm text-gray-800">
              {serviceTask.labor_cost !== undefined && serviceTask.labor_cost !== null
                ? `$${parseFloat(String(serviceTask.labor_cost)).toFixed(2)}`
                : "-"}
            </p>
          </div>

          <div>
            <Label>Subtasks</Label>
            {serviceTask.subtasks && serviceTask.subtasks.length > 0 ? (
              <div className="mt-2 space-y-2">
                {serviceTask.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-800">{subtask.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-400">No subtasks</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <Label>Created At</Label>
              <p className="mt-1 text-sm text-gray-600">
                {serviceTask.created_at
                  ? new Date(serviceTask.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <Label>Updated At</Label>
              <p className="mt-1 text-sm text-gray-600">
                {serviceTask.updated_at
                  ? new Date(serviceTask.updated_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate("/service-tasks")}
            >
              Back to List
            </Button>
            <Button
              variant="none"
              size="md"
              onClick={() => navigate(`/service-tasks/${serviceTask.id}/edit`)}
            >
              Edit Service Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

