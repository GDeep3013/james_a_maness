import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import api from '../../services/api';

interface VehicleStatistics {
  total: number;
  active: number;
  inMaintenance: number;
  available: number;
}

export default function VehicleOverview() {
  const [statistics, setStatistics] = useState<VehicleStatistics>({
    total: 0,
    active: 0,
    inMaintenance: 0,
    available: 0,
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

          const totalVehicles = vehicles.length;

          let inMaintenanceCount = 0;
          if (maintenanceData.status && maintenanceData.maintenance) {
            const maintenances = Array.isArray(maintenanceData.maintenance)
              ? maintenanceData.maintenance
              : maintenanceData.maintenance.data || [];
            
            const uniqueVehicleIds = new Set(
              maintenances
                .map((m: any) => m.vehicle_id)
                .filter((id: any) => id !== null && id !== undefined)
            );
            inMaintenanceCount = uniqueVehicleIds.size;
          }

          const availableCount = Math.max(0, totalVehicles - inMaintenanceCount);
          const activeCount = totalVehicles;

          setStatistics({
            total: totalVehicles,
            active: activeCount,
            inMaintenance: inMaintenanceCount,
            available: availableCount,
          });
        } else {
          setError('Failed to load vehicle statistics');
        }
      } catch (err) {
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
      <div className="mt-4 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
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
        <span className="text-base font-medium text-black mb-2">Active</span>
        <span className="text-[40px] font-medium text-[#00A63E]">
          {statistics.active}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Currently in use</span>
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
    </div>
  );
}