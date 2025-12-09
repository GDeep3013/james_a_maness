import api from './api';

interface MMRReportFormData {
  date: string;
  domicile_station?: string;
  provider_company_name?: string;
  current_mileage?: string;
  vehicle_id: number;
  preventative_maintenance?: boolean;
  out_of_service?: boolean;
  signature?: string;
  completed_date?: string;
}

export const mmrReportService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/mmr-reports${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/mmr-reports/${id}`),

  create: (data: MMRReportFormData) => {
    return api.post('/mmr-reports', data);
  },

  update: (id: number, data: Partial<MMRReportFormData>) => {
    return api.put(`/mmr-reports/${id}`, data);
  },

  delete: (id: number) => api.delete(`/mmr-reports/${id}`),

  getForEdit: (id: number) => api.get(`/mmr-reports/${id}/edit`),
};

