"use client";

import React, { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: FAQItem[];
  questionBgColor?: string;
  answerBgColor?: string;
  textColor?: string;
  openTextColor?: string;
};

const Faq: React.FC<FaqProps> = ({
  items,
  questionBgColor = "bg-gray-100",
  answerBgColor = "bg-blue-600",
  textColor = "text-gray-800",
  openTextColor = "text-white",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const containerBg = isOpen ? answerBgColor : "bg-white";
        const questionBg = isOpen ? answerBgColor : questionBgColor;
        const currentTextColor = isOpen ? openTextColor : textColor;

        return (
          <div
            key={index}
            className={`overflow-hidden rounded-[4px] shadow-sm transition-colors duration-300 ${containerBg}`}
          >
            <button
              onClick={() => toggleIndex(index)}
              className={`w-full p-4 text-left ${questionBg} ${currentTextColor} transition-colors duration-300 hover:opacity-90 focus:outline-none`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold lg:text-xl">
                  {item.question}
                </span>
                <span>{isOpen ? "−" : "+"}</span>
              </div>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] px-4 py-3 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              } ${currentTextColor}`}
              style={{ overflow: "hidden" }}
            >
              <div className="min-h-0 text-sm font-normal lg:text-base">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Faq;
