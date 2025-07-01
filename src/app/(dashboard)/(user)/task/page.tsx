<<<<<<< HEAD:src/app/dashboard/task/page.tsx
"use client";
=======
import React from "react";
import Calendar from "../../../../../public/images/calendar.svg";
import Diamond from "../../../../../public/images/diamond.svg";
import Users from "../../../../../public/images/app-reg.svg";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import doctorImage from "../../../../../public/images/banner.webp";
>>>>>>> bf1a3392a66982e972a311e0a62d88defd79dc33:src/app/(dashboard)/(user)/task/page.tsx

import { useState } from "react";
import TaskCard from "~/_components/dashboard_components/dashbodard-task/TaskCard";

<<<<<<< HEAD:src/app/dashboard/task/page.tsx
type Task = {
  id: string;
  title: string;
  status: "Active task" | "Draft task" | "Completed task";
  type:
    | "testing"
    | "survey"
    | "pending"
    | "review"
    | "draft"
    | "research"
    | "completed";
  progress: number;
  submissions: number;
  eth: string;
  deadline: string;
  substatus: "testing" | "survey";
=======
interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard = ({ children, className = "" }: SectionCardProps) => (
  <div className={`mb-6 rounded-lg bg-white p-6 shadow-sm max-w-4xl mx-auto ${className}`}>
    {children}
  </div>
);
interface IconTextItemProps {
  icon: StaticImageData | { src: string; height: number; width: number };
  iconAlt: string;
  label: string;
  value: string;
  iconSize?: string;
}

const IconTextItem = ({
  icon,
  iconAlt,
  label,
  value,
  iconSize = "h-10 w-10"
}: IconTextItemProps) => (
  <div className="flex items-center space-x-3">
    <div className="flex items-center justify-center rounded-full bg-gray-50 p-3">
      <Image src={icon} alt={iconAlt} className={iconSize} />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);


interface InstructionStepProps {
  stepNumber: number;
  description: string;
}

const InstructionStep = ({ stepNumber, description }: InstructionStepProps) => (
  <div className="flex items-start space-x-3">
    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-black"></div>
    <p className="text-gray-600">
      <span className="font-medium">Step {stepNumber}:</span> {description}
    </p>
  </div>
);

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const ActionButton = ({
  children,
  variant = 'primary',
  onClick,
  className = ""
}: ActionButtonProps) => {
  const baseClasses = "w-[45%] rounded-lg px-6 py-3 transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
>>>>>>> bf1a3392a66982e972a311e0a62d88defd79dc33:src/app/(dashboard)/(user)/task/page.tsx
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Test a new web3 wallet interface",
    status: "Active task",
    type: "testing",
    progress: 40,
    submissions: 24,
    eth: "0.08 / 0.1 ETH",
    deadline: "Apr 25, 2025",
    substatus: "testing",
  },
  {
    id: "2",
    title: "Complete a short survey about DeFi",
    status: "Active task",
    type: "survey",
    progress: 80,
    submissions: 45,
    eth: "0.05 / 0.1 ETH",
    deadline: "Apr 25, 2025",
    substatus: "testing",
  },
  {
    id: "3",
    title: "Test a new web3 wallet interface",
    status: "Draft task",
    type: "review",
    progress: 0,
    submissions: 0,
    eth: "Planned Budget: 0.08/0.1 ETH",
    deadline: "Last Edited: Apr 25,2025",
    substatus: "testing",
  },
  {
    id: "4",
    title: "Participate in a user study for a new dApp",
    status: "Draft task",
    type: "research",
    progress: 0,
    submissions: 0,
    eth: "Planned Budget: 0.08/0.1 ETH",
    deadline: "Last Edited: Apr 25,2025",
    substatus: "testing",
  },
  {
    id: "5",
    title: "Test a new web3 wallet interface",
    status: "Completed task",
    type: "testing",
    progress: 40,
    submissions: 24,
    eth: "0.08/0.1 ETH",
    deadline: "Mar 20, 2025",
    substatus: "testing",
  },
  {
    id: "6",
    title: "Complete a short survey about DeFi",
    status: "Completed task",
    type: "survey",
    progress: 80,
    submissions: 24,
    eth: "0.08/0.1 ETH",
    deadline: "Jan 10, 2025",
    substatus: "survey",
  },
];

export default function TasksPage() {
  const [tab, setTab] = useState("Active task");

  const filteredTasks = tasks.filter((task) => task.status === tab);

  return (
<<<<<<< HEAD:src/app/dashboard/task/page.tsx
    <div className="mx-auto md:p-4">
      <h1 className="md:text-[28px] texi-xl font-bold capitalize">task</h1>
      {/* Tab Navigation */}
      <div className="mb-4 flex w-full md:max-w-[464px] overflow-x-auto bg-white p-2">
        {["Active task", "Draft task", "Completed task"].map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`w-full whitespace-nowrap rounded px-4 py-2 text-sm font-medium ${
              tab === status
                ? "bg-primary text-white"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
=======
    <div className="min-h-screen px-4 py-[3em] text-black">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Complete A Short Survey About Defi
        </h1>
        <div className="mb-8">
          <Image src={doctorImage} alt="docture image" />
        </div>
        <SectionCard>
          <SectionTitle>Description</SectionTitle>
          <SectionText>{extendedText}</SectionText>
        </SectionCard>
        <SectionCard className="p-4">
          <IconTextItem
            icon={Users as StaticImageData}
            iconAlt="users icon"
            label="Task Spots Left"
            value="99 spots left of 100"
          />
        </SectionCard>
        <SectionCard>
          <SectionTitle>Instructions</SectionTitle>
          <SectionText>{standardText}</SectionText>

          <div className="mb-6 mt-6 space-y-4">
            {instructionSteps.map((description, index) => (
              <InstructionStep
                key={index}
                stepNumber={index + 1}
                description={description}
              />
            ))}
          </div>
>>>>>>> bf1a3392a66982e972a311e0a62d88defd79dc33:src/app/(dashboard)/(user)/task/page.tsx

      {/* Task Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

