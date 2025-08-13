'use client';
import GreetingCard from '~/_components/dashboard_components/greeting-card';
import RecomendedTasks from '~/_components/dashboard_components/recomended-tasks';
import Summary from '~/_components/dashboard_components/summary';
import RightBar from '~/_components/layout/RightBar';

function Dashboardage() {
  return (
    <div className="flex h-full w-full flex-row items-start bg-[#FAFAFA] text-black">
      <div className="w-full">
        <GreetingCard />
        <Summary />
        <RecomendedTasks />
      </div>

      <div className="w-25%">
        <RightBar />
      </div>
    </div>
  );
}

export default Dashboardage;
