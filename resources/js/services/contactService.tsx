import api from './api';

interface ContactData {
  user_id?: number;
  profile_picture?: File | string | null;
  first_name: string;
  last_name?: string;
  gender?: 'male' | 'female';
  dob?: string;
  sin_no?: string;
  phone: string;
  email: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  license_no?: string;
  license_no_file?: File | string | null;
  license_class?: 'Class 1' | 'Class 5';
  license_issue_country?: string;
  license_issue_state?: string;
  license_issue_date?: string;
  license_expire_date?: string;
  status_in_country?: 'study' | 'work' | 'permanent' | 'citizen';
  doc_expiry_date?: string;
  job_join_date?: string;
  offer_letter_file?: File | string | null;
  job_leave_date?: string;
  emergency_contact_name?: string;
  emergency_contact_no?: string;
  emergency_contact_address?: string;
  password?: string;
  designation?: string;
  status?: 'Active' | 'Inactive';
  immigration_status?: 'LMIA' | 'SINP' | 'Other';
  comment?: string;
}

export const contactService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/contacts${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/contacts/${id}`),

  create: (data: ContactData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ContactData];
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

    return api.post('/contacts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id: number, data: Partial<ContactData>) => { 
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ContactData];
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

    return api.post(`/contacts/${id}`, formData, {      
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: (id: number) =>
    api.delete(`/contacts/${id}`),

  getForEdit: (id: number) =>
    api.get(`/contacts/${id}/edit`),
};
