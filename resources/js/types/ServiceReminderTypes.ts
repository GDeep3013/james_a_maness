export interface ServiceReminder {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    service_task_id?: number;
    service_task?: {
        id?: number;
        name?: string;
    };
    time_interval_value?: string;
    time_interval_unit?: string;
    primary_meter_interval_value?: string;
    primary_meter_interval_unit?: string;
    next_due_date?: string;
    next_due_meter?: string;
    status?: string;
    created_at?: string;
}
