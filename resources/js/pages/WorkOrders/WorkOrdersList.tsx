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
import { workOrderService } from "../../services/workOrderService";
import { WORK_ORDER_STATUS_FILTER_OPTIONS } from "../../constants/selectOptions";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import Select from "../../components/form/Select";

interface WorkOrder {
  id: number;
  vehicle_id?: number;
  vehicle?: {
    vehicle_name?: string;
  };
  status?: string;
  repair_priority_class?: string;
  issue_date?: string;
  issued_by?: string;
  scheduled_start_date?: string;
  actual_start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  assigned_to?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  vendor_id?: number;
  vendor?: {
    first_name?: string;
    company_contact?: string;
  };
  invoice_number?: string;
  po_number?: string;
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface WorkOrdersResponse {
  status: boolean;
  work_orders?: {
    data: WorkOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function WorkOrdersList() {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
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

  const fetchWorkOrders = useCallback(async (page: number = 1, search: string = "", status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await workOrderService.getAll({ page, search, status });
      const data = response.data as WorkOrdersResponse;
      
      if (data.status && data.work_orders) {
        setWorkOrders(data.work_orders.data || []);
        setPagination({
          current_page: data.work_orders.current_page,
          last_page: data.work_orders.last_page,
          per_page: data.work_orders.per_page,
          total: data.work_orders.total,
        });
      } else {
        setError("Failed to load work orders");
        setWorkOrders([]);
      }
    } catch {
      setError("An error occurred while loading work orders");
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchWorkOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchWorkOrders(1, searchTerm, statusFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this work order?")) {
      return;
    }

    setDeletingId(id);
    try {
      await workOrderService.delete(id);
      fetchWorkOrders(currentPage, searchTerm, statusFilter);
    } catch {
      alert("Failed to delete work order. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/work-orders/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/work-orders/${id}`);
  };

  const handleCreate = () => {
    navigate("/work-orders/create");
  };

  const handleExport = () => {
    
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
    switch (status) {
      case "Open":
        return "warning";
      case "In Progress":
        return "info";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "warning";
    }
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
        title="Work Orders List"
        description="Manage and view all work orders"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Work Orders</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
          >
            + Create Work Order
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by vehicle, invoice number, PO number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full max-w-[20%]">
              <Select
                options={WORK_ORDER_STATUS_FILTER_OPTIONS}
                placeholder="All Status"
                onChange={(value) => setStatusFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-gray-50 border-gray-200 hover:bg-gray-100 w-full max-w-[10%] min-h-[44px] !leading-[44px]"
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
                    Loading work orders...
                  </p>
                </div>
              </div>
            ) : workOrders.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No work orders found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell
                        isHeader
                      >
                        Work Order ID
                      </TableCell>
                      <TableCell
                        isHeader
                      >
                        Vehicle
                      </TableCell>
                      <TableCell
                        isHeader
                     >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                      >
                        Issue Date
                      </TableCell>
                      <TableCell
                        isHeader
                      >
                        Assigned To
                      </TableCell>
                      <TableCell
                        isHeader
                      >
                        Invoice/PO
                      </TableCell>
                      <TableCell
                        isHeader
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100">
                    {workOrders.map((workOrder) => (
                      <TableRow key={workOrder.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm">
                                WO-{workOrder.id}
                              </span>
                              {workOrder.repair_priority_class && (
                                <span className="block text-gray-500 text-theme-xs">
                                  {workOrder.repair_priority_class}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {workOrder.vehicle?.vehicle_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(workOrder.status)}
                          >
                            {workOrder.status || "Open"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatDate(workOrder.issue_date)}
                          </div>
                          {workOrder.issued_by && (
                            <div className="text-gray-500 text-theme-xs">
                              By: {workOrder.issued_by}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          {workOrder.assigned_to ? (
                            <div className="text-gray-800 text-theme-sm">
                              {`${workOrder.assigned_to.first_name || ""} ${workOrder.assigned_to.last_name || ""}`.trim() || "N/A"}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-theme-sm">
                              N/A
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            {workOrder.invoice_number && (
                              <div className="text-gray-800 text-theme-sm">
                                Invoice: {workOrder.invoice_number}
                              </div>
                            )}
                            {workOrder.po_number && (
                              <div className="text-gray-500 text-theme-xs">
                                PO: {workOrder.po_number}
                              </div>
                            )}
                            {!workOrder.invoice_number && !workOrder.po_number && (
                              <div className="text-gray-500 text-theme-sm">
                                N/A
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(workOrder.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(workOrder.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(workOrder.id)}
                              disabled={deletingId === workOrder.id}
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

