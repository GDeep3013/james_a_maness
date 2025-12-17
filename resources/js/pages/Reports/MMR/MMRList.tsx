import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import PageMeta from "../../../components/common/PageMeta";
import { mmrReportService } from "../../../services/mmrReportService";
import { ExportIcon, EyeIcon, PencilIcon, TrashBinIcon } from "../../../icons";
import TableFooter, { PaginationData } from "../../../components/common/TableFooter";
import { formatDate } from "../../../utilites";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

interface MMRReport {
  id: number;
  date?: string;
  domicile_station?: string;
  provider_company_name?: string;
  current_mileage?: string;
  vehicle_id?: number;
  vehicle?: {
    id?: number;
    vehicle_name?: string;
  };
  preventative_maintenance?: boolean;
  out_of_service?: boolean;
  signature?: string;
  completed_date?: string;
  user?: {
    id?: number;
    name?: string;
  };
  created_at?: string;
}

interface MMRReportsResponse {
  status: boolean;
  mmrReport: {
    data: MMRReport[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function MMRList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<MMRReport[]>([]);
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
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchReports = useCallback(async (page: number = 1, search: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await mmrReportService.getAll({ page, search });
      const data = response.data as MMRReportsResponse;

      if (data.status && data.mmrReport) {
        setReports(data.mmrReport.data || []);
        setPagination({
          current_page: data.mmrReport.current_page,
          last_page: data.mmrReport.last_page,
          per_page: data.mmrReport.per_page,
          total: data.mmrReport.total,
        });
      } else {
        setError("Failed to load MMR reports");
        setReports([]);
      }
    } catch {
      setError("An error occurred while loading MMR reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchReports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports(1, searchTerm);
  };

//   const handleView = (id: number) => {
//     navigate(`/reports/mmr/${id}`);
//   };

  const handleEdit = (id: number) => {
    navigate(`/reports/mmr/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this MMR report?")) {
      return;
    }

    setDeletingId(id);
    try {
      await mmrReportService.delete(id);
      fetchReports(currentPage, searchTerm);
    } catch {
      alert("Failed to delete MMR report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = () => {
    navigate("/reports/mmr/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const downloadMMRReport = async (id: number) => {
    setDownloadingId(id);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setDownloadingId(null);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/mmr-reports/${id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (response.status === 404) {
          setError('MMR report not found.');
        } else {
          setError('Failed to download MMR report.');
        }
        setDownloadingId(null);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MMR_Report_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setError('An error occurred while downloading the MMR report.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <PageMeta
        title="MMR Reports List"
        description="View and manage Monthly Maintenance Reports"
      />
     <PageBreadcrumb pageTitle="MMR Reports" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">MMR Reports</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
          >
            + Add MMR Report
          </Button>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 w-full max-w-full md:max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by vehicle, company name, domicile station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] dark:!bg-white/5 max-w-full border-none !rounded-[8px]"
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
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading MMR reports...
                  </p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No MMR reports found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell isHeader>
                        Date
                      </TableCell>
                      <TableCell isHeader>
                        Vehicle
                      </TableCell>
                      <TableCell isHeader>
                        Company Name
                      </TableCell>
                      <TableCell isHeader>
                        Domicile Station
                      </TableCell>
                      <TableCell isHeader>
                        Current Mileage
                      </TableCell>
                      <TableCell isHeader>
                        Completed Date
                      </TableCell>
                      <TableCell isHeader>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.date ? formatDate(report.date) : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.vehicle?.vehicle_name || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.provider_company_name || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.domicile_station || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.current_mileage || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-gray-800 text-theme-sm">
                            {report.completed_date ? formatDate(report.completed_date) : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="">

                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => downloadMMRReport(report.id)}
                              disabled={downloadingId === report.id}
                              className="hover:scale-105 transition-all duration-300"
                              startIcon={<ExportIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(report.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
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
                  itemLabel="MMR reports"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

