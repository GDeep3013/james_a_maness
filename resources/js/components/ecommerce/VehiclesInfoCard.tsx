import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import api from '../../services/api';

interface VehicleStatistics {
  total: number;
  active: number;
  inMaintenance: number;
  available: number;
  outOfService: number;
}

export default function VehiclesInfoCard() {
  const [statistics, setStatistics] = useState<VehicleStatistics>({
    total: 0,
    active: 0,
    inMaintenance: 0,
    available: 0,
    outOfService: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fuelValue = 92; // %

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError('');
      try {
        const [vehiclesResponse, maintenanceResponse] = await Promise.all([
          vehicleService.getStatistics(),
          api.get('/maintenances').catch(() => ({ data: { status: false, maintenance: [] } })),
        ]);

        const vehiclesData = vehiclesResponse.data;
        console.log('Vehicle Data:', vehiclesData);
        const maintenanceData = maintenanceResponse.data;

        if (vehiclesData.status && vehiclesData.vehical) {
          let vehicles: any[] = [];

          if (Array.isArray(vehiclesData.vehical)) {
            vehicles = vehiclesData.vehical;
          } else if (vehiclesData.vehical.data && Array.isArray(vehiclesData.vehical.data)) {
            vehicles = vehiclesData.vehical.data;
          } else if (vehiclesData.vehical.total !== undefined) {
            vehicles = vehiclesData.vehical.data || [];
          }

          let maintenanceVehicleIds = new Set();
          if (maintenanceData.status && maintenanceData.maintenance) {
            const maintenances = Array.isArray(maintenanceData.maintenance)
              ? maintenanceData.maintenance
              : maintenanceData.maintenance.data || [];

            maintenanceVehicleIds = new Set(
              maintenances
                .map((m: any) => m.vehicle_id)
                .filter((id: any) => id !== null && id !== undefined)
            );
          }

          // Count vehicles based on initial_status
          let activeCount = 0;
          let inMaintenanceCount = 0;
          let availableCount = 0;
          let outOfServiceCount = 0;

          vehicles.forEach((vehicle: any) => {
            const status = vehicle.initial_status?.toLowerCase() || vehicle.status?.toLowerCase() || '';
            const vehicleId = vehicle.id;

            console.log(`Vehicle ID: ${vehicleId}, initial_status: ${vehicle.initial_status}, status: ${vehicle.status}`);

            if (status === 'maintenance') {
              inMaintenanceCount++;
            } else if (status === 'inactive' || status === 'out_of_service' || status === 'out of service') {
              outOfServiceCount++;
            } else if (status === 'active') {
              activeCount++;
            } else if (status === 'available') {
              availableCount++;
            } else {
              availableCount++;
            }
          });
 const totalVehicles =activeCount+inMaintenanceCount+availableCount+outOfServiceCount;
          console.log('Statistics:', {
            total: totalVehicles,
            active: activeCount,
            inMaintenance: inMaintenanceCount,
            available: availableCount,
            outOfService: outOfServiceCount
          });

          setStatistics({
            total: totalVehicles,
            active: activeCount,
            inMaintenance: inMaintenanceCount,
            available: availableCount,
            outOfService: outOfServiceCount,
          });
        } else {
          setError('Failed to load vehicle statistics');
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('An error occurred while loading statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    { value: statistics.total, label: "Total Vehicles", color: "text-[#3C247D]" },
    { value: statistics.inMaintenance, label: "Maintenance Vehicles", color: "text-[#F2994A]" },
    { value: statistics.available, label: "Available Vehicles", color: "text-[#3C247D]" },
    { value: statistics.outOfService, label: "Out of Service", color: "text-[#F2994A]" }
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-10 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
          Vehicles Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-gray-50 p-6 min-h-[140px] flex flex-col justify-center text-center dark:bg-white/[0.06]"
            >
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-10 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-10 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
        Vehicles Info
      </h3>

      {/* Stats Box Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-gray-50 p-6 min-h-[140px] flex flex-col justify-center text-center dark:bg-white/[0.06]"
          >
            <p className={`text-3xl font-semibold mb-2 ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-700 dark:text-white/80 leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="mb-6" />

      {/* Fuel Efficiency */}
      <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white/90 mb-3">
        <span>Fuel Efficiency</span>
        <span className="text-[#F2994A]">{fuelValue}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0D0A25]"
          style={{ width: `${fuelValue}%` }}
        ></div>
      </div>
    </div>
  );
}
