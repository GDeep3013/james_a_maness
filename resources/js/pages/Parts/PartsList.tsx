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
import Select from "../../components/form/Select";
import { partService } from "../../services/partService";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Part {
  id: number;
  part_name: string;
  part_code: string;
  description?: string;
  vehical_types?: string[];
  manufacturer_name?: string;
  unit_price?: number;
  purchase_price?: number;
  vendor_id?: number;
  vendor?: {
    id: number;
    name?: string;
    first_name?: string;
  };
  warranty_period_months?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PartsResponse {
  status: boolean;
  parts?: {
    data: Part[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function PartsList() {
  const navigate = useNavigate();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const fetchParts = useCallback(async (page: number = 1, search: string = "", status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await partService.getAll({ page, search, status });
      const data = response.data as PartsResponse;

      if (data.status && data.parts) {
        setParts(data.parts.data || []);
        setPagination({
          current_page: data.parts.current_page,
          last_page: data.parts.last_page,
          per_page: data.parts.per_page,
          total: data.parts.total,
        });
      } else {
        setError("Failed to load parts");
        setParts([]);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load parts");
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParts(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchParts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchParts(1, searchTerm, statusFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this part?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await partService.delete(id);
      if (response.data?.status === true || response.status === 200) {
        fetchParts(currentPage, searchTerm, statusFilter);
      } else {
        alert("Failed to delete part");
      }
    } catch {
      alert("Failed to delete part");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "warning";
      default:
        return "warning";
    }
  };

  const formatVehicleTypes = (types?: string[]) => {
    if (!types || types.length === 0) return "—";
    return types.join(", ");
  };

  const handleView = (id: number) => {
    navigate(`/parts/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/parts/${id}/edit`);
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
        title="Parts List"
        description="Manage and view all parts"
      />
     <PageBreadcrumb pageTitle="Parts" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800   ">Parts</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/parts/create")}
          >
            + Add Part
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 w-full max-w-full md:max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by part name, code, manufacturer, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] dark:!bg-white/5 max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full md:w-auto min-w-[180px]">
              <Select
                options={statusOptions}
                placeholder="Filter by status"
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                defaultValue={statusFilter}
                className="!bg-[#F3F3F5] dark:!bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600  ">
                    Loading parts...
                  </p>
                </div>
              </div>
            ) : parts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600  ">
                    No parts found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Part Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Part Code
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Description
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Vehicle Types
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Manufacturer
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Unit Price
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Purchase Price
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Vendor
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Warranty
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="font-semibold text-gray-900  text-theme-sm">
                            {part.part_name}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800  text-theme-sm font-mono">
                            {part.part_code}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {part.description ? (
                              part.description.length > 50
                                ? `${part.description.substring(0, 50)}...`
                                : part.description
                            ) : (
                              "—"
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatVehicleTypes(part.vehical_types)}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {part.manufacturer_name || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm    font-medium">
                            {part.unit_price !== undefined && part.unit_price !== null
                              ? `$${parseFloat(String(part.unit_price)).toFixed(2)}`
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm    font-medium">
                            {part.purchase_price !== undefined && part.purchase_price !== null
                              ? `$${parseFloat(String(part.purchase_price)).toFixed(2)}`
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm   ">
                            {part.vendor
                              ? part.vendor.name || part.vendor.first_name || `Vendor ${part.vendor.id}`
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {part.warranty_period_months ? part.warranty_period_months : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(part.status)}
                          >
                            {part.status || "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(part.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(part.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(part.id)}
                              disabled={deletingId === part.id}
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

