"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserDetailPageClientProps {
  userId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  rewardETH: string;
  rewardUSD: string;
}

export default function UserDetailPageClient({
  userId,
}: UserDetailPageClientProps) {
  const router = useRouter();

  // Mock user data – replace with real API fetch
  const user = {
    id: userId,
    name: "Ikem Hood",
    email: "user123@gmail.com",
    phone: "+2348078868319",
    status: "active",
    avatar: "", // <- Empty simulates no avatar available
    balanceUSD: 2000,
    disputes: 3,
    tasksCompleted: 2000,
    tasksCreated: 15,
    activeTasks: 3,
  };

  const tasks: Task[] = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i.toString(),
      title: "Complete a short survey about defi",
      description:
        "Lorem ipsum dolor sit amet consectetur. Ultricies ultricies mauris morbi aenean pellentesque",
      rewardETH: "0.005 ETH",
      rewardUSD: "$2,000",
    }));

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Users
        </button>
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
      </div>

      {/* Profile */}
      <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <a
            href={user.avatar || "/noavatar.png"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={user.avatar || "/noavatar.png"}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-full transition-transform hover:scale-105"
            />
          </a>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-1 text-xs ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
        <button className="rounded bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100">
          Deactivate
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Balance" value={"$" + user.balanceUSD} />
        <StatCard
          label="Tasks Completed"
          value={user.tasksCompleted.toString()}
        />
        <StatCard label="Tasks Created" value={user.tasksCreated.toString()} />
        <StatCard label="Active Tasks" value={user.activeTasks.toString()} />
        <StatCard label="Disputes" value={user.disputes.toString()} />
      </div>

      {/* Admin Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="rounded bg-yellow-50 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100">
          Warn User
        </button>
        <button className="rounded bg-red-100 px-4 py-2 text-sm text-red-700 hover:bg-red-200">
          Suspend User
        </button>
        <button className="rounded bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100">
          Refund
        </button>
      </div>

      {/* Task History */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Task History</h3>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-lg bg-white p-4 shadow">
              <h4 className="mb-1 font-semibold text-gray-800">{task.title}</h4>
              <p className="mb-2 text-sm text-gray-600">{task.description}</p>
              <div className="space-x-4 text-sm text-gray-500">
                <span>{task.rewardETH}</span>
                <span>{task.rewardUSD}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <p className="mb-1 text-xs uppercase text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  );
}
