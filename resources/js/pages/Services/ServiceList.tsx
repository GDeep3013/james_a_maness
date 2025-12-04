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
import PageMeta from "../../components/common/PageMeta";
import { serviceService } from "../../services/serviceService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface Service {
  id: number;
  vehicle_id?: number;
  vehicle?: {
    vehicle_name?: string;
  };
  vendor_id?: number;
  vendor?: {
    name?: string;
  };
  repair_priority_class?: string;
  primary_meter?: number;
  completion_date?: string;
  start_date?: string;
  created_at?: string;
}

interface ServicesResponse {
  status: boolean;
  services?: {
    data: Service[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ServiceList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
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

  const fetchServices = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await serviceService.getAll({ page, search });
      const data = response.data as ServicesResponse;

      if (data.status && data.services) {
        setServices(data.services.data || []);
        setPagination({
          current_page: data.services.current_page,
          last_page: data.services.last_page,
          per_page: data.services.per_page,
          total: data.services.total,
        });
      } else {
        setError("Failed to load services");
        setServices([]);
      }
    } catch {
      setError("An error occurred while loading services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchServices]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServices(1, searchTerm);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setDeletingId(id);
    try {
      await serviceService.delete(id);
      fetchServices(currentPage, searchTerm);
    } catch {
      alert("Failed to delete service. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/services/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/services/${id}`);
  };

  const handleCreate = () => {
    navigate("/services/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {

  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getPriorityClassColor = (priority?: string) => {
    switch (priority) {
      case "Scheduled":
        return "success";
      case "Non-Scheduled":
        return "warning";
      case "Emergency":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <>
      <PageMeta
        title="Services List"
        description="Manage and view all services"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base md:text-2xl font-semibold text-gray-800">Services</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
          >
            + Create Service
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 sm:max-w-[50%] max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by vehicle, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-gray-50 border-gray-200 hover:bg-gray-100 w- sm:max-w-[50%] md:max-w-[10%] min-h-[44px] !leading-[44px]"
            >
              <ExportIcon />
              Export
            </Button>
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
                    Loading services...
                  </p>
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No services found
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
                        Service ID
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
                        Repair Priority Class
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Primary Meter
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Completion Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                      >
                        Vendor
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
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm">
                                SVC-{service.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {service.vehicle?.vehicle_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          {service.repair_priority_class ? (
                            <Badge
                              size="sm"
                              color={getPriorityClassColor(service.repair_priority_class)}
                            >
                              {service.repair_priority_class}
                            </Badge>
                          ) : (
                            <div className="text-gray-500 text-theme-sm">N/A</div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {service.primary_meter !== null && service.primary_meter !== undefined
                              ? `${service.primary_meter} hr`
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatDateTime(service.completion_date)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {service.vendor?.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(service.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(service.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(service.id)}
                              disabled={deletingId === service.id}
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
                  itemLabel="services"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

