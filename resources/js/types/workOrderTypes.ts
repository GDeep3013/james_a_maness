export interface ServiceItem {
  id?: number;
  name?: string;
  description?: string;
  type?: "Service Tasks" | "Parts" | string;
  quantity?: number;
  total?: number;
  labor_cost?: number;
  created_at?: string;
  label?: string;
  value?: string;
}

export interface Part {
  id: number;
  part_name: string;
  part_code?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  purchase_price?: number;
  total?: number;
  value?: string;
  label?: string;
  warranty_period_months?: number;
  created_at?: string;
}

export interface WorkOrderFormData {
  vehicle_id: string;
  status: string;
  repair_priority_class: string;
  issue_date: string;
  scheduled_start_date: string;
  send_scheduled_start_date_reminder: boolean;
  actual_start_date: string;
  expected_completion_date: string;
  actual_completion_date: string;
  use_start_odometer_for_completion_meter: boolean;
  assigned_to: string;
  vendor_id: string;
  invoice_number: string;
  po_number: string;
  service_items: ServiceItem[];
  parts: Part[];
  notes?: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  base_value?: number;
  total_value?: number;
  tax_type?: "percentage" | "fixed";
  tax_value?: number;
}

export interface Vehicle {
  id: number;
  vehicle_name: string;
  current_mileage?: string | number;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Vendor {
  id: number;
  name: string;
  company_contact?: string;
}

export interface LineItemsProps {
  setFormData?: React.Dispatch<React.SetStateAction<WorkOrderFormData>>;
  serviceItems?: ServiceItem[];
  parts?: Part[];
  onDeleteLineItem?: (lineItemId: number) => void;
}

export interface ServiceTasksProps {
  selectedTasks: ServiceItem[];
  setSelectedTasks: (tasks: ServiceItem[]) => void;
  onDeleteTask?: (taskId: number) => void;
}

export interface PartsProps {
  selectedParts: Part[];
  setSelectedParts: (parts: Part[]) => void;
  onDeletePart?: (partId: number) => void;
}

export interface NotesProps {
  notes?: string;
  setNotes?: (notes: string) => void;
  serviceItems?: ServiceItem[];
  parts?: Part[];
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  taxType?: "percentage" | "fixed";
  taxValue?: number;
  setDiscountType?: (type: "percentage" | "fixed") => void;
  setDiscountValue?: (value: number) => void;
  setTaxType?: (type: "percentage" | "fixed") => void;
  setTaxValue?: (value: number) => void;
}

export interface WorkOrder {
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
  user?: {
    id?: number;
    name?: string;
  };
  status?: string;
  repair_priority_class?: string;
  issue_date?: string;
  scheduled_start_date?: string;
  actual_start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  send_scheduled_start_date_reminder?: boolean;
  assigned_to?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  vendor_id?: number;
  vendor?: {
    name?: string;
    company_contact?: string;
  };
  invoice_number?: string;
  po_number?: string;
  service_items?: ServiceItem[] | string;
  parts?: Part[] | string;
  notes?: string;
  created_at?: string;
}

export interface WorkOrdersResponse {
  status: boolean;
  work_orders?: {
    data: WorkOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}