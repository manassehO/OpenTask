import { HydrateClient } from "~/trpc/server";
import Modules from "~/app/_components/dashboard_components/Modules"; // fix path if different

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center text-white py-12">
        <h1 className="text-5xl font-extrabold tracking-tight mt-10 sm:text-[5rem] mb-12">
          OpenTask
        </h1>

        <Modules />
      </main>
    </HydrateClient>
  );
}
