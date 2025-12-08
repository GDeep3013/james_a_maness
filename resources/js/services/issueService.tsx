import api from './api';

interface IssueData {
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
}

export const issueService = {
  getAll: (params?: { search?: string; page?: number; status?: string , vehicle_id?: number}) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    const queryString = queryParams.toString();
    return api.get(`/issues${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/issues/${id}`),

  create: (data: IssueData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof IssueData];
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

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/issues', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<IssueData>) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof IssueData];
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

    formData.append('_method', 'PUT');

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post(`/issues/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/issues/${id}`),

  getForEdit: (id: number) =>
    api.get(`/issues/${id}/edit`),
};
