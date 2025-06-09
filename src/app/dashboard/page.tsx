import GreetingCard from "../_components/dashboard_components/greeting-card";
import RecomendedTasks from "../_components/dashboard_components/recomended-tasks";
import Summary from "../_components/dashboard_components/summary";

function page() {
  const name = "Bartholomew Favour";

  return <div className="h-full w-full bg-[#FAFAFA] text-black">
    <GreetingCard name={name} />
    <Summary />
    <RecomendedTasks />
  </div>;
}

export default page;