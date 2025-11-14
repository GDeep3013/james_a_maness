import api from './api';

interface IssueData {
  work_order_id?: number;
  vehicle_id: number;
  priority?: string;
  reported_date: string;
  reported_time?: string;
  summary: string;
  description?: string;
  labels?: string;
  primary_meter?: number;
  primary_meter_void?: boolean;
  reported_by?: string;
  assigned_to?: number;
  due_date?: string;
  primary_meter_due?: number;
  status?: 'Open' | 'Resolved' | 'Closed';
}

export const issueService = {
  getAll: (params?: { search?: string; page?: number; status?: string; work_order_id?: number; vehicle_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.work_order_id) queryParams.append('work_order_id', params.work_order_id.toString());
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

