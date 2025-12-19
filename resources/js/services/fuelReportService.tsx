import api from './api';

interface FuelReportFormData {
  vehicle_id: number;
  vendor_id?: number;
  start_date?: string;
  end_date?: string;
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
    // line: string;
    vehicle_name: string;
    fuel_type: string;
    meter_reading: string;
    unit_type: string;
    unit: string;
    tax: string;
    per_unit_price: number;
    net: number;
    // extended: number;
  }>;
  sub_total?: number;
  sales_tax?: number;
  payment_method?: string;
  payment_reference?: string;
}

export const fuelReportService = {
  getAll: (params?: { search?: string; page?: number; vehicle_id?: number; start_date?: string; end_date?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    // if (params?.fuel_type) queryParams.append('start_date', params.fuel_type);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    const queryString = queryParams.toString();
    return api.get(`/fuel-reports${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/fuel-reports/${id}`),

  create: (data: FuelReportFormData) => {
    return api.post('/fuel-reports', data);
  },

  update: (id: number, data: Partial<FuelReportFormData>) => {
    return api.put(`/fuel-reports/${id}`, data);
  },

  delete: (id: number) => api.delete(`/fuel-reports/${id}`),

  getForEdit: (id: number) => api.get(`/fuel-reports/${id}/edit`),
};
