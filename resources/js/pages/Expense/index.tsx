import PageMeta from "../../components/common/PageMeta";
import ExpenseHistoryList from "./ExpenseHistoryList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Expense() {

  return (
    <>
      <PageMeta
        title="Expense"
        description="This is Expense page for KAV EXPEDITING"
      />
      <PageBreadcrumb pageTitle="Expense History" />
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Expense History
        </h2>

        <Link to="/expense-history/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Expense Entry</Button>
        </Link>

      </div>


      <div className="space-y-6">
        <ExpenseHistoryList />
      </div>
    </>
  );
}
