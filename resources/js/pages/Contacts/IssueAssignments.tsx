import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { issueService } from '../../services/issueService';
import Badge from "../../components/ui/badge/Badge";
import { formatTypeModel, getPriorityColor } from "../../utilites";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

interface IssueAssignmentsProps {
    contactId: number;
}

interface Issue {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        vehicle_name?: string;
        type?: string;
        make?: string;
        model?: string;
        year?: string | number;
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
    labels?: string | string[];
    created_at?: string;
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

export default function IssueAssignments({ contactId }: IssueAssignmentsProps) {
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const fetchIssues = useCallback(async () => {
        if (!contactId) return;
        
        setLoading(true);
        setError("");
        try {
            const response = await issueService.getAll({
                assignedToFilter: contactId.toString(),
            });
            const data = response.data as IssuesResponse;

            if (data.status && data.issues) {
                setIssues(data.issues.data || []);
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
    }, [contactId]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

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

    const handleIssueClick = (id: number) => {
        navigate(`/issues/${id}`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Loading issues...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                </div>
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        No issues assigned to this contact
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100">
                        <TableRow className="bg-[#E5E7EB]">
                            <TableCell isHeader>
                                Issue ID
                            </TableCell>
                            <TableCell isHeader>
                                Vehicle
                            </TableCell>
                            <TableCell isHeader>
                                Priority
                            </TableCell>
                            <TableCell isHeader>
                                Summary
                            </TableCell>
                            <TableCell isHeader>
                                Status
                            </TableCell>
                            <TableCell isHeader>
                                Reported Date
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100">
                        {issues.map((issue) => (
                            <TableRow key={issue.id}>
                                <TableCell className="px-4 py-3 text-start">
                                    <button
                                        onClick={() => handleIssueClick(issue.id)}
                                        className="text-theme-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                                    >
                                        ISS-{issue.id}
                                    </button>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-brand-600 dark:text-brand-400 text-theme-sm font-medium">
                                        {formatTypeModel(issue.vehicle)}
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
                                        {issue.status || "Open"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                        {formatDate(issue.reported_date || issue.issue_date)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

