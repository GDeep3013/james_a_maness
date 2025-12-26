import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { issueService } from "../../services/issueService";

interface Issue {
  id: number;
  summary: string;
  description?: string;
  status: "Open" | "Resolved" | "Closed";
  priority?: string;
  reported_date?: string;
  vehicle?: {
    vehicle_name?: string;
  };
  assigned_to?: {
    first_name?: string;
    last_name?: string;
  };
}

interface SelectIssuesListProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId?: number;
  vehicleId?: number;
  vehicleName?: string;
  onSuccess?: () => void;
}

export default function SelectIssuesList({
  isOpen,
  onClose,
  workOrderId,
  vehicleId,
  vehicleName,
  onSuccess,
}: SelectIssuesListProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchIssues = useCallback(async () => {
    if (!vehicleId || !isOpen) {
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await issueService.getAll({
        vehicle_id: vehicleId,
        work_order_id_null: true,
      });
      if (response.data?.status && response.data?.issues?.data) {
        setIssues(response.data.issues.data);
      } else {
        setIssues([]);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load issues");
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchIssues();
      setSelectedIssues([]);
      setError("");
      setSuccessMessage("");
    }
  }, [isOpen, fetchIssues]);

  const handleToggleIssue = (issueId: number) => {
    setSelectedIssues((prev) => {
      if (prev.includes(issueId)) {
        return prev.filter((id) => id !== issueId);
      } else {
        return [...prev, issueId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIssues.length === issues.length) {
      setSelectedIssues([]);
    } else {
      setSelectedIssues(issues.map((issue) => issue.id));
    }
  };

  const handleAddIssues = async () => {
    if (!workOrderId || selectedIssues.length === 0) {
      setError("Please select at least one issue to add");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await issueService.assignToWorkOrder(selectedIssues, workOrderId);
      setSuccessMessage(`${selectedIssues.length} issue(s) assigned successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        setSelectedIssues([]);
        fetchIssues();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to assign issues. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicleId) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl m-4">
      <div className="no-scrollbar relative w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Select Issues
          </h2>
          {vehicleName && (
            <p className="text-sm text-gray-600 mt-1">
              Vehicle: {vehicleName}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={issues.length > 0 && selectedIssues.length === issues.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
              Select All ({selectedIssues.length} selected)
            </label>
          </div>
        </div>

        <div className="custom-scrollbar max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-center">Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-center">
                No unassigned issues found for this vehicle.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedIssues.includes(issue.id)
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue.id)}
                      onChange={() => handleToggleIssue(issue.id)}
                      className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {issue.summary}
                        </h3>
                        {issue.priority && issue.priority !== "" && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                            {issue.priority}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          issue.status === "Open"
                            ? "bg-green-100 text-green-700"
                            : issue.status === "Resolved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      {issue.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {issue.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {issue.assigned_to && (
                          <span>
                            <span className="font-medium">Assigned:</span>{" "}
                            {issue.assigned_to.first_name}{" "}
                            {issue.assigned_to.last_name}
                          </span>
                        )}
                        {issue.reported_date && (
                          <span>
                            <span className="font-medium">Reported:</span>{" "}
                            {new Date(issue.reported_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || selectedIssues.length === 0}
            onClick={handleAddIssues}
          >
            {isSubmitting
              ? "Adding..."
              : `Add ${selectedIssues.length > 0 ? `(${selectedIssues.length})` : ""}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
