import React from "react";
import DisputesTable from "~/_components/dashboard_components/admin/disputes/disputesTable";
import Header from "~/_components/dashboard_components/admin/disputes/header";
function page() {
  return (
    <div className="relative h-screen w-full">
      <Header />
      <DisputesTable />
    </div>
  );
}

export default page;
