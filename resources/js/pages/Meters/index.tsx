import PageMeta from "../../components/common/PageMeta";
import MetersReadingList from "./MetersReadingList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Meters() {

  return (
    <>
      <PageMeta
        title="Meters"
        description="This is Meters page for KAV EXPEDITING"
      />
        <PageBreadcrumb pageTitle="Meters History" />
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Meter History
        </h2>

        <Link to="/meter-history/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Meter Entry</Button>
        </Link>

      </div>


      <div className="space-y-6">
        <MetersReadingList />
      </div>
    </>
  );
}
