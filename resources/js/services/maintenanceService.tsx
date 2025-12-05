import api from './api';

interface MaintenanceData {
  user_id?: number;
  exp_type_id?: number;
  vehicle_id?: number;
  vehicle_year?: string;
  vehicle_model?: string;
  vehicle_date?: string;
  maintenance_items?: Array<{
    maintenance_date?: string;
    maintenance_note?: string;
    performed_by?: string;
    validate_by?: string;
    total_amount?: number;
  }>;
}

export const maintenanceService = {
  getAll: (params?: { search?: string; page?: number; vehicle_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    const queryString = queryParams.toString();
    return api.get(`/maintenances${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/maintenances/${id}`),

  create: (data: MaintenanceData) => {
    return api.post('/maintenances', data);
  },

  update: (id: number, data: Partial<MaintenanceData>) => {
    return api.put(`/maintenances/${id}`, data);
  },

  delete: (id: number) => api.delete(`/maintenances/${id}`),

  getForEdit: (id: number) => api.get(`/maintenances/${id}/edit`),
};

