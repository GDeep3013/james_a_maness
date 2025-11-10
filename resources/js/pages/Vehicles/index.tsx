import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VehicleList from "./VehicleList";
import Tabs from "../../components/tabs/tabs";
import { PlusIcon, UserIcon } from "../../icons";
import Button from "../../components/ui/button/Button";

export default function Vehicles() {

    const tabItems = [
        {
            title: "Vehicle List",
            key: "vehicle-list",
            icon: <UserIcon />,
            component: <VehicleList />
        },
        {
            title: "Vehicle Details",
            key: "vehicle-details",
            icon: <UserIcon />,
            component: <p>Vehicle Details</p>
        }
    ];
  const [selectedTab, setSelectedTab] = useState(tabItems[0].key);



  return (
    <>
      <PageMeta
        title="Vehicles"
        description="This is Vehicles page for KAV EXPEDITING"
      />

      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Vehicles
        </h2>

        <Button size="sm" variant="primary"> <PlusIcon /> Add Vehicle</Button>

      </div>
      <div className="space-y-6">
        <Tabs
            items={tabItems}
            selected={selectedTab}
            onSelect={(item) => setSelectedTab(item)}
        />
      </div>
    </>
  );
}