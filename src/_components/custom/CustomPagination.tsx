import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

interface PaginationProps {
  offset: number;
  limit: number;
  totalRecords: number;
  onPrev: () => void;
  onNext: () => void;
}

export const CustomPagination = ({
  offset,
  limit,
  totalRecords,
  onPrev,
  onNext,
}: PaginationProps) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        className="inline-flex items-center space-x-1 rounded-lg px-4 py-2 disabled:opacity-50"
        onClick={onPrev}
        disabled={offset === 0}
      >
        <GoChevronLeft /> <span>Prev</span>
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </span>

      <button
        className="inline-flex items-center space-x-1 rounded-lg px-4 py-2 disabled:opacity-50"
        onClick={onNext}
        disabled={offset + limit >= totalRecords}
      >
        <span>Next</span> <GoChevronRight />
      </button>
    </div>
  );
};
