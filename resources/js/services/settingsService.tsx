import api from './api';

interface SettingsData {
  logo_image?: File | string | null;
  company_name?: string;
  phone_number?: string;
  address?: string;
  state?: string;
  city?: string;
  country?: string;
  post_code?: string;
  primary_email?: string;
  cc_emails?: string[] | null;
}

export const settingsService = {
  get: () => api.get('/settings'),

  update: (data: SettingsData) => {
    const formData = new FormData();
    
    if (data.logo_image instanceof File) {
      formData.append('logo_image', data.logo_image);
    }
    
    if (data.company_name) {
      formData.append('company_name', data.company_name);
    }
    
    if (data.phone_number) {
      formData.append('phone_number', data.phone_number);
    }
    
    if (data.address) {
      formData.append('address', data.address);
    }
    
    if (data.state) {
      formData.append('state', data.state);
    }
    
    if (data.city) {
      formData.append('city', data.city);
    }
    
    if (data.country) {
      formData.append('country', data.country);
    }
    
    if (data.post_code) {
      formData.append('post_code', data.post_code);
    }
    
    if (data.primary_email) {
      formData.append('primary_email', data.primary_email);
    }
    
    if (data.cc_emails && Array.isArray(data.cc_emails) && data.cc_emails.length > 0) {
      formData.append('cc_emails', JSON.stringify(data.cc_emails));
    }

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/settings', formData, {
      headers,
    });
  },
};

