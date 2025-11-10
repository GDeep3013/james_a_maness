import React, { useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DriverList from "./DriversList";
import Tabs from "../../components/tabs/tabs";
import { PlusIcon, UserIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";

export default function Drivers() {

    const tabItems = [
        {
            title: "Driver List",
            key: "driver-list",
            icon: <UserIcon />,
            component: <DriverList />
        },
        {
            title: "Driver Details",
            key: "driver-details",
            icon: <UserIcon />,
            component: <p>Driver Details</p>
        }
    ];
  const [selectedTab, setSelectedTab] = useState(tabItems[0].key);



  return (
    <>
      <PageMeta
        title="Drivers"
        description="This is Drivers page for KAV EXPEDITING"
      />
      
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Drivers
        </h2>

        <Link to="/drivers/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Driver</Button>
        </Link> 

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