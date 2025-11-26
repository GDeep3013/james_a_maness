import api from './api';

interface WorkOrderData {
  user_id?: number;
  vehicle_id?: number;
  status?: string;
  repair_priority_class?: string;
  issue_date?: string;
  issued_by?: string;
  scheduled_start_date?: string;
  send_scheduled_start_date_reminder?: boolean;
  actual_start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  use_start_odometer_for_completion_meter?: boolean;
  assigned_to?: number;
  labels?: string[] | string;
  vendor_id?: number;
  invoice_number?: string;
  po_number?: string;
  service_items?: unknown[];
  parts?: unknown[];
}

export const workOrderService = {
    getAll: (params?: { search?: string; page?: number; status?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.status) queryParams.append('status', params.status);
        const queryString = queryParams.toString();
        return api.get(`/work-orders${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id: number) =>
        api.get(`/work-orders/${id}`),

    create: (data: WorkOrderData) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'service_items' || key === 'parts') {
                return;
            }

            const value = data[key as keyof WorkOrderData];
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        if (data.service_items !== undefined) {
            formData.append('service_items', JSON.stringify(data.service_items || []));
        }
        if (data.parts !== undefined) {
            formData.append('parts', JSON.stringify(data.parts || []));
        }

        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return api.post('/work-orders', formData, {
            headers,
        });
    },

    update: (id: number, data: Partial<WorkOrderData>) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'service_items' || key === 'parts') {
                return;
            }

            const value = data[key as keyof WorkOrderData];
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        if (data.service_items !== undefined) {
            formData.append('service_items', JSON.stringify(data.service_items || []));
        }
        if (data.parts !== undefined) {
            formData.append('parts', JSON.stringify(data.parts || []));
        }

        formData.append('_method', 'PUT');

        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return api.post(`/work-orders/${id}`, formData, {
            headers,
        });
    },

    delete: (id: number) =>
        api.delete(`/work-orders/${id}`),

    getForEdit: (id: number) =>
        api.get(`/work-orders/${id}/edit`),
    getAllDashboard: () => { return api.get(`/get-dashboard-workorder`)}
};

