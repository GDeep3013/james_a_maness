import api from './api';

interface FuelFormData {
  vehicle_id: number;
  vendor_id: number;
  fuel_type: string;
  unit_type: string;
  units: number;
  price_per_volume_unit: number;
  vehicle_meter: string;
  previous_meter?: string;
  notes?: string;
  date: string;
}

interface FuelData {
  vehicle_id: number;
  vendor_id: number;
  fuel_type: string;
  unit_type: string;
  units: number;
  price_per_volume_unit: number;
  vehicle_meter: string;
  previous_meter?: string;
  notes?: string;
  date: string;
}

export const fuelService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/fuels${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/fuels/${id}`),

  create: (data: FuelFormData) => {
    const fuelData: FuelData = {
      vehicle_id: data.vehicle_id,
      vendor_id: data.vendor_id,
      fuel_type: data.fuel_type,
      unit_type: data.unit_type,
      units: data.units,
      price_per_volume_unit: data.price_per_volume_unit,
      vehicle_meter: data.vehicle_meter,
      previous_meter: data.previous_meter || undefined,
      notes: data.notes || undefined,
      date: data.date,
    };

    return api.post('/fuels', fuelData);
  },

  update: (id: number, data: Partial<FuelFormData>) => {
    const fuelData: Partial<FuelData> = {};

    if (data.vehicle_id) fuelData.vehicle_id = data.vehicle_id;
    if (data.vendor_id) fuelData.vendor_id = data.vendor_id;
    if (data.fuel_type) fuelData.fuel_type = data.fuel_type;
    if (data.unit_type) fuelData.unit_type = data.unit_type;
    if (data.units !== undefined) fuelData.units = data.units;
    if (data.price_per_volume_unit !== undefined) fuelData.price_per_volume_unit = data.price_per_volume_unit;
    if (data.vehicle_meter) fuelData.vehicle_meter = data.vehicle_meter;
    if (data.previous_meter !== undefined) fuelData.previous_meter = data.previous_meter;
    if (data.notes !== undefined) fuelData.notes = data.notes;
    if (data.date) fuelData.date = data.date;

    return api.put(`/fuels/${id}`, fuelData);
  },

  delete: (id: number) => api.delete(`/fuels/${id}`),

  getForEdit: (id: number) => api.get(`/fuels/${id}/edit`),

  getStatistics: () => api.get('/fuels-statistics'),

  getLastEntryByVehicle: (vehicleId: number) => api.get(`/fuels/last-entry/${vehicleId}`),
};
