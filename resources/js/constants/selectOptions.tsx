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

export const WARRANTY_OPTIONS: SelectOption[] = [
  { value: "", label: "—" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "2Y", label: "2Y" },
  { value: "3Y", label: "3Y" },
  { value: "5Y", label: "5Y" },
  { value: "6Y", label: "6Y" },
  { value: "7Y", label: "7Y" },
  { value: "8Y", label: "8Y" },
  { value: "9Y", label: "9Y" },
  { value: "10Y", label: "10Y" },
  { value: "11Y", label: "11Y" },
  { value: "12Y", label: "12Y" },
  { value: "13Y", label: "13Y" },
  { value: "14Y", label: "14Y" },
  { value: "15Y", label: "15Y" },
];

export const TAX_OPTIONS: SelectOption[] = [
  { value: "Y", label: "Y" },
  { value: "N", label: "N" },
];

