import React from "react";
import Calendar from "../../../../public/images/calendar.svg";
import Diamond from "../../../../public/images/diamond.svg";
import Users from "../../../../public/images/app-reg.svg";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import doctorImage from "../../../../public/images/banner.webp";

type Props = Record<string, never>;

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
};


interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => (
  <h3 className="mb-4 text-xl font-bold text-gray-900">{children}</h3>
);

const SectionText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 leading-relaxed">{children}</p>
);

function page({}: Props): React.JSX.Element {
  const instructionSteps = [
    "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.",
    "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.",
    "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.",
    "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.",
    "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam."
  ];

  const standardText = "Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet vulputate sed venenatis lectus. morbi in aliquam interdum pellentesque.";

  const extendedText = `${standardText} Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet vulputate sed venenatis lectus. morbi in aliquam interdum pellentesque.`;

  return (
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

          <SectionText>{standardText}</SectionText>
        </SectionCard>
        <SectionCard>
          <SectionTitle>Reward & Deadline</SectionTitle>
          <SectionText>{standardText}</SectionText>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <IconTextItem
              icon={Calendar as StaticImageData}
              iconAlt="calendar icon"
              label="DEADLINE"
              value="Monday, 12th October, 2025"
            />
            <IconTextItem
              icon={Diamond as StaticImageData}
              iconAlt="diamond icon"
              label="PRICE"
              value="0.005ETH ≈$2,000"
            />
          </div>
        </SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row max-w-4xl mx-auto justify-between">
          <ActionButton variant="secondary">
            Cancel Task
          </ActionButton>
          <ActionButton variant="primary">
            Submit Task
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default page;
