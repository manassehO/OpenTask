'use client';

import React from 'react';

export default function UserDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8 bg-gray-50 p-4 md:p-8">
      {/* back link */}
      <div className="h-3 w-24 rounded bg-gray-300" />

      {/* profile + deactivate */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        {/* avatar + info */}
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-300" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-300" />
            <div className="h-3 w-48 rounded bg-gray-200" />
          </div>
        </div>
        {/* button */}
        <div className="h-10 w-28 rounded bg-gray-300" />
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded bg-white p-4">
            <div className="h-8 w-8 rounded bg-gray-300" />
            <div className="h-3 w-24 rounded bg-gray-300" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* tasks section header */}
      <div className="h-5 w-24 rounded bg-gray-300" />

      {/* tabs */}
      <div className="flex gap-4">
        <div className="h-8 w-28 rounded bg-gray-300" />
        <div className="h-8 w-28 rounded bg-gray-200" />
      </div>

      {/* task cards (horizontal scroll area) */}
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="min-w-[240px] overflow-hidden rounded-lg bg-white sm:min-w-[280px] lg:min-w-[395px]"
          >
            <div className="h-36 bg-gray-300" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-40 rounded bg-gray-300" />
              <div className="h-3 w-56 rounded bg-gray-200" />
              <div className="flex justify-between pt-4">
                <div className="h-4 w-12 rounded bg-gray-300" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
