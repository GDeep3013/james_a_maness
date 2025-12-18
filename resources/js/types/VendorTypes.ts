export interface Vendor {
    id: number;
    name: string;
    phone: string;
    email: string;
    website?: string;
    address?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
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
    notes?: string;
    created_at?: string;
    updated_at?: string;
}



export interface VendorFormData {
    name: string;
    phone: string;
    website: string;
    address: string;
    address_line_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    notes: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    charging: boolean;
    fuel: boolean;
    service: boolean;
    vehicle: boolean;
}


export interface VendorData {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    address_line_2?: string;
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
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface VendorsResponse {
    status: boolean;
    vendor: {
        data: Vendor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface VendorResponse {
    status: boolean;
    vendor?: Vendor;
    data?: Vendor;
}
