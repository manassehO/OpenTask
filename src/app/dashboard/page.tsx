import GreetingCard from "~/_components/dashboard_components/greeting-card";
import RecomendedTasks from "~/_components/dashboard_components/recomended-tasks";
import Summary from "~/_components/dashboard_components/summary";
import RightBar from "~/_components/layout/RightBar";

function page() {
  const name = "Bartholomew Favour";

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-row items-start text-black">
      <div className="w-full">
        <GreetingCard name={name} />
        <Summary />
        <RecomendedTasks />
      </div>

      <div className="w-25%">
        <RightBar />
      </div>
    </div>
  );
}

export default page;
