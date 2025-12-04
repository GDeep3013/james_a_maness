import { ServiceItem, Part, Vehicle, Vendor, LineItemsProps } from './workOrderTypes';

export interface ServiceFormData {
  vehicle_id: string;
  repair_priority_class: string;
  primary_meter: string;
  completion_date: string;
  set_start_date: boolean;
  start_date: string;
  vendor_id: string;
  service_items: ServiceItem[];
  parts: Part[];
  notes?: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  tax_type?: "percentage" | "fixed";
  tax_value?: number;
}

export interface ServiceLineItemsProps extends Omit<LineItemsProps, 'setFormData'> {
  setFormData?: React.Dispatch<React.SetStateAction<ServiceFormData>>;
}

export interface Service {
  id: number;
  user_id?: number;
  vehicle_id?: number;
  vendor_id?: number;
  repair_priority_class?: string;
  primary_meter?: number;
  completion_date?: string;
  set_start_date?: boolean;
  start_date?: string;
  notes?: string;
  discount_type?: string;
  discount_value?: number;
  tax_type?: string;
  tax_value?: number;
  labor_total?: number;
  parts_total?: number;
  subtotal?: number;
  discount_amount?: number;
  tax_amount?: number;
  total?: number;
  service_items?: ServiceItem[];
  parts?: Part[];
  created_at?: string;
  updated_at?: string;
  vehicle?: Vehicle;
  vendor?: Vendor;
}

export type { Vehicle, Vendor, ServiceItem, Part };

