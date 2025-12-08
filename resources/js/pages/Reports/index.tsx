import PageMeta from "../../components/common/PageMeta";
import ReportsList from "./ReportsList";

export default function Reports() {
  return (
    <>
      <PageMeta
        title="Reports"
        description="View and manage all reports"
      />
      <div className="space-y-6">
        <ReportsList />
      </div>
    </>
  );
}

