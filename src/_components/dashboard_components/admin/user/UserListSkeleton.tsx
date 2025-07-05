'use client';

import React from 'react';

export default function UserListSkeleton() {
  return (
    <div className="animate-pulse space-y-6 bg-gray-50 p-4 md:p-8">
      {/* Page title */}
      <div className="h-6 w-40 rounded bg-gray-300" />

      {/* Tabs + search row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Tabs */}
        <div className="flex gap-3">
          <div className="h-9 w-24 rounded bg-gray-300" />
          <div className="h-9 w-32 rounded bg-gray-200" />
        </div>

        {/* Search bar */}
        <div className="max-w-md flex-1 md:flex-none">
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
      </div>

      {/* Table header */}
      <div className="hidden grid-cols-[160px_160px_120px_120px_120px] gap-4 sm:grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200" />
        ))}
      </div>

      {/* Table rows */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 gap-4 rounded bg-white p-4 shadow-sm sm:grid-cols-[160px_160px_120px_120px_120px]"
          >
            {/* Name cell with avatar */}
            <div className="flex animate-pulse items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
            {/* Email */}
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            {/* Status */}
            <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 sm:block" />
            {/* Type */}
            <div className="hidden h-4 w-24 animate-pulse rounded bg-gray-200 sm:block" />
            {/* Actions */}
            <div className="hidden h-6 w-64 animate-pulse rounded bg-gray-200 sm:block" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="h-8 w-24 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-300" />
        <div className="h-8 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}
