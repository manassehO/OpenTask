"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import classNames from "classnames";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  isTaskCreator: boolean;
  image: string;
  status: "active" | "inactive";
}

const mockUsers: User[] = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    isTaskCreator: i % 2 === 0,
    image: "",
    status: i % 3 === 0 ? "inactive" : "active",
  }));

export default function Page() {
  const [activeTab, setActiveTab] = useState<"all" | "creators">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const filteredUsers = useMemo(() => {
    const list =
      activeTab === "creators"
        ? mockUsers.filter((user) => user.isTaskCreator)
        : mockUsers;

    return list.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activeTab, searchQuery]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Deactivate user
  const toggleUserStatus = (userId: string) => {
    const userIndex = mockUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1 && mockUsers[userIndex]) {
      mockUsers[userIndex].status =
        mockUsers[userIndex].status === "active" ? "inactive" : "active";
      // Force re-render by updating state
      setSearchQuery((prev) => prev + " ");
      setTimeout(() => setSearchQuery((prev) => prev.trim()), 0);
    }
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-700">Users</h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab("all");
            }}
            className={classNames("rounded-md px-4 py-2 transition-colors", {
              "bg-[#3b82f6] font-semibold text-white hover:bg-[#3b73f6]":
                activeTab === "all",
              "text-gray-500 hover:bg-gray-100": activeTab !== "all",
            })}
          >
            Users
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab("creators");
            }}
            className={classNames("rounded-md px-4 py-2 transition-colors", {
              "bg-[#3b82f6] font-semibold text-white hover:bg-[#3b73f6]":
                activeTab === "creators",
              "text-gray-500 hover:bg-gray-100": activeTab !== "creators",
            })}
          >
            Task Creators
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-4 text-gray-600 md:w-auto md:flex-row md:items-center">
          <div className="md:w-120 relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded bg-[#ffffff] py-2 pl-10 pr-3"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#155dfc]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#155dfc]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#155dfc]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#155dfc]">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#155dfc]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-900">
                  <Image
                    src={user.image || "/noavatar.png"}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {user.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {user.isTaskCreator ? "Task Creator" : "General User"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/users/${user.id}`} // Changed this line
                      className="mr-2 text-xs text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                        user.status === "active"
                          ? "bg-[#fff3f2] text-red-600 hover:bg-[#ffeaed]"
                          : "bg-[#f0fdf4] text-green-600 hover:bg-[#dcfce7]"
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simplified Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center rounded px-3 py-1 ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-[#3b82f6] hover:bg-[#3b82f6] hover:text-black"
            }`}
          >
            &lt; Previous
          </button>

          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center rounded px-3 py-1 ${
              currentPage === totalPages
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-[#3b82f6] hover:bg-[#3b82f6] hover:text-black"
            }`}
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
