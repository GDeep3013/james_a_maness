import api from './api';

interface ServiceTaskData {
  name: string;
  description?: string;
  labor_cost?: number;
}

export const serviceTaskService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/service-tasks${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/service-tasks/${id}`),

  create: (data: ServiceTaskData) => {
    const formData = new FormData();
    
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.labor_cost !== undefined && data.labor_cost !== null) {
      formData.append('labor_cost', data.labor_cost.toString());
    }

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/service-tasks', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<ServiceTaskData>) => {
    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description || '');
    }
    if (data.labor_cost !== undefined && data.labor_cost !== null) {
      formData.append('labor_cost', data.labor_cost.toString());
    }

    formData.append('_method', 'PUT');

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post(`/service-tasks/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/service-tasks/${id}`),

  getForEdit: (id: number) =>
    api.get(`/service-tasks/${id}/edit`),
};

