export interface ServiceReminder {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
        current_mileage?: string | number;
    };
    service_task_ids: number[];
    service_tasks?: {
        id?: number;
        name?: string;
    }[];
    time_interval_value?: string;
    time_interval_unit?: string;
    primary_meter_interval_value?: string;
    primary_meter_interval_unit?: string;
    primary_meter_due_soon_threshold_value?: string;
    next_due_date?: string;
    next_due_meter?: string;
    status?: string;
    created_at?: string;
}
