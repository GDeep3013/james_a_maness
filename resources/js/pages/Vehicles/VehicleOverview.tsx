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

export default function VehicleOverview() {
  const [statistics, setStatistics] = useState<VehicleStatistics>({
    total: 0,
    active: 0,
    inMaintenance: 0,
    available: 0,
    outOfService: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

          const totalVehicles = activeCount + inMaintenanceCount + availableCount + outOfServiceCount;

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Total Vehicles</span>
        <span className="text-[40px] font-medium text-[#1D2939]">
          {statistics.total}
        </span>
        <span className="mt-2 text-sm text-[#00A63E] font-medium">
          Overall Vehicles
        </span>
      </div>
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">In Maintenance</span>
        <span className="text-[40px] font-medium text-[#D08700]">
          {statistics.inMaintenance}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Under repair</span>
      </div>
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Available</span>
        <span className="text-[40px] font-medium text-[#155DFC]">
          {statistics.available}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Ready to assign</span>
      </div>
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Inactive</span>
        <span className="text-[40px] font-medium text-[#DC2626]">
          {statistics.outOfService}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Out of service</span>
      </div>
    </div>
  );
}
