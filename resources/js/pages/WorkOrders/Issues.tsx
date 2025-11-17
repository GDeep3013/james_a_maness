import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { issueService } from "../../services/issueService";
const AddIssue = lazy(() => import("./AddIssue"));

interface Issue {
  id: number;
  summary: string;
  description?: string;
  status: "Open" | "Resolved" | "Closed";
  created_at?: string;
  reported_date?: string;
  priority?: string;
  vehicle?: {
    vehicle_name?: string;
  };
  assigned_to?: {
    first_name?: string;
    last_name?: string;
  };
}

interface IssuesProps {
  workOrderId?: number;
  vehicleId?: number;
  vehicleName?: string;
}

export default function Issues({
  workOrderId,
  vehicleId,
  vehicleName,
}: IssuesProps) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"Open" | "Resolved" | "Closed">("Open");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const filteredIssues = issues.filter((issue) => issue.status === activeTab);

  const fetchIssues = useCallback(async () => {
    if(!vehicleId) {
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await issueService.getAll({
        vehicle_id: vehicleId,
        status: activeTab,
      });
      if (response.data?.status && response.data?.issues?.data) {
        setIssues(response.data.issues.data);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load issues");
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId, activeTab]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

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


  const handleAddIssue = () => {
    setSelectedIssueId(undefined);
    openModal();
  };

  const handleEditIssue = (id: number) => {
    setSelectedIssueId(id);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedIssueId(undefined);
  };

  const handleDeleteIssue = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }
    try {
      const response = await issueService.delete(id);
      if (response.data?.status === true || response.status === 200) {
        fetchIssues();
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  // Show empty card if no vehicle is selected
  if (!vehicleId) {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold text-gray-800">Issues</h2>
        <div className="h-[100px] flex items-center justify-center">
          <p className="text-gray-500">Please select a vehicle to view/add issues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Issues</h2>
        <Button
          variant="none"
          size="md"
          onClick={handleAddIssue}
          type="button"
        >
          + Add Issue
        </Button>
      </div>


      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={(e) => {e.preventDefault(); setActiveTab("Open")}}
            className={`py-4 px-1 h[20px] border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Open"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Open
          </button>
          <button
            onClick={(e) => {e.preventDefault(); setActiveTab("Resolved")}}
            className={`py-4 px-1 h[20px] border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Resolved"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={(e) => {e.preventDefault(); setActiveTab("Closed")}}
            className={`py-4 px-1 h[20px]  border-b-2 font-medium text-sm transition-colors ${
              activeTab === "Closed"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Closed
          </button>
        </nav>
      </div>

      <div className="min-h-[100px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-center">Loading issues...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-center">{getEmptyMessage()}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        { issue.summary}
                      </h3>
                      {issue.priority && issue.priority !== "" && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          {issue.priority}
                        </span>
                      )}
                    </div>
                    {issue.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {issue.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {issue.assigned_to && (
                        <span className="">
                          <span className="font-medium">Assigned:</span> {issue.assigned_to.first_name} {issue.assigned_to.last_name}
                        </span>
                      )}
                      {issue.reported_date && (
                        <span className="">
                          <span className="font-medium">Reported:</span> {new Date(issue.reported_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {e.preventDefault(); handleEditIssue(issue.id)}}
                      className="text-sm text-brand-600 hover:text-brand-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {e.preventDefault(); handleDeleteIssue(issue.id)}}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <Suspense fallback={<div>Loading...</div>}>
        <AddIssue
        isOpen={isOpen}
        onClose={handleCloseModal}
        workOrderId={workOrderId}
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        onSuccess={fetchIssues}
        issueId={selectedIssueId}
        />
      </Suspense>

    </div>
  );
}

