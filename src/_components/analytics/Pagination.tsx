import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';

export const Pagination = ({
  totalPages,
  setCurrentPage,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}) => {
  return (
    <div>
      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-between text-black-100">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaChevronLeft className="size-3" />
            <span>Previous</span>
          </button>

          <button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="inline-flex items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <FaChevronRight className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
};
