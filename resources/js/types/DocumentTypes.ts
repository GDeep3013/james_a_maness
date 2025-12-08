export interface Document {
    id: number;
    vehicle_id: number;
    title: string;
    file_path: string;
    file_name: string;
    file_type: string;
    uploaded_date: string;
    expires_date: string | null;
    created_at?: string;
    updated_at?: string;
    file_url?: string;
}

export interface DocumentFormData {
    vehicle_id: number;
    title: string;
    file: File | null;
    expires_date?: string | null;
}

