import PageMeta from "../../components/common/PageMeta";
import VendorsList from "./VendorsList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Vendors() {

  return (
    <>
      <PageMeta
        title="Vendors"
        description="This is Vendors page for KAV EXPEDITING"
      />
        <PageBreadcrumb pageTitle="Vendors" />
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Vendors
        </h2>

        <Link to="/vendors/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Vendors</Button>
        </Link>

      </div>


      <div className="space-y-6">
        <VendorsList />
      </div>
    </>
  );
}
