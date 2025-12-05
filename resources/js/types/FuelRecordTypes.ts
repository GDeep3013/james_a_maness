export interface FuelRecord {
    id: number;
    vehicle_id: number;
    vendor_id: number;
    fuel_type: string;
    unit_type: string;
    units: number;
    price_per_volume_unit: number;
    vehicle_meter: string;
    notes?: string;
    date: string;
    vehicle?: {
        id: number;
        name: string;
    };
    vendor?: {
        id: number;
        name: string;
    };
    created_at?: string;
}