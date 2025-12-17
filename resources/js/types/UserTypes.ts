export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: "Admin" | "Manager" | "Driver" | "Contact";
  status?: number;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  contact?: Contact;
}

export interface Contact {
  id?: number;
  user_id?: number;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female";
  dob?: string;
  date_of_birth?: string;
  sin_no?: string;
  phone?: string;
  email?: string;
  classification?: string;
  mobile_number?: string;
  home_mobile_number?: string;
  work_mobile_number?: string;
  other_mobile_number?: string;
  job_title?: string;
  employee_number?: string;
  start_date?: string;
  end_date?: string;
  hourly_labor_rate?: string | number;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  zip_code?: string;
  license_no?: string;
  license_number?: string;
  license_no_file?: string;
  license_class?: string;
  license_issue_country?: string;
  license_issue_state?: string;
  license_issue_date?: string;
  license_expire_date?: string;
  status_in_country?: string;
  doc_expiry_date?: string;
  job_join_date?: string;
  offer_letter_file?: string;
  job_leave_date?: string;
  emergency_contact_name?: string;
  emergency_contact_no?: string;
  emergency_contact_address?: string;
  designation?: string;
  status?: string;
  immigration_status?: string;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
}

export interface ProfileUpdateResponse {
  status: boolean;
  message: string;
  data?: {
    user?: User;
    contact?: Contact;
  };
  errors?: Record<string, string[]>;
  error?: string;
}

export interface UserResponse {
  status: boolean;
  message?: string;
  data?: User;
  errors?: Record<string, string[]>;
  error?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: "Admin" | "Manager" | "Driver" | "Contact";
  status?: number;
  permissions?: string[];
}
