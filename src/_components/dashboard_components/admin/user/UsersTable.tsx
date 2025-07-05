'use client';

import { ChevronBackOutline, ChevronNextOutline } from 'public/svg/generalSvg';
import { useState, useMemo } from 'react';
import { ReusableTable } from '~/_components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import { MdSearch } from 'react-icons/md';

interface User {
  id: string;
  name: string;
  email: string;
  isTaskCreator: boolean;
  image: string;
  status: 'active' | 'inactive';
}

// Initialize mock users outside the component
const initialMockUsers: User[] = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    isTaskCreator: i % 2 === 0,
    image: '',
    status: i % 3 === 0 ? 'inactive' : 'active',
  }));

export default function UsersTable() {
  const [activeTab, setActiveTab] = useState<'all' | 'creators'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>(initialMockUsers); // Use state for users
  const usersPerPage = 15;

  const filteredUsers = useMemo(() => {
    const baseUsers =
      activeTab === 'creators'
        ? users.filter((user) => user.isTaskCreator)
        : users;

    return baseUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activeTab, searchQuery, users]); // Add users to dependencies

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Status style configuration
  const statusStyle: Record<string, string> = {
    active:
      'bg-[#E0F2F1] text-[#00796B] px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium',
    inactive:
      'bg-[#FDE2E1] text-[#DC2626] px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium',
  };

  // User type style configuration
  const userTypeStyle: Record<string, string> = {
    true: 'bg-[#E0F7FA] text-[#00ACC1] px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium',
    false:
      'bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium',
  };

  // Table columns configuration
  const columns = [
    {
      header: 'Name',
      accessor: (row: User) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.image || '/noavatar.png'}
            alt={row.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.name}
          </span>
        </div>
      ),
      className: '!text-[#3B82F6] !text-sm font-semibold',
    },
    {
      header: 'Email',
      accessor: (row: User) => (
        <span className="text-xs font-semibold text-[#121212] sm:text-sm">
          {row.email}
        </span>
      ),
      className: '!text-[#3B82F6] !text-sm font-semibold',
    },
    {
      header: 'Status',
      accessor: (row: User) => (
        <span className={statusStyle[row.status]}>{row.status}</span>
      ),
      className: '!text-[#3B82F6] !text-sm font-semibold !capitalize',
    },
    {
      header: 'Type',
      accessor: (row: User) => (
        <span className={userTypeStyle[String(row.isTaskCreator)]}>
          {row.isTaskCreator ? 'Task Creator' : 'General User'}
        </span>
      ),
      className: '!text-[#3B82F6] !text-sm font-semibold !capitalize',
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users/${row.id}`}
            className="rounded bg-transparent px-3 py-1 text-xs font-medium text-[#3B82F6] hover:text-[#3B82F6]/90 sm:text-sm"
          >
            View
          </Link>
          <button
            onClick={() => toggleUserStatus(row.id)}
            className={`rounded px-3 py-1 text-xs font-medium sm:text-sm ${
              row.status === 'active'
                ? 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA]'
                : 'bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]'
            }`}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
      className: '!text-[#3B82F6] !text-sm font-semibold',
    },
  ];

  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'active' ? 'inactive' : 'active',
            }
          : user,
      ),
    );
  };

  return (
    <div className="custom-scrollbar h-screen max-w-full space-y-6 rounded-md py-4 pl-4 sm:py-8 sm:pl-8 md:pb-10 md:pl-10 md:pt-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab('all');
            }}
            className={classNames('rounded-md px-4 py-2 transition-colors', {
              'bg-[#3b82f6] font-semibold text-white': activeTab === 'all',
              'text-gray-500 hover:bg-gray-100': activeTab !== 'all',
            })}
          >
            Users
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              setActiveTab('creators');
            }}
            className={classNames('rounded-md px-4 py-2 transition-colors', {
              'bg-[#3b82f6] font-semibold text-white': activeTab === 'creators',
              'text-gray-500 hover:bg-gray-100': activeTab !== 'creators',
            })}
          >
            Task Creators
          </button>
        </div>

        <div className="relative w-full md:w-[30rem]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="h-5 w-5 text-gray-400" />
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

      {/* Reusable Table */}
      <ReusableTable<User>
        columns={columns}
        data={paginatedUsers}
        className="mb-4"
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pr-9">
        <button
          type="button"
          role="navigation"
          onClick={handlePrevious}
          aria-label="previous page button"
          disabled={currentPage === 1}
          className={`flex items-center gap-1 text-base font-semibold ${
            currentPage !== 1
              ? 'cursor-pointer text-[#3B82F6] hover:text-[#3B82F6]/80'
              : 'cursor-not-allowed text-[#414141]'
          }`}
        >
          <ChevronBackOutline />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          role="navigation"
          onClick={handleNext}
          aria-label="next page button"
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 text-base font-semibold ${
            currentPage !== totalPages
              ? 'cursor-pointer text-[#3B82F6] hover:text-[#3B82F6]/80'
              : 'cursor-not-allowed text-[#414141]'
          }`}
        >
          <span>Next</span>
          <ChevronNextOutline />
        </button>
      </div>
    </div>
  );
}
