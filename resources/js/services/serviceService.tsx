import api from './api';

interface ServiceData {
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
  service_items?: unknown[];
  parts?: unknown[];
}

export const serviceService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/services${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/services/${id}`),

  create: (data: ServiceData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (key === 'service_items' || key === 'parts') {
        return;
      }
      
      const value = data[key as keyof ServiceData];
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

    return api.post('/services', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<ServiceData>) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (key === 'service_items' || key === 'parts') {
        return;
      }
      
      const value = data[key as keyof ServiceData];
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

    return api.post(`/services/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/services/${id}`),

  getForEdit: (id: number) =>
    api.get(`/services/${id}/edit`),
};

