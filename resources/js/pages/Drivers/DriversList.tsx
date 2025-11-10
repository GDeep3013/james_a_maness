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
import { driverService } from "../../services/driverService";

interface Driver {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  license_no?: string;
  license_class?: string;
  status?: string;
  user: {
    profile_picture: string;
  };
  designation?: string;
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface DriversResponse {
  status: boolean;
  driver: {
    data: Driver[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function DriversList() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
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

  const fetchDrivers = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await driverService.getAll({ page, search });
      const data = response.data as DriversResponse;
      
      if (data.status && data.driver) {
        setDrivers(data.driver.data || []);
        setPagination({
          current_page: data.driver.current_page,
          last_page: data.driver.last_page,
          per_page: data.driver.per_page,
          total: data.driver.total,
        });
      } else {
        setError("Failed to load drivers");
        setDrivers([]);
      }
    } catch {
      setError("An error occurred while loading drivers");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchDrivers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDrivers(1, searchTerm);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) {
      return;
    }

    setDeletingId(id);
    try {
      await driverService.delete(id);
      fetchDrivers(currentPage, searchTerm);
    } catch {
      alert("Failed to delete driver. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (id: number) => {
    navigate(`/drivers/${id}`);
  };

  const getFullName = (driver: Driver) => {
    return `${driver.first_name} ${driver.last_name || ""}`.trim();
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
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.last_page || loading}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
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
                className="rounded-r-none"
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
                  className="rounded-none border-l-0"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page || loading}
                className="rounded-l-none border-l-0"
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
        title="Drivers List"
        description="Manage and view all drivers"
      />

      <div className="space-y-6">
        <div className="flex gap-4 justify-end">
          <div className="w-full max-w-[400px]">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search drivers by name, email, phone, or license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                  <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-2.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>

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
                    Loading drivers...
                  </p>
                </div>
              </div>
            ) : drivers.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No drivers found
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
                        Driver
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Contact
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        License
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Designation
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
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <img
                                width={40}
                                height={40}
                                src={driver.user?.profile_picture}
                                alt={getFullName(driver)}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/user/user-default.png";
                                }}
                              />
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {getFullName(driver)}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                ID: {driver.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {driver.email}
                            </div>
                            <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                              {driver.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {driver.license_no || "N/A"}
                            </div>
                            {driver.license_class && (
                              <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                                {driver.license_class}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {driver.designation || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={
                              driver.status === "Active"
                                ? "success"
                                : driver.status === "Inactive"
                                ? "error"
                                : "warning"
                            }
                          >
                            {driver.status || "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(driver.id)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(driver.id)}
                              disabled={deletingId === driver.id}
                            >
                              {deletingId === driver.id ? "Deleting..." : "Delete"}
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