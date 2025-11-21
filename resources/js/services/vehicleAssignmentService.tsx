import api from './api';

interface VehicleAssignmentData {
  contact_id?: number | null;
  vehicle_id?: number | null;
  event_title: string;
  start_date: string;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  full_day?: boolean;
  flag?: string | null;
}

export const vehicleAssignmentService = {
  getAll: (params?: { search?: string; page?: number; vehicle_id?: number; contact_id?: number; start_date?: string; month?: number; year?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    if (params?.contact_id) queryParams.append('contact_id', params.contact_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.year) queryParams.append('year', params.year.toString());
    const queryString = queryParams.toString();
    return api.get(`/vehicle-assignments${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/vehicle-assignments/${id}`),

  create: (data: VehicleAssignmentData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof VehicleAssignmentData];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
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

    return api.post('/vehicle-assignments', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<VehicleAssignmentData>) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof VehicleAssignmentData];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
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

    return api.post(`/vehicle-assignments/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/vehicle-assignments/${id}`),

  getForEdit: (id: number) =>
    api.get(`/vehicle-assignments/${id}/edit`),
};

