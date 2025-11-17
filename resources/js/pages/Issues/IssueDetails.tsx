import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { issueService } from "../../services/issueService";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { ChevronLeftIcon, PencilIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";

interface Issue {
  id: number;
  work_order_id?: number;
  vehicle_id?: number;
  vehicle?: {
    id?: number;
    vehicle_name?: string;
  };
  priority?: string;
  reported_date?: string;
  summary?: string;
  description?: string;
  labels?: string | string[];
  primary_meter?: number | string;
  primary_meter_void?: boolean;
  reported_by?: string;
  assigned_to?: number;
  assignedTo?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  due_date?: string;
  primary_meter_due?: number | string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  closed_date?: string;
  closed_by?: number;
  closedBy?: {
    id?: number;
    name?: string;
  };
  closed_note?: string;
}

export default function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isReopening, setIsReopening] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIssue(parseInt(id));
    }
  }, [id]);

  const fetchIssue = async (issueId: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await issueService.getById(issueId);
      const data = response.data as { status: boolean; issue?: Issue };

      if (data.status && data.issue) {
        setIssue(data.issue);
      } else {
        setError("Issue not found");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load issue");
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async () => {
    if (!issue || !window.confirm("Are you sure you want to reopen this issue?")) {
      return;
    }

    setIsReopening(true);
    try {
      await issueService.update(issue.id, { status: "Open" });
      await fetchIssue(issue.id);
    } catch {
      alert("Failed to reopen issue. Please try again.");
    } finally {
      setIsReopening(false);
    }
  };

  const handleEdit = () => {
    if (issue) {
      navigate(`/issues/${issue.id}/edit`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const dateStr = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${dateStr} ${timeStr}`;
    } catch {
      return dateString;
    }
  };

  const formatDateWithTime = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const dateStr = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${dateStr} at ${timeStr}`;
    } catch {
      return dateString;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
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

  const getPriorityDescription = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
      case "critical":
        return "Immediate action required";
      case "high":
        return "Address soon";
      case "medium":
        return "Does not impair function";
      case "low":
        return "Minor issue";
      default:
        return "";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <>
        <PageMeta title="Issue Details" description="View issue details" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading issue...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !issue) {
    return (
      <>
        <PageMeta title="Issue Details" description="View issue details" />
        <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-6">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error || "Issue not found"}</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate("/issues")}
              className="mt-4"
            >
              Back to List
            </Button>
          </div>
        </div>
      </>
    );
  }

  const isClosed = issue.status === "Closed";
  const assignedToName = issue.assignedTo
    ? `${issue.assignedTo.first_name || ""} ${issue.assignedTo.last_name || ""}`.trim()
    : null;
  const closedByName = issue.closedBy?.name || null;

  return (
    <>
      <PageMeta title={`${issue.summary || "Issue"} - Details`} description="View issue details" />

      <div className="space-y-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              className="py-2"
              onClick={() => navigate("/issues")}
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Issues</h1>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {issue.summary || `Issue #${issue.id}`}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isClosed && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleReopen}
                disabled={isReopening}
                className="min-height-[40px] !leading-[40px]"
                startIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                {isReopening ? "Reopening..." : "Reopen"}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All Fields</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue #
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{issue.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <div className="flex flex-col gap-1">
                  {issue.priority && issue.priority !== "" ? (
                    <>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize w-fit ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      {getPriorityDescription(issue.priority) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getPriorityDescription(issue.priority)}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Odometer
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {issue.primary_meter ? `${issue.primary_meter} mi` : "0 mi"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  {issue.status || "Open"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vehicle
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {issue.vehicle?.vehicle_name ? (
                    <>
                      <span className="text-sm text-blue-600 font-medium">
                        {issue.vehicle.vehicle_name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Sample
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <p className="text-sm text-gray-900 dark:text-white">—</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summary
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {issue.summary || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDateTime(issue.reported_date)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigned To
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {assignedToName || "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {issue.description || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported By
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {issue.reported_by || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(issue.due_date)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Odometer
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {issue.primary_meter_due ? `${issue.primary_meter_due} mi` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">Closed Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Closed Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {isClosed && (issue.closed_date || issue.updated_at)
                    ? formatDateWithTime(issue.closed_date || issue.updated_at)
                    : "—"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Closed By
                </label>
                {isClosed && closedByName ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5321B1] flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(closedByName)}
                    </div>
                    <span className="text-sm text-[#5321B1] font-medium">
                      {closedByName}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Note
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isClosed && issue.closed_note ? issue.closed_note : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 relative">
                {isClosed && closedByName && (
                  <div className="flex items-start gap-4 relative">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#5321B1] flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(closedByName)}
                      </div>
                      <div className="absolute left-1/2 top-8 w-0.5 h-6 bg-gray-200 transform -translate-x-1/2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{closedByName}</span> closed this issue
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateShort(issue.closed_date || issue.updated_at)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Issue Opened
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDateShort(issue.reported_date || issue.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

