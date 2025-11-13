import React, { useState } from "react";
import Button from "../../components/ui/button/Button";

interface Issue {
  id: number;
  title: string;
  description?: string;
  status: "Open" | "Resolved" | "Closed";
  created_at?: string;
}

interface IssuesProps {
  workOrderId?: number;
  issues?: Issue[];
  onAddIssue?: () => void;
  onEditIssue?: (issueId: number) => void;
  onDeleteIssue?: (issueId: number) => void;
}

export default function Issues({
  workOrderId,
  issues = [],
  onAddIssue,
  onEditIssue,
  onDeleteIssue,
}: IssuesProps) {
  const [activeTab, setActiveTab] = useState<"Open" | "Resolved" | "Closed">("Closed");

  const filteredIssues = issues.filter((issue) => issue.status === activeTab);

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "Open":
        return "No Open Issues.";
      case "Resolved":
        return "No Resolved Issues.";
      case "Closed":
        return "No Closed Issues.";
      default:
        return "No Issues.";
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Issues</h2>
        {onAddIssue && (
          <Button
            variant="none"
            size="md"
            onClick={onAddIssue}
          >
            + Add Issue
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("Open")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Open"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveTab("Resolved")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Resolved"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setActiveTab("Closed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Closed"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Closed
          </button>
        </nav>
      </div>

      <div className="min-h-[100px]">
        {filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center">{getEmptyMessage()}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">
                      {issue.title}
                    </h3>
                    {issue.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {issue.description}
                      </p>
                    )}
                    {issue.created_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created: {new Date(issue.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onEditIssue && (
                      <button
                        onClick={() => onEditIssue(issue.id)}
                        className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        Edit
                      </button>
                    )}
                    {onDeleteIssue && (
                      <button
                        onClick={() => onDeleteIssue(issue.id)}
                        className="text-sm text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

