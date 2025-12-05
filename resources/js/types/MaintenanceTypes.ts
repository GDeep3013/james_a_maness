export interface MaintenanceItem {
    id?: number;
    maintenance_id?: number;
    maintenance_date?: string;
    maintenance_note?: string;
    performed_by?: string;
    validate_by?: string;
    total_amount?: number;
}

export interface Maintenance {
    id: number;
    user_id?: number;
    exp_type_id?: number;
    vehicle_id?: number;
    vehicle_year?: string;
    vehicle_model?: string;
    vehicle_date?: string;
    maintenance_items?: MaintenanceItem[];
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    expense_type?: {
        id?: number;
        name?: string;
    };
    created_at?: string;
    updated_at?: string;
}

