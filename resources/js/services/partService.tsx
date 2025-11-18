import api from './api';

interface PartData {
  part_name: string;
  part_code: string;
  description?: string;
  vehical_types?: string[];
  manufacturer_name?: string;
  unit_price: number;
  purchase_price: number;
  vendor_id?: number;
  warranty_period_months?: number;
  status?: 'Active' | 'Inactive';
}

export const partService = {
  getAll: (params?: { search?: string; page?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    const queryString = queryParams.toString();
    return api.get(`/parts${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/parts/${id}`),

  create: (data: PartData) => {
    const formData = new FormData();
    
    formData.append('part_name', data.part_name);
    formData.append('part_code', data.part_code);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.vehical_types && data.vehical_types.length > 0) {
      data.vehical_types.forEach((type) => {
        formData.append('vehical_types[]', type);
      });
    }
    if (data.manufacturer_name) {
      formData.append('manufacturer_name', data.manufacturer_name);
    }
    formData.append('unit_price', data.unit_price.toString());
    formData.append('purchase_price', data.purchase_price.toString());
    if (data.vendor_id) {
      formData.append('vendor_id', data.vendor_id.toString());
    }
    if (data.warranty_period_months !== undefined && data.warranty_period_months !== null) {
      formData.append('warranty_period_months', data.warranty_period_months.toString());
    }
    if (data.status) {
      formData.append('status', data.status);
    }

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/parts', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<PartData>) => {
    const formData = new FormData();
    
    if (data.part_name) {
      formData.append('part_name', data.part_name);
    }
    if (data.part_code) {
      formData.append('part_code', data.part_code);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description || '');
    }
    if (data.vehical_types !== undefined) {
      if (data.vehical_types.length > 0) {
        data.vehical_types.forEach((type) => {
          formData.append('vehical_types[]', type);
        });
      }
    }
    if (data.manufacturer_name !== undefined) {
      formData.append('manufacturer_name', data.manufacturer_name || '');
    }
    if (data.unit_price !== undefined && data.unit_price !== null) {
      formData.append('unit_price', data.unit_price.toString());
    }
    if (data.purchase_price !== undefined && data.purchase_price !== null) {
      formData.append('purchase_price', data.purchase_price.toString());
    }
    if (data.vendor_id !== undefined) {
      if (data.vendor_id) {
        formData.append('vendor_id', data.vendor_id.toString());
      }
    }
    if (data.warranty_period_months !== undefined && data.warranty_period_months !== null) {
      formData.append('warranty_period_months', data.warranty_period_months.toString());
    }
    if (data.status !== undefined) {
      formData.append('status', data.status || '');
    }

    formData.append('_method', 'PUT');

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post(`/parts/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/parts/${id}`),

  getForEdit: (id: number) =>
    api.get(`/parts/${id}/edit`),
};

