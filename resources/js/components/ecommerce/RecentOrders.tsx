import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { workOrderService } from "../../services/workOrderService";
import { WorkOrder, WorkOrdersResponse, ServiceItem } from "../../types/workOrderTypes";
import { formatTypeModel } from "../../utilites";

export default function RecentOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const fetchWorkOrders = async () => {
      setLoading(true);
      try {
        const response = await workOrderService.getAll({ page: 1, status: activeFilter });
        const data = response.data as WorkOrdersResponse;

        if (data.status && data.work_orders) {
          const latestWorkOrders = (data.work_orders.data || []).slice(0, 10);
          setWorkOrders(latestWorkOrders);
        } else {
          setWorkOrders([]);
        }
      } catch {
        setWorkOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [activeFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Open":
        return "warning";
      case "In Progress":
        return "info";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "warning";
    }
  };

  const formatServiceTasks = (serviceItems?: ServiceItem[] | string) => {
    if (!serviceItems) return "N/A";

    let items: ServiceItem[] = [];

    if (typeof serviceItems === "string") {
      try {
        items = JSON.parse(serviceItems);
      } catch {
        return "N/A";
      }
    } else if (Array.isArray(serviceItems)) {
      items = serviceItems;
    }

    const serviceTasks = items.filter(
      (item) => item.type === "Service Tasks" || !item.type
    );

    if (serviceTasks.length === 0) return "N/A";

    if (serviceTasks.length === 1) {
      return serviceTasks[0]?.name || "N/A";
    }

    return serviceTasks.map((item) => item?.name).filter(Boolean).join(", ");
  };

  const formatDriver = (assignedTo?: WorkOrder["assigned_to"]) => {
    if (!assignedTo) return "N/A";
    const name = `${assignedTo.first_name || ""} ${assignedTo.last_name || ""}`.trim();
    return name || "N/A";
  };


  const Filters  = [
    {label: 'All', value: ''},
    {label: 'Open', value: 'Open'},
    {label: 'In Progress', value: 'In Progress'},
    {label: 'Completed', value: 'Completed'},
    {label: 'Cancelled', value: 'Cancelled'},
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Work Orders
          </h3>
        </div>


          <div className="w-full max-w-[500px]">
              <nav className="flex w-full bg-[#ECECF0] rounded-1 p-1">
                  {Filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`px-2 py-2 lg:text-sm text-xs font-medium transition-colors rounded-1 w-auto min-w-[34px] sm:w-full shadow-none ${activeFilter === filter.value
                          ? 'bg-white text-[#020817]'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                  >
                      {filter.label}
                    </button>
                  ))}
              </nav>
          </div>


      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow >

              <TableCell
                isHeader
              >
                ID
              </TableCell>

              <TableCell
                isHeader
              >
                Type/Model
              </TableCell>

              <TableCell
                isHeader
              >
                Status
              </TableCell>

              <TableCell
                isHeader
              >
                Service Tasks
              </TableCell>

              <TableCell
                isHeader
              >
                Driver
              </TableCell>


              <TableCell
                isHeader
              >
                Issue Date
              </TableCell>

            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                    <span className="ml-2 text-gray-600 text-theme-sm">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : workOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <span className="text-gray-500 text-theme-sm">No work orders found</span>
                </TableCell>
              </TableRow>
            ) : (
              workOrders.map((workOrder) => (
                <TableRow key={workOrder.id} className="">
                  <TableCell className="py-4 px-5">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm">
                        WO-{workOrder.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5 text-gray-800 text-theme-sm">
                    {formatTypeModel(workOrder.vehicle)}
                  </TableCell>
                  <TableCell className="py-4 px-5 text-gray-800 text-theme-sm">
                    <Badge
                      size="sm"
                      color={getStatusColor(workOrder.status)}
                    >
                      {workOrder.status || "Open"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-5 text-gray-800 text-theme-sm">
                    {formatServiceTasks(workOrder.service_items)}
                  </TableCell>
                  <TableCell className="py-4 px-5 text-gray-800 text-theme-sm">
                    {formatDriver(workOrder.assigned_to)}
                  </TableCell>
                  <TableCell className="py-4 px-5 text-gray-800 text-theme-sm">
                    <div>
                      <span>{formatDate(workOrder.issue_date)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
