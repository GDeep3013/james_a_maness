import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import VehicleList from "./VehicleList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import VehicleOverview from "./VehicleOverview";
import ImportVehicles from "../../components/vehicles/ImportVehicles";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Vehicles() {

  const [importSuccess, setImportSuccess] = useState(false);

  const handleImportSuccess = () => {
    setImportSuccess(true);
  };

  return (
    <>
      <PageMeta
        title="Vehicles"
        description="This is Vehicles page for KAV EXPEDITING"
      />
      <PageBreadcrumb pageTitle="Asset List" />
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800"
         > Vehicles
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <ImportVehicles onImportSuccess={handleImportSuccess} />

          <Link to="/vehicles/add">
            <Button size="sm" variant="primary" className="md:min-w-[190px]"> <PlusIcon /> Add New Vehicle</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-6">
        <VehicleOverview importSuccess={importSuccess} />
        <VehicleList importSuccess={importSuccess} />
      </div>
    </>
  );
}
