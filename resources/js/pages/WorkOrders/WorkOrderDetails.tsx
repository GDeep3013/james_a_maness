import React from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function WorkOrderDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <PageMeta
                title="Work Order Details"
                description="View work order details"
            />
            <PageBreadcrumb
                pageTitle={[
                    { name: "Work Orders", to: "/work-orders" },
                    { name: `Work Order #${id || ""}`, to: `/work-orders/${id || ""}` },
                ]}
            />
        </>
    );
}

