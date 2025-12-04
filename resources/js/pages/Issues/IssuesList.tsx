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
import { issueService } from "../../services/issueService";
import { LABEL_OPTIONS } from "../../constants/selectOptions";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";
import Select from "../../components/form/Select";
import { contactService } from "../../services/contactService";

interface Issue {
  id: number;
  vehicle_id?: number;
  vehicle?: {
    vehicle_name?: string;
  };
  status?: string;
  priority?: string;
  summary?: string;
  source?: string;
  issue_date?: string;
  reported_date?: string;
  assigned_to?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  labels?: string | string[];
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface IssuesResponse {
  status: boolean;
  issues?: {
    data: Issue[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface Contact {
  id: number;
  first_name: string;
  last_name?: string;
}

export default function IssuesList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Open" | "Overdue" | "Resolved" | "Closed">("All");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const activeFiltersCount = [
    assignedToFilter,
    labelFilter,
  ].filter(Boolean).length;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await contactService.getAll({});
        if (response.data?.status && response.data?.contact?.data) {
          setContacts(response.data.contact.data);
        }
      } catch {
        // Error fetching contacts, continue without them
      }
    };
    fetchContacts();
  }, []);

  const fetchIssues = useCallback(async (page: number = 1, search: string = "", status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await issueService.getAll({ page, search, status });
      const data = response.data as IssuesResponse;

      if (data.status && data.issues) {
        setIssues(data.issues.data || []);
        setPagination({
          current_page: data.issues.current_page,
          last_page: data.issues.last_page,
          per_page: data.issues.per_page,
          total: data.issues.total,
        });
      } else {
        setError("Failed to load issues");
        setIssues([]);
      }
    } catch {
      setError("An error occurred while loading issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const status = activeTab === "All" ? "" : activeTab;
    fetchIssues(currentPage, searchTerm, status);
  }, [currentPage, searchTerm, activeTab, fetchIssues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    const status = activeTab === "All" ? "" : activeTab;
    fetchIssues(1, searchTerm, status);
  };

  const handleView = (id: number) => {
    navigate(`/issues/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/issues/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    setDeletingId(id);
    try {
      await issueService.delete(id);
      const status = activeTab === "All" ? "" : activeTab;
      fetchIssues(currentPage, searchTerm, status);
    } catch {
      alert("Failed to delete issue. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = () => {
    navigate("/issues/create");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Open":
        return "error";
      case "Overdue":
        return "error";
      case "In Progress":
        return "warning";
      case "Resolved":
        return "info";
      case "Closed":
        return "warning";
      default:
        return "warning";
    }
  };

  const contactOptions = contacts.map(contact => ({
    value: contact.id.toString(),
    label: `${contact.first_name} ${contact.last_name || ""}`.trim()
  }));

  const labelOptions = LABEL_OPTIONS.filter(opt => opt.value !== "");

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
        title="Issues List"
        description="Manage and view all issues"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Issues</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
          >
            + Create Issue
          </Button>
        </div>

        <div className="border-b border-gray-200 dark:border-white/10">
          <nav className="flex space-x-4 md:space-x-8" aria-label="Tabs">
            {(["All", "Open", "Overdue", "Resolved", "Closed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-brand-500 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!bg-[#F3F3F5] dark:!bg-white/5 border-none !rounded-[8px] pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full sm:w-auto min-w-[180px]">
              <Select
                options={[{ value: "", label: "Issue Assigned To" }, ...contactOptions]}
                placeholder="Issue Assigned To"
                onChange={(value) => setAssignedToFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] dark:!bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>
            <div className="w-full sm:w-auto min-w-[150px]">
              <Select
                options={[{ value: "", label: "Labels" }, ...labelOptions]}
                placeholder="Labels"
                onChange={(value) => setLabelFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] dark:!bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="primary"
                size="sm"
                className="min-h-[44px] !leading-[44px]"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {activeFiltersCount} Filter{activeFiltersCount !== 1 ? 's' : ''}
              </Button>
            )}
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
                    Loading issues...
                  </p>
                </div>
              </div>
            ) : issues.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No issues found
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
                        Priority
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Issue
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Summary
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Issue Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Source
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Reported Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Assigned
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
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="px-4 py-3 text-start">
                          {issue.priority && issue.priority !== "" ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-brand-600 dark:text-brand-400 text-theme-sm font-medium">
                            {issue.vehicle?.vehicle_name || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm dark:text-white/90">
                            Vehicle
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-brand-600 dark:text-brand-400 text-theme-sm font-medium">
                            #{issue.id}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm dark:text-white/90">
                            {issue.summary || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(issue.status)}
                          >
                            {issue.status || "Open"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm dark:text-white/90">
                            {issue.source || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-gray-800 text-theme-sm dark:text-white/90">
                            {formatDate(issue.reported_date || issue.issue_date)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          {issue.assigned_to ? (
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {`${issue.assigned_to.first_name || ""} ${issue.assigned_to.last_name || ""}`.trim() || "—"}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-theme-sm">
                              —
                            </div>
                          )}
                        </TableCell>

                         <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(issue.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                             {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(issue.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                             {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(issue.id)}
                              disabled={deletingId === issue.id}
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
