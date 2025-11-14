<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceTask;
use Illuminate\Support\Facades\DB;

class ServiceTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing data (optional - comment out if you want to keep existing data)
        // ServiceTask::truncate();
        // DB::table('service_task_subtasks')->truncate();

        $serviceTasks = [
            [
                'name' => 'A/C Accumulator Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C Compressor Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C Condenser Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C Evaporator Core Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C Expansion Valve Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C Receiver Dryer Assembly Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C System Evacuate & Recharge',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'A/C System Test',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'ABS Control Module Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Accelerator Pedal Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Accessories/Uplifting (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Admin/Misc Charges',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Assembly, Driver\'s Door',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Assembly, Driver Side, Front',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Assembly, Passenger Door',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Assembly, Passenger Side, Front',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Cab Door',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag - Side Roll',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Bag System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Conditioning Condenser Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Conditioning System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Dryer Desiccant Cartridge Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Filter Restriction Gauge Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Intake Hose Debris Screen Clean',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension Ball Joint Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension Ball Joint Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension System Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Air Ride Suspension System Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Alternator Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Alternator Test',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Automatic Transmission Assembly Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Automatic Transmission Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Automatic Transmission Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Automatic Transmission Leak Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Automatic Transmission (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Auto Transmission Brake Shift Interlock Solenoid Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'AWD Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Axle Shaft Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Cable Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Cable Inspect, Battery (Series)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Cable Inspect, Battery to Ground',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Cable Inspect, Battery to Junction Block',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Cable Inspect, Battery to Starter',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Service',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Battery Test',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Decals',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Fasteners Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Fasteners Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body & Frame (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Latches, Locks & Hinges Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Latches, Locks & Hinges Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Lock Cylinders Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Paint',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Body Water Drains Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Cooling Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Drum Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Fluid Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Hydraulic Oil Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Hydraulic System Drain, Refill & Bleed',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Hydraulic System Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Line Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Line Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Linings Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Master Cylinder Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Pads Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Rotor Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Rotor Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Rotor Resurface',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Shoes Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brakes (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Brake Vacuum Pump Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Bumper Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cabin Air Filter Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cabin Air Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cameras/Alarms/Safety (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Catalytic Converter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Circle Drive Oil Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Clutch Assembly Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Clutch Assembly Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Clutch Disc Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Clutch Hydraulic System Drain & Refill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Clutch Master Cylinder Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cooling System Add Fluid Conditioner',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cooling System Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cooling System Hoses Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cooling System Leak Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Crankcase Oil Separator Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Crankshaft Oil Seal Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'CV Joint Boot Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cylinder Head Gasket Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Cylinder Head Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diagnostics (Unspecified)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Emissions Fluid Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Emissions Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Exhaust Fluid Pump Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Particulate Filter Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Particulate Filter Regeneration',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Diesel Particulate Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Differential Fluid Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Differential Fluid Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Differential Oil Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Differential Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Disc Brake Caliper Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Disc Brake Caliper Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Door Hinge Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'DOT Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drain Water and Sediment from Fuel Tank',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drive Axle Assembly Drain & Refill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drive Axle Assembly Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drive Axle Assembly Mounting Bolts Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drive Belt Idler Pulley Assembly Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drive Belt Tensioner Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Driveshaft Flange Yoke Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Driveshaft Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Driveshaft Slip Yoke Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Driveshaft U-Joint Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Driveshaft U-Joint Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Drum Brakes Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'EGR Valve Clean',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'EGR Valve Cooler Clean',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'EGR Valve Cooler Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'EGR Valve Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Electrical System (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Emission Control System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Air Filter Element Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Air Filter Housing Clean',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Air Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Assembly Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant Drain & Refill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant Expansion Tank Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant (HOAT) Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant (IAT) Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant (NOAT) Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant (OAT) Fill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant Thermostat Housing Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Coolant Thermostat Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Cooling System (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Drive Belt Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Drive Belt Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Leak Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Oil & Filter Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Oil Level Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Engine Oil Pump Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'EVAP Purge Control Solenoid Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust/Emissions (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust Manifold Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust Muffler Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust Pipe Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust System Heat Shield Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exhaust System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exterior Bulb Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exterior Lighting Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Exterior Mirror Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fan Pulley and Belts Inspection',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Final Drive Oil Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Differentials',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Engine Coolant',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Engine Oil',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Final Drive Oil',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Front Wheel Hubs',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Hydraulic Oil',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Swing Drive',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Tandem Drive Oil',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Transfer Gear',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fluid Analysis Sample, Transmission',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Floor Mat Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Foreign Material Inspection, All Filters',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Frame (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Brake Linings Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Brakes & Drums',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Bumper Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Crankshaft Seal Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Disc Brake Caliper Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Drive Axle Assembly Drain & Refill',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Drive Axle Assembly Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Drive Axle Assembly Mounting Bolts Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Drum Brakes Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Shock Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Shocks Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Stabilizer Bar Link Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Stabilizer Bar Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Stabilizer Bushing Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension Ball Joint Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension Ball Joint Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension (Miscellaneous)',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension System Lubricate',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Suspension System Torque',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Front Wheel Spindle Housing Oil Replacement',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fuel Evaporative Canister Filter Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fuel Evaporative Emission Control System Inspect',
                'description' => '',
                'labor_cost' => 0.00,
            ],
            [
                'name' => 'Fuel Evaporative Emission Control System Lines Insp.',
                'description' => '',
                'labor_cost' => 0.00,
            ],
                
            // --- Newly added items ---
            ['name' => 'Rear Bumper Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Crankshaft Seal Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Disc Brake Caliper Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Drive Axle Assembly Drain & Refill', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Drive Axle Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Drive Axle Assembly Mounting Bolts Torque', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Drum Brakes Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Shock Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Shocks Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Stabilizer Bar Link Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Stabilizer Bar Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Stabilizer Bushing Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension Ball Joint Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension Ball Joint Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension System Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension System Lubricate', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Rear Suspension System Torque', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'Rollover Protection System (ROPS) Inspection', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Seat Belt System Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Secondary Air Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Secondary Fuel Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Shock or Strut Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Shop Supplies', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Spark Plugs Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Spark Plug Wire Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Spark Plug Wire Set Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Stabilizer Bar Link Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Stabilizer Bar Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Stabilizer Bushing Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Starter Motor Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'State/Province Waste', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering Gear Box Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering Hydraulic Oil Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering Idler Arm Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering Linkage Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering Linkage Lubricate', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'Steering Pitman Arm Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering System Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Steering System (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Strut Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Strut Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Sunroof Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Sunroof Assembly Lubricate', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension Ball Joint Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension Ball Joint Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension Control Arm Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension Shock or Strut Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension System Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension System Lubricate', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension System (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Suspension System Torque', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Swing Drive Oil Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tandem Drive Oil Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Temperature Controlled Seat Air Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Throttle Body Inspect', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'Tie Rod End Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tie Rod Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tie Rod Lubricate', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tie Rod Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Timing Belt Idler Pulley Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Timing Belt Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Timing Belt Tensioner Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Balance', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Pressure Monitoring System Reset', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Repair Kit Sealant Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire Rotation', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tires (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire & Wheel Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Tire/Wheel (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Towing/Roadside Assistance', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'TPMS Control Module Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'TPMS (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'TPMS Sensor Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transfer Case Fluid Drain & Refill', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transfer Case Fluid Level Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transfer Case Leak Inspection', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transfer Gear Oil Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Assembly Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Fluid Drain & Refill', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Fluid Fill', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Fluid Level Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Leak Inspection', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Oil Cooler Line Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Oil & Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Oil Filter Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Transmission Oil Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Turbocharger Assembly Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Underbody Clean', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Underbody Inspect', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'Underbody Splash Shield Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vacuum Line Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Valve Lash Adjustment', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Valve Lash Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Fluid Levels Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Jump Start', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Multi-Point Inspection', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Road Test', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Wash', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Vehicle Wiring Harnesses Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Water Pump Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Weatherstrip Seal Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Weatherstrip Seal Lubricate', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Alignment', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Alignment Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Assembly Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Bearing Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Bearing Repack', 'description' => '', 'labor_cost' => 0.00],

            ['name' => 'Wheel Bearing Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Bearing Seal Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Hub Nut Re-Torque', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Hub Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Lug Nut Torque', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheels (Miscellaneous)', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Wheel Speed Sensor Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Window Regulator/Motor Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Chip Repair', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Replacement', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Washer Fluid Fill', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Washer Fluid Level Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Washer System Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Wiper Blade Inspect', 'description' => '', 'labor_cost' => 0.00],
            ['name' => 'Windshield Wiper Blade Replacement', 'description' => '', 'labor_cost' => 0.00],

        ];

        ServiceTask::insert($serviceTasks);

        $this->command->info('Service tasks seeded successfully!');
    }
}

