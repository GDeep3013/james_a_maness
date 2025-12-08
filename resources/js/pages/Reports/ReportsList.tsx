import React, { useState, useEffect, useCallback } from "react";
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
import { reportService } from "../../services/reportService";
import { ExportIcon, EyeIcon, TrashBinIcon } from "../../icons";
import Select from "../../components/form/Select";
import TableFooter, { PaginationData } from "../../components/common/TableFooter";

interface Report {
  id: number;
  report_type?: string;
  report_name?: string;
  generated_date?: string;
  status?: string;
  file_url?: string;
  created_by?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  created_at?: string;
}

interface ReportsResponse {
  status: boolean;
  reports?: {
    data: Report[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReports = useCallback(async (page: number = 1, search: string = "", status: string = "", reportType: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await reportService.getAll({ page, search, status, report_type: reportType });
      const data = response.data as ReportsResponse;

      if (data.status && data.reports) {
        setReports(data.reports.data || []);
        setPagination({
          current_page: data.reports.current_page,
          last_page: data.reports.last_page,
          per_page: data.reports.per_page,
          total: data.reports.total,
        });
      } else {
        setReports([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        });
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404 || error.response?.status === 500) {
        setReports([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        });
      } else {
        setError("An error occurred while loading reports");
        setReports([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(currentPage, searchTerm, statusFilter, typeFilter);
  }, [currentPage, searchTerm, statusFilter, typeFilter, fetchReports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports(1, searchTerm, statusFilter, typeFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    setDeletingId(id);
    try {
      await reportService.delete(id);
      fetchReports(currentPage, searchTerm, statusFilter, typeFilter);
    } catch {
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await reportService.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download report. Please try again.");
    }
  };

  const handleExport = () => {
    // Export functionality can be implemented here
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
      case "Completed":
        return "success";
      case "Generating":
        return "info";
      case "Failed":
        return "error";
      default:
        return "warning";
    }
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Completed", label: "Completed" },
    { value: "Generating", label: "Generating" },
    { value: "Failed", label: "Failed" },
  ];

  const reportTypeOptions = [
    { value: "", label: "All Types" },
    { value: "maintenance", label: "Maintenance" },
    { value: "fuel", label: "Fuel" },
    { value: "expense", label: "Expense" },
    { value: "vehicle", label: "Vehicle" },
    { value: "work_order", label: "Work Order" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <PageMeta
        title="Reports List"
        description="View and manage all reports"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          </div>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 md:max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by report name, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full sm:max-w-[50%] md:max-w-[20%]">
              <Select
                options={reportTypeOptions}
                placeholder="All Types"
                onChange={(value) => setTypeFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] border-gray-200"
              />
            </div>
            <div className="w-full sm:max-w-[50%] md:max-w-[20%]">
              <Select
                options={statusOptions}
                placeholder="All Status"
                onChange={(value) => setStatusFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-gray-50 border-gray-200 hover:bg-gray-100 w-full sm:max-w-[50%] md:max-w-[10%] min-h-[44px] !leading-[44px]"
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
                    Loading reports...
                  </p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    No reports found
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
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Report Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Generated Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Created By
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm">
                                {report.report_name || `Report #${report.id}`}
                              </span>
                              {report.report_type && (
                                <span className="block text-gray-500 text-theme-xs">
                                  {report.report_type}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm capitalize">
                            {report.report_type || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(report.status)}
                          >
                            {report.status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm">
                            {formatDate(report.generated_date || report.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          {report.created_by ? (
                            <div className="text-gray-800 text-theme-sm">
                              {`${report.created_by.first_name || ""} ${report.created_by.last_name || ""}`.trim() || "N/A"}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-theme-sm">
                              N/A
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(report.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                              disabled={deletingId === report.id}
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
                  itemLabel="reports"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

