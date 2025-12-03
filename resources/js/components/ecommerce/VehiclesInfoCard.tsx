import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface VehicleStatistics {
  total: number;
  active: number;
  inMaintenance: number;
  available: number;
  outOfService: number;
}

// interface AdditionalStatistics {
//   totalContacts: number;
//   totalVendors: number;
//   totalParts: number;
// }

export default function VehiclesInfoCard() {
  const [statistics, setStatistics] = useState<VehicleStatistics>({
    total: 0,
    active: 0,
    inMaintenance: 0,
    available: 0,
    outOfService: 0,
  });
  // const [additionalStats, setAdditionalStats] = useState<AdditionalStatistics>({
  //   totalContacts: 0,
  //   totalVendors: 0,
  //   totalParts: 0,
  // });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/get-dashboard-statistics');
        const data = response.data;

        if (data.status && data.data) {
          const stats = data.data;

          if (stats.vehicles) {
            setStatistics({
              total: stats.vehicles.total || 0,
              active: stats.vehicles.active || 0,
              inMaintenance: stats.vehicles.in_maintenance || 0,
              available: stats.vehicles.available || 0,
              outOfService: stats.vehicles.out_of_service || 0,
            });
          }

          // setAdditionalStats({
          //   totalContacts: stats.contacts?.total || 0,
          //   totalVendors: stats.vendors?.total || 0,
          //   totalParts: stats.parts?.total || 0,
          // });
        } else {
          setError('Failed to load dashboard statistics');
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
    { value: statistics.outOfService, label: "Out of Service", color: "text-[#F2994A]" },
  ];

  // const additionalStatsList = [
  //   { value: additionalStats.totalContacts, label: "Total Contacts", color: "text-[#10B981]" },
  //   { value: additionalStats.totalVendors, label: "Total Vendors", color: "text-[#3B82F6]" },
  //   { value: additionalStats.totalParts, label: "Total Parts", color: "text-[#8B5CF6]" }
  // ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Vehicles Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-gray-50 p-6 min-h-[140px] flex flex-col justify-center text-center"
            >
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 ">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mb-6">
            Vehicles Info
          </h3>

          {/* Stats Box Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-gray-50 p-6 min-h-[175px] flex flex-col justify-center text-center"
              >
                <p className={`text-3xl font-semibold mb-2 ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-base text-gray-700 leading-tight ">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* <div className="rounded-2xl border border-gray-200 bg-white p-4"> */}
      {/* <h3 className="text-base font-semibold text-gray-800 mb-4">
        Additional Statistics
      </h3> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {additionalStatsList.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-gray-50 p-6 min-h-[140px] flex flex-col justify-center text-center">
                  <p className={`text-3xl font-semibold mb-2 ${item.color}`}>{item.value}</p>
                  <p className="text-sm text-gray-700 leading-tight">{item.label}</p>
                </div>
              ))}
        </div>
        </div> */}
    </div>
    );
}
