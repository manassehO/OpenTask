'use client';

import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function Modules() {
  const modules = [
    {
      id: 1,
      title: 'Module 1',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      id: 2,
      title: 'Module 2',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      id: 3,
      title: 'Module 3',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      id: 4,
      title: 'Module 4',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      id: 5,
      title: 'Module 5',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      id: 6,
      title: 'Module 6',
      description: 'Lorem ipsum dolor sit amet consectetur',
    },
  ];

  const [completed, setCompleted] = useState<number[]>([1]); // Assume module 1 completed initially

  const handleModuleClick = (id: number) => {
    setCompleted((prev) =>
      prev.includes(id)
        ? prev.filter((moduleId) => moduleId !== id)
        : [...prev, id],
    );
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl rounded-lg bg-white p-8">
        <h2 className="mb-8 text-2xl font-bold text-black">Modules</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {modules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => handleModuleClick(mod.id)}
              className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 p-6 shadow transition hover:shadow-lg"
            >
              <div className="flex items-center gap-1">
                <h3 className="text-lg text-black">{mod.title}</h3>
                <span className="text-black">:</span>
                <p className="text-sm text-black">{mod.description}</p>
              </div>

              <div>
                {completed.includes(mod.id) ? (
                  <FaCheckCircle className="text-xl text-green-500" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="white"
                    >
                      <path d="M400-280v-400l200 200-200 200Z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-right">
          <button className="mt-20 transform rounded bg-[#3B82F6] px-48 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
            Done
          </button>
        </div>
      </div>
    </>
  );
}
