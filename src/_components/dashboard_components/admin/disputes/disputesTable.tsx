'use client';
import { ChevronBackOutline, ChevronNextOutline } from 'public/svg/generalSvg';
import React, { useState } from 'react';
import { ReusableTable } from '~/_components/ui/table';
import { disputes } from '~/mocks/disputes';
import { type DisputesProps } from '~/types/disputes';
function DisputesTable() {
  const [allDisputes, setAllDisputes] = useState<DisputesProps[]>(disputes);
  const disputesPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * disputesPerPage;
  const indexOfFirstItem = indexOfLastItem - disputesPerPage;
  const paginatedItems = allDisputes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(allDisputes.length / disputesPerPage);
  const handleNext = () => {
    if (currentPage !== totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const statusStyle: Record<string, string> = {
    completed:
      'bg-[#E0F2F1] text-[#00796B] px-4 text-center capitalize py-1.5 rounded-full text-xs sm:text-sm font-medium',
    pending:
      'px-4 py-1.5 rounded-full  bg-[#FDECCE] text-center text-[#F59E0B] capitalize text-xs sm:text-sm font-medium',
    failed:
      'px-4 py-1.5 rounded-full  bg-[#FDE2E1] text-center text-[#DC2626] capitalize text-xs sm:text-sm font-medium',
  };

  const priorityStyle: Record<string, string> = {
    low: 'bg-gray-300 text-gray-600 px-4 text-center capitalize py-1.5 rounded-full text-xs sm:text-sm font-medium',
    medium:
      'bg-[#142B52] text-white px-4 py-1.5 text-center capitalize rounded-full text-xs sm:text-sm font-medium',
    high: 'bg-[#FFCDD2] text-[#C62828] px-4 text-center capitalize py-1.5 rounded-full text-xs sm:text-sm font-medium',
  };

  const columns = [
    {
      header: 'task',
      accessor: (row: DisputesProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.task}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'submitter',
      accessor: (row: DisputesProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.submitter}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'task',
      accessor: (row: DisputesProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.company}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'Status',
      accessor: (row: DisputesProps) => {
        const status = row.status.trim().toLowerCase();
        return <span className={` ${statusStyle[status]} `}>{row.status}</span>;
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'priority',
      accessor: (row: DisputesProps) => {
        return (
          <span className={`${priorityStyle[row.priority]}`}>
            {row.priority}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'Date Submitted',
      accessor: (row: DisputesProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.dateSubmitted}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'action',
      accessor: () => {
        return (
          <div className="flex items-center gap-1">
            <button className="cursor-pointer rounded bg-transparent py-1.5 pr-4 text-xs font-medium text-[#3B82F6] hover:text-[#3B82F6]/90 sm:text-sm">
              View
            </button>{' '}
            <button className="cursor-pointer rounded bg-[#3B82F6] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3B82F6]/90 sm:text-sm">
              Resolved
            </button>
          </div>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
  ];
  return (
    <div className="custom-scrollbar h-screen max-w-full space-y-6 overflow-y-scroll rounded-md bg-white py-4 pl-4 sm:py-8 sm:pl-8 md:pb-10 md:pl-10 md:pt-4">
      <ReusableTable<DisputesProps> columns={columns} data={paginatedItems} />
      <div className="flex items-center justify-between pr-9">
        <button
          type="button"
          role="navigation"
          onClick={handlePrevious}
          aria-label="previous page button"
          className={`${currentPage !== 1 ? 'cursor-pointer text-[#3B82F6] hover:text-[#3B82F6]/80' : 'cursor- cursor-not-allowed text-[#414141]'} flex items-center gap-1 text-base font-semibold`}
        >
          <ChevronBackOutline />
          <span>Previous</span>
        </button>
        <button
          type="button"
          role="navigation"
          onClick={handleNext}
          aria-label="next page button"
          className={`${currentPage !== totalPage ? 'cursor-pointer text-[#3B82F6] hover:text-[#3B82F6]/80' : 'cursor-not-allowed text-[#414141]'} flex items-center gap-1 text-base font-semibold`}
        >
          <span> Next</span>
          <ChevronNextOutline />
        </button>
      </div>
    </div>
  );
}

export default DisputesTable;
