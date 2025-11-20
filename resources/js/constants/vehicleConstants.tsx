import React from "react";

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode | null;
}

export const sidebarItems: SidebarItem[] = [
  { key: "details", label: "Details", icon: null },
  { key: "maintenance", label: "Maintenance", icon: null },
  { key: "lifecycle", label: "Lifecycle", icon: null },
  { key: "financial", label: "Financial", icon: null },
  { key: "specifications", label: "Specifications", icon: null },
  { key: "settings", label: "Settings", icon: null },
];

export interface SelectOption {
  value: string;
  label: string;
}

export const typeOptions: SelectOption[] = [
  { value: "car", label: "Car" },
  { value: "bus", label: "Bus" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
  { value: "suv", label: "SUV" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "tractor", label: "Tractor" },
  { value: "trailer", label: "Trailer" },
  { value: "other", label: "Other" },
];

export const fuelTypeOptions: SelectOption[] = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "cng", label: "CNG" },
  { value: "lpg", label: "LPG" },
];

export const sectionFieldsMap: Record<string, string[]> = {
  details: ["vehicle_name", "vin", "license_plate", "type", "fuel_type", "year", "make", "model", "trim", "registration_state_province", "labels", "photo"],
  maintenance: [],
  lifecycle: [],
  financial: [],
  specifications: [],
  settings: [],
};

export const transmissionOptions: SelectOption[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
];

export const statusOptions: SelectOption[] = [
  { value: 'available', label: 'Available' },
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'In Maintenance' },
  { value: 'inactive', label: 'Inactive' },
];

export interface Step {
  number: number;
  title: string;
  description: string;
}

export const addVehicleSteps: Step[] = [
  {
    number: 1,
    title: 'Basic Information',
    description: 'Vehicle details and identification',
  },
  {
    number: 2,
    title: 'Specifications',
    description: 'Technical specifications',
  },
  {
    number: 3,
    title: 'Assignment',
    description: 'Driver and location details',
  },
];

export interface VehicleFormData {
  id?: number | undefined;
  vehicle_name: string;
  type: string;
  contact?: {
    id?: number;
    first_name?: string;
    last_name?: string;
  },
  vendor?: {
    id?: number;
    name?: string;
  };
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
  created_at?: string | undefined;
  updated_at?: string | undefined;
}

export const defaultVehicleFormData: VehicleFormData = {
  vehicle_name: '',
  type: '',
  make: '',
  model: '',
  year: '',
  vin: '',
  license_plate: '',
  color: '',
  fuel_type: '',
  transmission: '',
  purchase_date: '',
  engine_size: '',
  current_mileage: '',
  purchase_price: '',
  initial_status: 'available',
  vendor_id: "",
  primary_location: '',
  notes: '',
  assigned_driver: '',
  department: '',
};