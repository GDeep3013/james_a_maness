import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import TotalCostMap from "../../components/ecommerce/TotalCostMap";
import FleetPerformanceChart from "../../components/ecommerce/FleetPerformanceChart";
import MaintenanceCostChart from "../../components/ecommerce/MaintenanceCostChart";
import VehiclesInfoCard from "../../components/ecommerce/VehiclesInfoCard";
import ReminderList from "../../components/ecommerce/ReminderList";
import IncompleteWorkOrder from "../../components/ecommerce/IncompleteWorkOrder";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="This is Dashboard page for KAV EXPEDITING"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-6">
          <TotalCostMap />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <FleetPerformanceChart />
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-5">
          <MaintenanceCostChart />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <VehiclesInfoCard />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ReminderList />
        </div>
         <div className="col-span-12 xl:col-span-6">
          <IncompleteWorkOrder />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
