import Image from 'next/image';
import { type Column, type Transaction } from '~/types/analytics';

export const getColumns = (): Column<Transaction>[] => [
  {
    label: 'Type',
    key: 'type',
  },
  {
    label: 'Recipient',
    key: 'recipient',
    render: (row) => {
      return (
        <div className="mr-4 flex items-center space-x-4">
          <Image
            src={row.image}
            width={40}
            height={40}
            className="size-10 rounded-full"
            alt={row.recipient}
          />
          <p>{row.recipient}</p>
        </div>
      );
    },
  },
  {
    label: 'Date',
    key: 'date',
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
        Completed: {
          bg: 'bg-success-100',
          border: 'border-success-600',
          text: 'text-success-600',
        },
        Failed: {
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
    label: 'Amount',
    key: 'amount',
  },
];
