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
import { serviceReminderService } from "../../services/serviceReminderService";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface ServiceReminder {
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
  time_interval_value?: string;
  time_interval_unit?: string;
  time_due_soon_threshold_value?: string;
  time_due_soon_threshold_unit?: string;
  primary_meter_interval_value?: string;
  primary_meter_interval_unit?: string;
  primary_meter_due_soon_threshold_value?: string;
  primary_meter_due_soon_threshold_unit?: string;
  manually_set_next_reminder?: boolean;
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

interface ServiceRemindersResponse {
  status: boolean;
  service_reminders?: {
    data: ServiceReminder[];
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

export default function ServiceReminderList() {
  const navigate = useNavigate();
  const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
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

  const fetchServiceReminders = useCallback(async (page: number = 1, search: string = "", status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await serviceReminderService.getAll({ page, search, status });
      const data = response.data as ServiceRemindersResponse;

      if (data.status && data.service_reminders) {
        setServiceReminders(data.service_reminders.data || []);
        setPagination({
          current_page: data.service_reminders.current_page,
          last_page: data.service_reminders.last_page,
          per_page: data.service_reminders.per_page,
          total: data.service_reminders.total,
        });
      } else {
        setError("Failed to load service reminders");
        setServiceReminders([]);
      }
    } catch {
      setError("An error occurred while loading service reminders");
      setServiceReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceReminders(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchServiceReminders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServiceReminders(1, searchTerm, statusFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service reminder?")) {
      return;
    }

    setDeletingId(id);
    try {
      await serviceReminderService.delete(id);
      fetchServiceReminders(currentPage, searchTerm, statusFilter);
    } catch {
      alert("Failed to delete service reminder. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/service-reminders/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/service-reminders/${id}`);
  };

  const handleCreate = () => {
    navigate("/service-reminders/create");
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
        title="Service Reminders List"
        description="Manage and view all service reminders"
      />
      <PageBreadcrumb pageTitle="Service Reminders" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-2xl font-semibold text-gray-800">Service Reminders</h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
          >
            + Create Service Reminder
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 sm:max-w-[50%] max-w-[100%]">
              <Input
                type="text"
                placeholder="Search by vehicle, service task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full sm:max-w-[50%] md:max-w-[20%]">
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
          <div className="max-w-full overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading service reminders...
                  </p>
                </div>
              </div>
            ) : serviceReminders.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No service reminders found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell isHeader>
                        ID
                      </TableCell>
                      <TableCell isHeader >
                        Vehicle
                      </TableCell>
                      <TableCell isHeader >
                        Service Task
                      </TableCell>
                      <TableCell isHeader >
                        Time Interval
                      </TableCell>
                      <TableCell isHeader >
                        Meter Interval
                      </TableCell>
                      <TableCell isHeader >
                        Next Due Date
                      </TableCell>
                      <TableCell isHeader >
                        Status
                      </TableCell>
                      <TableCell isHeader >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100">
                    {serviceReminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm">
                            #{reminder.id}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {reminder.vehicle?.vehicle_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start w-[300px]">
                          <div className="text-gray-800 text-theme-sm">
                            {reminder.service_tasks && reminder.service_tasks.length > 0
                              ? reminder.service_tasks.map((task, index) => (
                                  <span key={task.id || index}>
                                    {task.name}
                                    {index < (reminder.service_tasks?.length ?? 0) - 1 && ", "}
                                  </span>
                                ))
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatInterval(reminder.time_interval_value, reminder.time_interval_unit)}
                          </div>
                          {reminder.time_due_soon_threshold_value && (
                            <div className="text-gray-500 text-theme-xs">
                              Due Soon: {reminder.time_due_soon_threshold_value} {reminder.time_due_soon_threshold_unit}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatInterval(reminder.primary_meter_interval_value, reminder.primary_meter_interval_unit)}
                          </div>
                          {reminder.primary_meter_due_soon_threshold_value && (
                            <div className="text-gray-500 text-theme-xs">
                              Due Soon: {reminder.primary_meter_due_soon_threshold_value} {reminder.primary_meter_due_soon_threshold_unit}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatDate(reminder.next_due_date)}
                          </div>
                          {reminder.next_due_meter && (
                            <div className="text-gray-500 text-theme-xs">
                              Meter: {reminder.next_due_meter}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(reminder.status)}
                          >
                            {reminder.status ? reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1) : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(reminder.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(reminder.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(reminder.id)}
                              disabled={deletingId === reminder.id}
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
                  itemLabel="service reminders"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

