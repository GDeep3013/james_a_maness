import api from './api';
interface MaintenanceRecordFormData {
  vehicle_id: number;
  vendor_id?: number;
  actual_start_date?: string;
  actual_completion_date?: string;
  service_items?: Array<{
    id: number;
    name: string;
    labor_cost?: number;
  }>;
  total_value?: number;
  invoice_number?: string;
  po_number?: string;
  counter_number?: string;
  customer_account?: string;
  ordered_by?: string;
  special_instructions?: string;
  sale_type?: string;
  date?: string;
  ship_via?: string;
  line_items?: Array<{
    qty: number;
    line: string;
    item_number: string;
    description: string;
    warr: string;
    unit: string;
    tax: string;
    list: number;
    net: number;
    extended: number;
  }>;
  sub_total?: number;
  sales_tax?: number;
  payment_method?: string;
  payment_reference?: string;
}

export const maintenanceRecordService = {
  getAll: (params?: { search?: string; page?: number; vehicle_id?: number; actual_start_date?: string; actual_completion_date?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    if (params?.actual_start_date) queryParams.append('actual_start_date', params.actual_start_date);
    if (params?.actual_completion_date) queryParams.append('actual_completion_date', params.actual_completion_date);
    const queryString = queryParams.toString();
    return api.get(`/maintenance-records${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/maintenance-records/${id}`),

  create: (data: MaintenanceRecordFormData) => {
    return api.post('/maintenance-records', data);
  },

  update: (id: number, data: Partial<MaintenanceRecordFormData>) => {
    return api.put(`/maintenance-records/${id}`, data);
  },

  delete: (id: number) => api.delete(`/maintenance-records/${id}`),

  getForEdit: (id: number) => api.get(`/maintenance-records/${id}/edit`),
};
