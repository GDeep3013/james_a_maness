import { Vehicle } from "./VehicleTypes";


export interface FuelRecord {
    id: number;
    vehicle_id: number;
    vendor_id: number;
    fuel_type: string;
    unit_type: string;
    units: number;
    previous_meter:number;
    price_per_volume_unit: number;
    vehicle_meter: string;
    notes?: string;
    date: string;
    vehicle?: Vehicle;
    vendor?: {
        id: number;
        name: string;
    };
    created_at?: string;
}

export interface FuelsResponse {
    status: boolean;
    fuel: {
        data: FuelRecord[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}