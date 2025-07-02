import React from "react";
import DisputesTable from "~/_components/dashboard_components/admin/disputes/disputesTable";
import Header from "~/_components/dashboard_components/admin/header";
function page() {
  return (
    <div className="relative h-screen w-full">
      <Header
        title="disputes"
        subText="review and resolve issues between task creators and submitters"
      />
      <DisputesTable />
    </div>
  );
}

export default page;
