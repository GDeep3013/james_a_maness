import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';

interface VehicleStatistics {
  total: number;
  active: number;
  inMaintenance: number;
  available: number;
}

export default function VehicleOverview({ importSuccess }: { importSuccess?: boolean }) {
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
        const vehiclesResponse = await vehicleService.getStatistics();

        const vehiclesData = vehiclesResponse.data;

        if (vehiclesData.status && vehiclesData.data) {

          setStatistics({
            total: vehiclesData.data.total ?? 0,
            active: vehiclesData.data.active ?? 0,
            inMaintenance: vehiclesData.data.in_maintenance ?? 0,
            available: vehiclesData.data.available ?? 0
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
  }, [importSuccess]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white  border border-gray-200 rounded-xl p-6 flex flex-col"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200  rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Total Vehicles</span>
        <span className="text-[40px] font-medium text-[#1D2939]">
          {statistics.total}
        </span>
        <span className="mt-2 text-sm text-[#00A63E] font-medium">
          Overall Vehicles
        </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Active</span>
        <span className="text-[40px] font-medium text-[#00A63E]">
          {statistics.active}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Currently in use</span>
          </div>


      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">In Maintenance</span>
        <span className="text-[40px] font-medium text-[#D08700]">
          {statistics.inMaintenance}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Under repair</span>
          </div>


      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Available</span>
        <span className="text-[40px] font-medium text-[#155DFC]">
          {statistics.available}
        </span>
        <span className="mt-2 text-sm text-[#595959]">Ready to assign</span>
      </div>
    </div>
  );
}
