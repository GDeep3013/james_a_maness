import api from './api';

interface ReportData {
  id?: number;
  report_type?: string;
  report_name?: string;
  generated_date?: string;
  status?: string;
  file_url?: string;
  created_by?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  };
  created_at?: string;
}

export const reportService = {
  getAll: (params?: { search?: string; page?: number; status?: string; report_type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.report_type) queryParams.append('report_type', params.report_type);
    const queryString = queryParams.toString();
    return api.get(`/reports${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/reports/${id}`),

  generate: (data: { report_type: string; report_name?: string; filters?: Record<string, unknown> }) => {
    return api.post('/reports/generate', data);
  },

  download: (id: number) => {
    return api.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
  },

  delete: (id: number) =>
    api.delete(`/reports/${id}`),
};

