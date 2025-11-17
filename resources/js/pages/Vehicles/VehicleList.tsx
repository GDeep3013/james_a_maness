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
import { vehicleService } from "../../services/vehicleService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import { formatVehicleIdentifier, formatMileage, formatDate } from "../../utils";

interface Vehicle {
  id: number;
  vehicle_name: string;
  type: string;
  vin?: string;
  license_plate?: string;
  fuel_type?: string;
  year?: string;
  make?: string;
  model?: string;
  current_mileage?: string;
  initial_status?: string;
  primary_location?: string;
  assigned_driver?: number;
  driver?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  next_service_date?: string;
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface VehiclesResponse {
  status: boolean;
  vehical: {
    data: Vehicle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function VehicleList() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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

  const fetchVehicles = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await vehicleService.getAll({ page, search });
      const data = response.data as VehiclesResponse;
      
      if (data.status && data.vehical) {
        setVehicles(data.vehical.data || []);
        setPagination({
          current_page: data.vehical.current_page,
          last_page: data.vehical.last_page,
          per_page: data.vehical.per_page,
          total: data.vehical.total,
        });
      } else {
        setError("Failed to load vehicles");
        setVehicles([]);
      }
    } catch {
      setError("An error occurred while loading vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchVehicles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVehicles(1, searchTerm);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    setDeletingId(id);
    try {
      await vehicleService.delete(id);
      fetchVehicles(currentPage, searchTerm);
    } catch {
      alert("Failed to delete vehicle. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/vehicles/${id}/edit`);
  };

  const handleView = (id: number) => {
    navigate(`/vehicles/${id}/VehicleDetail`);
  };

  const handleExport = () => {
    
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "maintenance":
        return "warning";
      case "inactive":
        return "error";
      case "available":
        return "info";
      default:
        return "light";
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderPagination = () => {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
    const endPage = Math.min(pagination.last_page, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="min-height-[34px] !leading-[34px]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.last_page || loading}
            className="min-height-[34px] !leading-[34px]"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {pagination.total === 0
                  ? 0
                  : (pagination.current_page - 1) * pagination.per_page + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="rounded-r-none min-height-[34px] !leading-[34px]"
              >
                Previous
              </Button>
              {pages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className="rounded-none border-l-0 min-height-[34px] !leading-[34px]"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page || loading}
                className="rounded-l-none border-l-0 min-height-[34px] !leading-[34px]"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Vehicles List"
        description="Manage and view all vehicles"
      />

      <div className="space-y-6">
        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 w-full max-w-full md:max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by ID, name, driver, or license plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800 w-full max-w-100 md:max-w-[10%] min-h-[44px] !leading-[44px]"
            >
              <ExportIcon />
              Export
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="max-w-full overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading vehicles...
                  </p>
                </div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No vehicles found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Vehicle ID
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Vehicle Details
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        VIN
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Make/Model/Year
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Driver
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Location
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Next Service
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {vehicles.map((vehicle) => {
                      const vehicleId = formatVehicleIdentifier(vehicle.type, vehicle.id);
                      
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                              {vehicleId || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                { vehicle.license_plate}
                              </div>
                              {
                                <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                  {vehicle.vehicle_name}
                                </div>
                              }
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <Badge
                              size="sm"
                              color={getStatusColor(vehicle.initial_status)}
                            >
                              {getStatusLabel(vehicle.initial_status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.vin || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {`${vehicle.make} - ${vehicle.model}`}
                              </div>
                              
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                {vehicle.year}
                              </div>
                              


                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.driver ? `${vehicle.driver.first_name || ""} ${vehicle.driver.last_name || ""}`.trim() : "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.primary_location || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.next_service_date ? formatDate(vehicle.next_service_date) : "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="none"
                                size="sm"
                                onClick={() => handleView(vehicle.id)}
                                className="view-button hover:scale-105 transition-all duration-300"
                                startIcon={<EyeIcon />}
                              >
                                {""}
                              </Button>
                              <Button
                                variant="none"
                                size="sm"
                                onClick={() => handleEdit(vehicle.id)}
                                className="edit-button hover:scale-105 transition-all duration-300"
                                startIcon={<PencilIcon />}
                              >
                                {""}
                              </Button>
                              <Button
                                variant="none"
                                size="sm"
                                onClick={() => handleDelete(vehicle.id)}
                                disabled={deletingId === vehicle.id}
                                className="delete-button hover:scale-105 transition-all duration-300"
                                startIcon={<TrashBinIcon />}
                              >
                                {""}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
