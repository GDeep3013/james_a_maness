import PageMeta from "../../components/common/PageMeta";
import MeterDetail from "./MeterDetail";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";

export default function MeterReading() {

  return (
    <>
      <PageMeta
        title="MeterReading"
        description="This is MeterReading page for KAV EXPEDITING"
      />

      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800"
          x-text="pageName"
        >
          Fuels
        </h2>

        <Link to="/meter/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Meter Entry</Button>
        </Link>

      </div>


      <div className="space-y-6">
        <MeterDetail />
      </div>
    </>
  );
}
