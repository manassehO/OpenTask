"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

interface User {
  id: string;
  name: string;
  email: string;
  isTaskCreator: boolean;
  image: string;
  status: "active" | "inactive";
  dateJoined: string;
  lastTask: string;
}

const mockUsers: User[] = Array(50)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    name: "Ikem Hood",
    email: "user1@gmail.com",
    isTaskCreator: i % 2 === 0,
    image: "",
    status: "active",
    dateJoined: "25/10/2024",
    lastTask: "25/10/2024",
  }));

export default function UsersPageClient() {
  const [activeTab, setActiveTab] = useState<"all" | "creators">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "email" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = useMemo(() => {
    const list =
      activeTab === "creators"
        ? mockUsers.filter((user) => user.isTaskCreator)
        : mockUsers;

    const searched = list.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return searched.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }, [activeTab, searchQuery, sortKey]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-blue-600">Users</h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab("all");
            }}
            className={classNames("pb-1", {
              "border-b-2 border-blue-600 font-semibold text-blue-600":
                activeTab === "all",
              "text-gray-500 hover:text-blue-600": activeTab !== "all",
            })}
          >
            All Users
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab("creators");
            }}
            className={classNames("pb-1", {
              "border-b-2 border-blue-600 font-semibold text-blue-600":
                activeTab === "creators",
              "text-gray-500 hover:text-blue-600": activeTab !== "creators",
            })}
          >
            Task Creators
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full rounded border px-3 py-2 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as "name" | "email" | "status")
            }
            className="rounded border px-2 py-2 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email Address",
                "Date Joined",
                "Status",
                "Last Task",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedUsers.map((user) => (
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
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.dateJoined}
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
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.lastTask}
                </td>
                <td className="space-x-4 px-4 py-3 text-sm">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <button className="text-xs text-red-600 hover:underline">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
        <p>
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * usersPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * usersPerPage, filteredUsers.length)}
          </span>{" "}
          of <span className="font-medium">{filteredUsers.length}</span> results
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={classNames("rounded border px-3 py-1", {
                "bg-blue-50 font-semibold text-blue-600": page === currentPage,
              })}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
