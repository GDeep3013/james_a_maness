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
import { fuelService } from "../../services/fuelService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";

interface Fuel {
  id: number;
  vehicle_id: number;
  vendor_id: number;
  fuel_type: number;
  unit_type: string;
  units: number;
  price_per_volume_unit: number;
  vehicle_meter: string;
  notes?: string;
  date: string;
  vehicle?: {
    id: number;
    name: string;
  };
  vendor?: {
    id: number;
    name: string;
  };
  fuel_type?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface FuelsResponse {
  status: boolean;
  fuel: {
    data: Fuel[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function FuelsList() {
  const navigate = useNavigate();
  const [fuels, setFuels] = useState<Fuel[]>([]);
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

  const fetchFuels = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await fuelService.getAll({ page, search });
      const data = response.data as FuelsResponse;
        console.log(data)
      if (data.status && data.fuel) {
        setFuels(data.fuel.data || []);
        setPagination({
          current_page: data.fuel.current_page,
          last_page: data.fuel.last_page,
          per_page: data.fuel.per_page,
          total: data.fuel.total,
        });
      } else {
        setError("Failed to load fuel entries");
        setFuels([]);
      }
    } catch {
      setError("An error occurred while loading fuel entries");
      setFuels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFuels(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchFuels]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFuels(1, searchTerm);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this fuel entry?")) {
      return;
    }

    setDeletingId(id);
    try {
      await fuelService.delete(id);
      fetchFuels(currentPage, searchTerm);
    } catch {
      alert("Failed to delete fuel entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/fuels/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/fuels/${id}`);
  };

  const handleExport = () => {
    //  Implement export functionality
  };

  const formatUnitType = (unitType: string) => {
    const unitTypes: Record<string, string> = {
      us_gallons: "US Gallons",
      liters: "Liters",
      uk_gallons: "UK Gallons",
    };
    return unitTypes[unitType] || unitType;
  };

  const calculateTotalCost = (units: number, pricePerUnit: number) => {
    return (units * pricePerUnit).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <p className="text-sm text-gray-700 dark:text-gray-400">
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
        title="Fuel Entries List"
        description="Manage and view all fuel entries"
      />

      <div className="space-y-6">
        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full max-w-full md:max-w-[70%]">
              <Input
                type="text"
                placeholder="Search by vehicle, vendor, fuel type, or meter reading..."
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
                    Loading fuel entries...
                  </p>
                </div>
              </div>
            ) : fuels.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No fuel entries found
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
                        Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Vehicle
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Vendor
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Fuel Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Price/Unit
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Total Cost
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Odometer
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
                    {fuels.map((fuel) => (
                      <TableRow key={fuel.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {formatDate(fuel.date)}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: {fuel.id}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {fuel.vehicle?.name || `Vehicle #${fuel.vehicle_id}`}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {fuel.vendor?.name || `Vendor #${fuel.vendor_id}`}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {fuel.fuel_type?.name || `#${fuel.fuel_type}`}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {fuel.units}
                            </div>
                            <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                              {formatUnitType(fuel.unit_type)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            ${Number(fuel.price_per_volume_unit).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="font-semibold text-brand-600 text-theme-sm dark:text-brand-400">
                            ${calculateTotalCost(fuel.units, fuel.price_per_volume_unit)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {fuel.vehicle_meter}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(fuel.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(fuel.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(fuel.id)}
                              disabled={deletingId === fuel.id}
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
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
