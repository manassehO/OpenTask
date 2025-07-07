import { type Column, type SubmissionProps } from '~/types/analytics';
import { IoIosStar } from 'react-icons/io';
import { IoIosStarOutline } from 'react-icons/io';
import Image from 'next/image';

type ActionHandlers = {
  onView?: (row: SubmissionProps) => void;
  onReview?: (row: SubmissionProps) => void;
};

export const getColumns = (
  handlers: ActionHandlers,
): Column<SubmissionProps>[] => [
  {
    label: 'User',
    key: 'name',
    render: (row) => {
      return (
        <div className="mr-4 flex items-center space-x-4">
          <Image
            src={row.image ?? '/default-avatar.png'}
            className="size-10 rounded-full"
            width={40}
            height={40}
            alt={row.name}
          />
          <p>{row.name}</p>
        </div>
      );
    },
  },
  {
    label: 'Submitted',
    key: 'submittedAt',
  },
  {
    label: 'Status',
    key: 'status',
    render: (row) => {
      const statusStyles: Record<
        string,
        { bg: string; border: string; text: string }
      > = {
        Pending: {
          bg: 'bg-warning-50',
          border: 'border-warning-400',
          text: 'text-warning-400',
        },
        Approved: {
          bg: 'bg-success-100',
          border: 'border-success-600',
          text: 'text-success-600',
        },
        Rejected: {
          bg: 'bg-error-100',
          border: 'border-error-600',
          text: 'text-error-600',
        },
      };

      const style = statusStyles[row.status] ?? {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-600',
      };

      return (
        <button
          className={`min-w-[120px] rounded-[16px] border px-4 py-[6px] text-center ${style.bg} ${style.border} ${style.text}`}
        >
          {row.status}
        </button>
      );
    },
  },
  {
    label: 'Quality',
    key: 'quality',
    render: (row) => {
      const maxStars = 5;
      return (
        <div className="flex text-lg text-warning-300">
          {Array.from({ length: maxStars }, (_, i) => (
            <span key={i}>
              {i < row.quality ? (
                <IoIosStar />
              ) : (
                <IoIosStarOutline className="text-neutral-800" />
              )}
            </span>
          ))}
        </div>
      );
    },
  },

  {
    label: 'Action',
    render: (row) => (
      <div className="">
        {row.status === 'Approved' ? (
          <button
            className="min-w-32 cursor-pointer rounded-lg border border-primary bg-main-100 px-4 py-2 text-center text-primary hover:bg-primary hover:text-main-100"
            onClick={() => handlers.onView?.(row)}
          >
            View
          </button>
        ) : (
          <button
            className="min-w-32 cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-center text-main-100 hover:bg-primary/90"
            onClick={() => handlers.onView?.(row)}
          >
            Review
          </button>
        )}
      </div>
    ),
  },
];
