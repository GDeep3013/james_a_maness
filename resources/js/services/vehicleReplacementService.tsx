import api from './api';

interface VehicleReplacementFormData {
  vehicle_id: number;
  estimated_vehicle_life: number;
  estimated_annual_usage: number;
  estimated_fuel_efficiency: number;
  purchase_price: number;
  estimated_disposal_cost: number;
  estimated_salvage_value: number;
  method_of_depreciation: string;
  service_cost_estimates: Record<string, string>;
  fuel_cost_estimates: Record<string, { value: string }>;
}

interface VehicleReplacementData {
  vehicle_id: number;
  estimated_vehicle_life: number;
  estimated_annual_usage: number;
  estimated_fuel_efficiency: number;
  purchase_price: number;
  estimated_disposal_cost: number;
  estimated_salvage_value: number;
  method_of_depreciation: string;
  service_cost_estimates: Record<string, string>;
  fuel_cost_estimates: Record<string, { value: string }>;
}

export const vehicleReplacementService = {
  getAll: (params?: { search?: string; page?: number; vehicle_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    const queryString = queryParams.toString();
    return api.get(`/vehicle-replacements${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/vehicle-replacements/${id}`),

  create: (data: VehicleReplacementFormData) => {
    const replacementData: VehicleReplacementData = {
      vehicle_id: data.vehicle_id,
      estimated_vehicle_life: data.estimated_vehicle_life,
      estimated_annual_usage: data.estimated_annual_usage,
      estimated_fuel_efficiency: data.estimated_fuel_efficiency,
      purchase_price: data.purchase_price,
      estimated_disposal_cost: data.estimated_disposal_cost,
      estimated_salvage_value: data.estimated_salvage_value,
      method_of_depreciation: data.method_of_depreciation,
      service_cost_estimates: data.service_cost_estimates,
      fuel_cost_estimates: data.fuel_cost_estimates,
    };

    return api.post('/vehicle-replacements', replacementData);
  },

  update: (id: number, data: Partial<VehicleReplacementFormData>) => {
    const replacementData: Partial<VehicleReplacementData> = {};

    if (data.vehicle_id) replacementData.vehicle_id = data.vehicle_id;
    if (data.estimated_vehicle_life !== undefined) replacementData.estimated_vehicle_life = data.estimated_vehicle_life;
    if (data.estimated_annual_usage !== undefined) replacementData.estimated_annual_usage = data.estimated_annual_usage;
    if (data.estimated_fuel_efficiency !== undefined) replacementData.estimated_fuel_efficiency = data.estimated_fuel_efficiency;
    if (data.purchase_price !== undefined) replacementData.purchase_price = data.purchase_price;
    if (data.estimated_disposal_cost !== undefined) replacementData.estimated_disposal_cost = data.estimated_disposal_cost;
    if (data.estimated_salvage_value !== undefined) replacementData.estimated_salvage_value = data.estimated_salvage_value;
    if (data.method_of_depreciation) replacementData.method_of_depreciation = data.method_of_depreciation;
    if (data.service_cost_estimates) replacementData.service_cost_estimates = data.service_cost_estimates;
    if (data.fuel_cost_estimates) replacementData.fuel_cost_estimates = data.fuel_cost_estimates;

    return api.put(`/vehicle-replacements/${id}`, replacementData);
  },

  delete: (id: number) => api.delete(`/vehicle-replacements/${id}`),

  getForEdit: (id: number) => api.get(`/vehicle-replacements/${id}/edit`),
};

