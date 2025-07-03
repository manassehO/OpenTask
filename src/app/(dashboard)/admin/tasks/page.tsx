import React from "react";
import Header from "~/_components/dashboard_components/admin/header";
import { TasksTable } from "~/_components/dashboard_components/admin/tasks/TasksTable";

function page() {
  return (
    <div className="relative h-screen w-full">
      <Header title="Tasks" subText="monitor and manage platform tasks" />
      <TasksTable />
    </div>
  );

}

export default page;
