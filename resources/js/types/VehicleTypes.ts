export interface Vehicle {
    id: number;
    vehicle_name: string;
    name?: string;
    type?: string;
    make?: string;
    model?: string;
    year?: string;
    vin?: string;
    license_plate?: string;
    color?: string;
    fuel_type?: string;
    transmission?: string;
    purchase_date?: string;
    engine_size?: string;
    current_mileage?: string | number;
    purchase_price?: string | number;
    initial_status?: string;
    status?: string;
    vendor_id?: number;
    primary_location?: string;
    notes?: string;
    assigned_driver?: number;
    department?: string;
    next_service_date?: string;
    driver?: {
        id?: number;
        first_name?: string;
        last_name?: string;
    };
    contact?: {
        id?: number;
        first_name?: string;
        last_name?: string;
    };
    vendor?: {
        id?: number;
        name?: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface VehicleFormData {
    id?: number;
    vehicle_name: string;
    type: string;
    make: string;
    model: string;
    year: string;
    vin: string;
    license_plate: string;
    color: string;
    fuel_type: string;
    transmission: string;
    purchase_date: string;
    engine_size: string;
    current_mileage: string;
    purchase_price: string;
    initial_status: string;
    vendor_id: string;
    primary_location: string;
    notes: string;
    assigned_driver: string;
    department: string;
    created_at?: string;
    updated_at?: string;
}

export interface VehicleResponse {
    status: boolean;
    vehicle?: Vehicle;
    vehical?: {
        data?: Vehicle[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
}

