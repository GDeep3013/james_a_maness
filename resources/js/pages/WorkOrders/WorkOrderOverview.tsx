import React, { useState, useEffect } from 'react';
import { workOrderService } from '../../services/workOrderService';

interface WorkOrderStatistics {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
}

export default function WorkOrderOverview() {
  const [statistics, setStatistics] = useState<WorkOrderStatistics>({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await workOrderService.getStatistics();
        const data = response.data;

        if (data.status && data.data) {
          setStatistics({
            total: data.data.total ?? 0,
            open: data.data.open ?? 0,
            inProgress: data.data.in_progress ?? 0,
            completed: data.data.completed ?? 0,
          });
        } else {
          setError('Failed to load work order statistics');
        }
      } catch {
        setError('An error occurred while loading statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
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
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Total Work Orders</span>
        <span className="text-[30px] font-medium text-[#1D2939]">
          {statistics.total}
        </span>
     
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Open</span>
        <span className="text-[30px] font-medium text-[#155DFC]">
          {statistics.open}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">In Progress</span>
        <span className="text-[30px] font-medium text-[#D08700]">
          {statistics.inProgress}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <span className="text-base font-medium text-black mb-2">Completed</span>
        <span className="text-[30px] font-medium text-[#00A63E]">
          {statistics.completed}
        </span>
      </div>
    </div>
  );
}

