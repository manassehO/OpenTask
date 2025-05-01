import GreetingCard from "../_components/dashboard_components/greeting-card";

function page() {
  const name = "Bartholomew Favour";

  return <div className="h-full w-full bg-[#FAFAFA] text-black">
    <GreetingCard name={name} />
  </div>;
}

export default page;