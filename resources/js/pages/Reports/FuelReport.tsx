import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function FuelReport() {
  return (
    <>
      <PageMeta
        title="Fuel Report"
        description="View and generate fuel reports"
          />
        <PageBreadcrumb pageTitle="Fuel Report" />
      <div className="space-y-6">
        <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-white/90">
            Fuel Report
          </h2>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Fuel Report content will be displayed here
            </p>
          </div>
        </div>
      </div>
    </>
  );
}











