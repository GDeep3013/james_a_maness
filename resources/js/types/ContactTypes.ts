import { Vehicle } from "./VehicleTypes";

export interface Contact {
    id: number;
    user_id?: number;
    job_title?: string;
    first_name: string;
    last_name?: string;
    gender?: string;
    dob?: string;
    date_of_birth?: string;
    sin_no?: string;
    phone: string;
    email: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    zip_code?: string;
    license_no?: string;
    license_number?: string;
    license_class?: string;
    license_issue_country?: string;
    license_issue_state?: string;
    license_issue_date?: string;
    license_expire_date?: string;
    status_in_country?: string;
    doc_expiry_date?: string;
    job_join_date?: string;
    job_leave_date?: string;
    emergency_contact_name?: string;
    emergency_contact_no?: string;
    emergency_contact_address?: string;
    designation?: string;
    status?: string;
    immigration_status?: string;
    comment?: string;
    hourly_labor_rate?: number;
    employee_number?: string;
    start_date?: string;
    end_date?: string;
    user?: {
        id: number;
        profile_picture?: string;
    };
    vehicles?: Vehicle[];
    classification: string;
    created_at?: string;
    updated_at?: string;
}

export interface ContactResponse {
    status: boolean;
    contact?: Contact;
    contacts?: {
        data?: Contact[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
}

