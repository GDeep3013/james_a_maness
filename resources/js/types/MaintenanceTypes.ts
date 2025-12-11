import { Vehicle } from "./VehicleTypes";
export interface MaintenanceItem {
    id: number;
    maintenance_id: number;
    item_id?: number;
    item_name: string;
    quantity: number;
    price_per_quantity: number;
    total_amount: number;
    notes?: string;
    item?: {
        id: number;
        item_name: string;
        name?: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface Maintenance {
    id: number | string;
    source_type?: 'work_order' | 'service_task' | 'maintenance';
    source_id?: number;
    user_id: number;
    vehicle_id: number | null;
    vendor_id?: number;
    expense_type_id?: number;
    invoice_number?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    issues?: string;
    vehicle_meter?: number;
    vehicle_date: string;
    completion_date?: string;
    notes?: string;
    vehicle_model?: string;
    vehicle?: Vehicle | null;
    vendor?: {
        id: number;
        name: string;
    } | null;
    expense_type?: {
        id: number;
        name: string;
    };
    maintenance_items: MaintenanceItem[];
    created_at?: string;
    updated_at?: string;
}

export interface MaintenanceFormData {
    vehicle_id: number;
    vendor_id?: number;
    expense_type_id?: number;
    invoice_number?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    issues?: string;
    vehicle_meter?: number;
    vehicle_date: string;
    completion_date?: string;
    notes?: string;
    vehicle_model?: string;
    items: {
        item_id?: number;
        item_name: string;
        quantity: number;
        price_per_quantity: number;
        notes?: string;
    }[];
}

export interface MaintenanceResponse {
    status: boolean;
    maintenance: {
        data: Maintenance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface MaintenanceStatistics {
    total_maintenances: number;
    total_cost: number;
    average_cost: number;
    recent_maintenances: Maintenance[];
}
