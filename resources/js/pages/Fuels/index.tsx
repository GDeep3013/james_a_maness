import PageMeta from "../../components/common/PageMeta";
import FuelsList from "./FuelsList";
import FuelOverview from "./FuelOverview";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Fuels() {

  return (
    <>
      <PageMeta
        title="Fuels"
        description="This is Fuels page for KAV EXPEDITING"
      />
       <PageBreadcrumb pageTitle="Fuels & Gas Stations" />
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Fuels
        </h2>

        <Link to="/fuels/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Fuels</Button>
        </Link>

      </div>


      <div className="space-y-6">
        <FuelOverview />
        <FuelsList />
      </div>
    </>
  );
}
