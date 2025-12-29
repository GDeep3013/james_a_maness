import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { issueService } from "../../services/issueService";
import { getPriorityColor } from "../../utilites";

interface Issue {
  id: number;
  vehicle_id?: number;
  vehicle?: {
    vehicle_name?: string;
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
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
  created_at?: string;
}

interface ResolvedIssuesProps {
  workOrderId: number;
}

export default function ResolvedIssues({ workOrderId }: ResolvedIssuesProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchIssues = useCallback(async () => {
    if (!workOrderId) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await issueService.getAll({
        work_order_id: workOrderId,
        // status: "Resolved",
      });
      const data = response.data as {
        status: boolean;
        issues?: {
          data: Issue[];
          current_page: number;
          last_page: number;
          per_page: number;
          total: number;
        };
      };

      if (data.status && data.issues) {
        setIssues(data.issues.data || []);
      } else {
        setError("Failed to load resolved issues");
        setIssues([]);
      }
    } catch {
      setError("An error occurred while loading resolved issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [workOrderId]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Loading resolved issues...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-gray-500">No resolved issues found for this work order</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow className="bg-[#E5E7EB]">
              <TableCell isHeader>
                Issue ID
              </TableCell>
              <TableCell isHeader>
                Priority
              </TableCell>
              <TableCell isHeader>
                Summary
              </TableCell>
              <TableCell isHeader>
                Issue Status
              </TableCell>
              <TableCell isHeader>
                Source
              </TableCell>
              <TableCell isHeader>
                Reported Date
              </TableCell>
              <TableCell isHeader>
                Assigned
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="px-4 py-3 text-start">
                  <div className="text-theme-sm font-medium">
                    ISS-{issue.id}
                  </div>
                </TableCell>

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
                  <div className="text-gray-800 text-theme-sm dark:text-white/90">
                    {issue.summary || "—"}
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={getStatusColor(issue.status)}
                  >
                    {issue.status || "Resolved"}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

