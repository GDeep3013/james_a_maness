export interface MaintenanceRecord {
  date?: string;
  description?: string;
  work_order_id?: number;
  task_id?: number;
}

export interface MMRReportVehicle {
  id?: number;
  vehicle_name?: string;
  type?: string;
  make?: string;
  model?: string;
  year?: string | number;
  license_plate?: string;
}

export interface MMRReportUser {
  id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
}

export interface MMRReport {
  id: number;
  user_id?: number;
  date?: string;
  domicile_station?: string;
  provider_company_name?: string;
  current_mileage?: string;
  vehicle_id?: number;
  vehicle?: MMRReportVehicle;
  preventative_maintenance?: boolean | null;
  out_of_service?: boolean | null;
  signature?: string;
  declaration?: boolean | null;
  completed_date?: string;
  maintenance_records?: MaintenanceRecord[];
  user?: MMRReportUser;
  created_at?: string;
  updated_at?: string;
}

export interface MMRReportFormData {
  date: string;
  domicile_station?: string;
  provider_company_name?: string;
  current_mileage?: string;
  vehicle_id: number;
  preventative_maintenance?: boolean | null;
  out_of_service?: boolean | null;
  signature?: string;
  declaration?: boolean | null;
  completed_date?: string;
  maintenance_records?: MaintenanceRecord[];
}

export interface MMRReportsResponse {
  status: boolean;
  mmrReport?: {
    data: MMRReport[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message?: string;
}

export interface MMRReportResponse {
  status: boolean;
  mmrReport?: MMRReport;
  message?: string;
}

