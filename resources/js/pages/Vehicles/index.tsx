// import React, { useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VehicleList from "./VehicleList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import VehicleOverview from "./VehicleOverview";

export default function Vehicles() {


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

        <Link to="/vehicles/add">
          <Button size="sm" variant="primary" className="min-w-[190px] !bg-[#5321B1]"> <PlusIcon /> Add New Vehicle</Button>
        </Link>


      </div>
      <div className="space-y-6">
        <VehicleOverview />
        <VehicleList />
      </div>
    </>
  );
}