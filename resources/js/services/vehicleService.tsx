import api from './api';

interface VehicleData {
  vehicle_name?: string;
  vin_sn?: string;
  license_plate?: string;
  type?: string;
  fuel_type?: string;
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  registration_state_province?: string;
  labels?: string;
  photo?: File | string | null;
}

export const vehicleService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/vehicles${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/vehicles/${id}`),

  create: (data: VehicleData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof VehicleData];
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return api.post('/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id: number, data: Partial<VehicleData>) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof VehicleData];
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append('_method', 'PUT');

    return api.post(`/vehicles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: (id: number) =>
    api.delete(`/vehicles/${id}`),

  getForEdit: (id: number) =>
    api.get(`/vehicles/${id}/edit`),
};

