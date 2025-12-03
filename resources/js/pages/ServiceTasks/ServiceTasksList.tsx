import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { serviceTaskService } from "../../services/serviceTaskService";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface ServiceTask {
  id: number;
  name: string;
  description?: string;
  labor_cost?: number;
  subtasks?: ServiceTask[];
  created_at?: string;
  updated_at?: string;
}


interface ServiceTasksResponse {
  status: boolean;
  service_tasks?: {
    data: ServiceTask[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ServiceTasksList() {
  const navigate = useNavigate();
  const [serviceTasks, setServiceTasks] = useState<ServiceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchServiceTasks = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await serviceTaskService.getAll({ page, search });
      const data = response.data as ServiceTasksResponse;

      if (data.status && data.service_tasks) {
        setServiceTasks(data.service_tasks.data || []);
        setPagination({
          current_page: data.service_tasks.current_page,
          last_page: data.service_tasks.last_page,
          per_page: data.service_tasks.per_page,
          total: data.service_tasks.total,
        });
      } else {
        setError("Failed to load service tasks");
        setServiceTasks([]);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load service tasks");
      setServiceTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceTasks(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchServiceTasks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServiceTasks(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchServiceTasks]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service task?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await serviceTaskService.delete(id);
      if (response.data?.status === true || response.status === 200) {
        fetchServiceTasks(currentPage, searchTerm);
      } else {
        alert("Failed to delete service task");
      }
    } catch (error) {
      console.error("Error deleting service task:", error);
      alert("Failed to delete service task");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <PageMeta title="Service Tasks" description="Manage service tasks" />
      <PageBreadcrumb pageTitle="Service Tasks" />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base md:text-2xl font-semibold text-gray-800">Service Tasks</h1>
          <Button
            variant="none"
            size="md"
            onClick={() => navigate("/service-tasks/create")}
          >
            + Add Service Task
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search service tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading service tasks...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : serviceTasks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No service tasks found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Labor Cost</TableCell>
                    <TableCell>Subtasks</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        {task.description ? (
                          <span className="text-sm text-gray-600">
                            {task.description.length > 100
                              ? `${task.description.substring(0, 100)}...`
                              : task.description}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.labor_cost !== undefined && task.labor_cost !== null ? (
                          <span className="text-sm text-gray-800 font-medium">
                            ${parseFloat(String(task.labor_cost)).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.subtasks && task.subtasks.length > 0 ? (
                          <span className="text-sm text-gray-600">
                            {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.created_at
                          ? new Date(task.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/service-tasks/${task.id}`)}
                            className="p-2 text-gray-600 hover:text-brand-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/service-tasks/${task.id}/edit`)}
                            className="p-2 text-gray-600 hover:text-brand-600 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <TrashBinIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TableFooter
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              loading={loading}
              itemLabel="service tasks"
            />
          </>
        )}
      </div>
    </>
  );
}

