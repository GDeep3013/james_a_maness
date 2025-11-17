export interface SelectOption {
  value: string;
  label: string;
}

export const PRIORITY_OPTIONS: SelectOption[] = [
  { value: "", label: "No Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const LABEL_OPTIONS: SelectOption[] = [
  { value: "", label: "Please select" },
  { value: "electrical", label: "Electrical" },
  { value: "mechanical", label: "Mechanical" },
  { value: "body", label: "Body" },
  { value: "engine", label: "Engine" },
  { value: "tires", label: "Tires" },
];

export const WORK_ORDER_STATUS_OPTIONS: SelectOption[] = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export const WORK_ORDER_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "All Status" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export const REPAIR_PRIORITY_CLASS_OPTIONS: SelectOption[] = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "Non-Scheduled", label: "Non-Scheduled" },
  { value: "Emergency", label: "Emergency" },
];

export const ISSUE_STATUS_OPTIONS: SelectOption[] = [
  { value: "Open", label: "Open" },
  { value: "Overdue", label: "Overdue" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

export const ISSUE_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "All Status" },
  { value: "Open", label: "Open" },
  { value: "Overdue", label: "Overdue" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

