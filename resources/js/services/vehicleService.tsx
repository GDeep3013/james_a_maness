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
  assigned_driver?: number | null;
}

export const vehicleService = {
  getAll: (params?: { search?: string; page?: number; status?: string; fuelType?: string; unassigned?: boolean; assigned_driver?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.fuelType) queryParams.append('fuelType', params.fuelType);
    if (params?.unassigned) queryParams.append('unassigned', 'true');
    if (params?.assigned_driver) queryParams.append('assigned_driver', params.assigned_driver.toString());
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
      // Handle explicit null for assigned_driver to allow unassigning
      if (key === 'assigned_driver' && value === null) {
        formData.append(key, '');
      } else if (value !== null && value !== undefined && value !== '') {
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

  updateAssignedDriver: (id: number, assignedDriverId: number | null) => {
    return api.put(`/vehicles/${id}/assigned-driver`, {
      assigned_driver: assignedDriverId,
    });
  },

  getForEdit: (id: number) =>
    api.get(`/vehicles/${id}/edit`),

  getStatistics: () =>
    api.get('/vehicles-statistics'),

  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/vehicles/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  export: (params?: { search?: string; status?: string; fuelType?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.fuelType) queryParams.append('fuelType', params.fuelType);
    const queryString = queryParams.toString();
    
    return api.get(`/vehicles/export${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  },
  
};
