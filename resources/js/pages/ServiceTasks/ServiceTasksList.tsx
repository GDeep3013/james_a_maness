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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServiceTasks(1, searchTerm);
  };

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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base md:text-2xl font-semibold text-gray-800">Service Tasks</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/service-tasks/create")}
          >
            + Create Service Task
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex max-[767px]:flex-wrap items-center gap-4">
            <div className="w-full">
              <Input
                type="text"
                placeholder="Search by name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading service tasks...
                  </p>
                </div>
              </div>
            ) : serviceTasks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No service tasks found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                        Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                        Description
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                        Labor Cost
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs w-[10%]">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {serviceTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm">
                            {task.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {task.description ? (
                              task.description.length > 100
                                ? `${task.description.substring(0, 100)}...`
                                : task.description
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {task.labor_cost !== undefined && task.labor_cost !== null ? (
                              <span className="font-medium">
                                ${parseFloat(String(task.labor_cost)).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </TableCell>
                       
                        <TableCell className="px-4 py-3 text-start">
                          <div className="items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => navigate(`/service-tasks/${task.id}`)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => navigate(`/service-tasks/${task.id}/edit`)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(task.id)}
                              disabled={deletingId === task.id}
                              className="delete-button hover:scale-105 transition-all duration-300"
                              startIcon={<TrashBinIcon />}
                            >
                              {""}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
        </div>
      </div>
    </>
  );
}

