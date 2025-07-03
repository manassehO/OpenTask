'use client';
import { ChevronBackOutline, ChevronNextOutline } from 'public/svg/generalSvg';
import { useState } from 'react';
import { ReusableTable } from '~/_components/ui/table';
import { mockTasks } from '~/mocks/tasks';
import { type Task as TaskProps } from '~/types/task';
export const TasksTable = () => {
  const [allTasks, setAllTasks] = useState<TaskProps[]>(mockTasks);
  const tasksPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * tasksPerPage;
  const indexOfFirstItem = indexOfLastItem - tasksPerPage;
  const paginatedItems = allTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(allTasks.length / tasksPerPage);

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
    active:
      'bg-[#F2FCF5] text-[#34C759] px-4 text-center capitalize py-1.5 rounded-full text-xs sm:text-sm font-medium',
    disputed:
      'px-4 py-1.5 rounded-full bg-[#FDECCE] text-center text-[#F59E0B] capitalize text-xs sm:text-sm font-medium',
    cancelled:
      'px-4 py-1.5 rounded-full bg-[#FDE2E1] text-center text-[#DC2626] capitalize text-xs sm:text-sm font-medium',
    completed:
      'px-4 py-1.5 rounded-full bg-[#E6F4EA] text-center text-[#15803D] capitalize text-xs sm:text-sm font-medium',
  };

  const columns = [
    {
      header: 'task',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.title}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'category',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.category}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'status',
      accessor: (row: TaskProps) => {
        const status = row.status.trim().toLowerCase();
        return <span className={` ${statusStyle[status]} `}>{row.status}</span>;
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'reward',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            ${row.rewardInUsd}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'creator',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.creator}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'date created',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.deadline}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'completion',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.deadline}
          </span>
        );
      },
      className:
        '!text-[#3B82F6] lg:!text-base !text-sm  font-semibold !capitalize',
    },
    {
      header: 'flaged',
      accessor: (row: TaskProps) => {
        return (
          <span className="text-xs font-semibold text-[#121212] sm:text-sm">
            {row.isFlagged ? '' : '-'}
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
    <div className="custom-scrollbar h-screen max-w-7xl space-y-6 overflow-y-scroll rounded-md bg-white py-4 pl-4 sm:py-8 sm:pl-8 md:pb-10 md:pl-10 md:pt-4">
      <ReusableTable<TaskProps> columns={columns} data={paginatedItems} />
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
};
