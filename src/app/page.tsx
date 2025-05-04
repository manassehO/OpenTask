import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import Modules from "~/app/_components/dashboard_components/Modules"; // fix path if different
import { HowItWorks } from "~/app/_components/HowItWorks";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center text-black">
        <h1 className="text-5xl font-extrabold tracking-tight mt-10 sm:text-[5rem] mb-12">
          OpenTask
        </h1>

        <HowItWorks />
        
        <div className="w-full bg-[#1f1f1f] text-white">
          <Modules />
        </div>
      </main>
    </HydrateClient>
  );
}
