import api from './api';

interface VendorFormData {
  name: string;
  phone?: string;
  website?: string;
  street_address?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  charging?: boolean;
  fuel?: boolean;
  service?: boolean;
  vehicle?: boolean;
}

interface VendorData {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  notes?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  charging?: boolean;
  fuel?: boolean;
  service?: boolean;
  vehicle?: boolean;
  latitude?: string;
  longitude?: string;
  gst_no?: string;
  nsc_code?: string;
  vendor_file?: File | string | null;
}

export const vendorService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/vendors${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/vendors/${id}`),

  create: (data: VendorFormData) => {
    const vendorData: VendorData = {
      name: data.name,
      phone: data.phone || data.contact_phone || '',
      email: data.contact_email || '',
      website: data.website || undefined,

      address: data.street_address
        ? (data.address_line_2
            ? `${data.street_address}, ${data.address_line_2}`
            : data.street_address)
        : undefined,

      city: data.city || undefined,
      state: data.state || undefined,
      country: data.country || undefined,
      zip: data.zip || undefined,
      notes: data.notes || undefined,
      contact_name: data.contact_name || undefined,
      contact_phone: data.contact_phone || undefined,
      contact_email: data.contact_email || undefined,
      charging: data.charging || false,
      fuel: data.fuel || false,
      service: data.service || false,
      vehicle: data.vehicle || false,
    };

    return api.post('/vendors', vendorData);
  },

  update: (id: number, data: Partial<VendorFormData>) => {
    const vendorData: Partial<VendorData> = {};

    if (data.name) vendorData.name = data.name;
    if (data.phone || data.contact_phone) vendorData.phone = data.phone || data.contact_phone;
    if (data.contact_email) vendorData.email = data.contact_email;
    if (data.website !== undefined) vendorData.website = data.website;

    if (data.street_address) {
      vendorData.address = data.address_line_2
        ? `${data.street_address}, ${data.address_line_2}`
        : data.street_address;
    }

    if (data.city) vendorData.city = data.city;
    if (data.state) vendorData.state = data.state;
    if (data.country) vendorData.country = data.country;
    if (data.zip) vendorData.zip = data.zip;
    if (data.notes !== undefined) vendorData.notes = data.notes;
    if (data.contact_name !== undefined) vendorData.contact_name = data.contact_name;
    if (data.contact_phone !== undefined) vendorData.contact_phone = data.contact_phone;
    if (data.contact_email !== undefined) vendorData.contact_email = data.contact_email;
    if (data.charging !== undefined) vendorData.charging = data.charging;
    if (data.fuel !== undefined) vendorData.fuel = data.fuel;
    if (data.service !== undefined) vendorData.service = data.service;
    if (data.vehicle !== undefined) vendorData.vehicle = data.vehicle;

    return api.put(`/vendors/${id}`, vendorData);
  },

  delete: (id: number) => api.delete(`/vendors/${id}`),

  getForEdit: (id: number) => api.get(`/vendors/${id}/edit`),
};
