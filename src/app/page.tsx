import Link from "next/link";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          OpenTask
        </h1>
        <Link
          href="/landing"
          className="mt-5 text-base font-medium text-white underline"
        >
          View Landing Page
        </Link>
      </main>
    </HydrateClient>
  );
}
