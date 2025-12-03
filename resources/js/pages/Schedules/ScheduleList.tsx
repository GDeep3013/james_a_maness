import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { scheduleService } from "../../services/scheduleService";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface Schedule {
  id: number;
  vehicle_id?: number;
  vehicle?: {
    id?: number;
    vehicle_name?: string;
  };
  service_task_ids?: number[];
  service_tasks?: Array<{
    id?: number;
    name?: string;
  }>;
  primary_meter_due_soon_threshold_unit?: string;
  notifications_enabled?: boolean;
  watchers?: number[];
  next_due_date?: string;
  next_due_meter?: string;
  last_completed_date?: string;
  last_completed_meter?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface SchedulesResponse {
  status: boolean;
  schedules?: {
    data: Schedule[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "completed", label: "Completed" },
];

export default function ScheduleList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSchedules = useCallback(async (page: number = 1, search: string = "", status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await scheduleService.getAll({ page, search, status });
      const data = response.data as SchedulesResponse;
      
      if (data.status && data.schedules) {
        setSchedules(data.schedules.data || []);
        setPagination({
          current_page: data.schedules.current_page,
          last_page: data.schedules.last_page,
          per_page: data.schedules.per_page,
          total: data.schedules.total,
        });
      } else {
        setError("Failed to load schedules");
        setSchedules([]);
      }
    } catch {
      setError("An error occurred while loading schedules");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchSchedules]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchedules(1, searchTerm, statusFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    setDeletingId(id);
    try {
      await scheduleService.delete(id);
      fetchSchedules(currentPage, searchTerm, statusFilter);
    } catch {
      alert("Failed to delete schedule. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/schedules/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/schedules/${id}`);
  };

  const handleCreate = () => {
    navigate("/schedules/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "completed":
        return "info";
      default:
        return "warning";
    }
  };

  const formatInterval = (value?: string, unit?: string) => {
    if (!value || !unit) return "N/A";
    return `Every ${value} ${unit}`;
  };

  return (
    <>
      <PageMeta
        title="Schedules List"
        description="Manage and view all schedules"
      />
      <PageBreadcrumb pageTitle="Schedules" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Schedules</h1>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
          >
            + Create Schedule
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by vehicle, service task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full max-w-[20%]">
              <Select
                options={STATUS_FILTER_OPTIONS}
                placeholder="All Status"
                onChange={(value) => setStatusFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] border-gray-200"
              />
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading schedules...
                  </p>
                </div>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No schedules found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        ID
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Vehicle
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Service Task
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Meter Interval
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Next Due Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100">
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm">
                            #{schedule.id}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {schedule.vehicle?.vehicle_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {schedule.service_tasks && schedule.service_tasks.length > 0
                              ? schedule.service_tasks.map((task, index) => (
                                  <span key={task.id || index}>
                                    {task.name}
                                    {index < (schedule.service_tasks?.length ?? 0) - 1 && ", "}
                                  </span>
                                ))
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            N/A
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatDate(schedule.next_due_date)}
                          </div>
                          {schedule.next_due_meter && (
                            <div className="text-gray-500 text-theme-xs">
                              Meter: {schedule.next_due_meter}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(schedule.status)}
                          >
                            {schedule.status ? schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1) : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(schedule.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(schedule.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                              disabled={deletingId === schedule.id}
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
                  itemLabel="schedules"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

