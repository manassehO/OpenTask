import { type ReusableTableProps } from '~/types/analytics';

export const ReusableTable = <T,>({
  data,
  columns,
  showSerialNumber = false,
  className = '',
  emptyText = 'No records found',
}: ReusableTableProps<T>) => {
  return (
    <div
      className={`custom-scrollbar overflow-x-auto rounded-md border border-black-20 md:rounded-xl ${className}`}
    >
      <table className="min-w-full divide-y divide-black-20 text-xs md:text-sm">
        <thead className="bg-main-50">
          <tr>
            {showSerialNumber && (
              <th className="px-4 py-3 text-left font-semibold text-black-100">
                #
              </th>
            )}
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 font-semibold text-black-100 text-${col.align ?? 'start'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black-20 text-neutral-800">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {showSerialNumber && (
                  <td className="px-4 py-3">{rowIndex + 1}</td>
                )}
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 md:whitespace-nowrap text-${col.align ?? 'start'}`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : col.key
                        ? String(row[col.key] ?? '')
                        : ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showSerialNumber ? 1 : 0)}
                className="px-4 py-6 text-center italic text-neutral-800"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
