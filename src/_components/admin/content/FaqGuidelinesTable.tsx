import Image from 'next/image';
import React from 'react';

type TabType = 'FAQs' | 'Guidelines';

interface FaqGuidelinesTableProps {
  activeTab: TabType;
  filteredData: {
    id: string | number;
    question: string;
    answer: string;
    category?: string;
    time?: string;
  }[];
  getCategoryColor: (category?: string) => string;
}

export const FaqGuidelinesTable: React.FC<FaqGuidelinesTableProps> = ({
  activeTab,
  filteredData,
  getCategoryColor,
}) => {
  return (
    <div>
      <div className="mt-5 w-full overflow-auto whitespace-nowrap rounded-lg border md:mt-10">
        <table className="min-w-full table-auto border text-left text-sm">
          <thead className="bg-main-50 font-semibold text-neutral-900">
            <tr>
              <th className="p-4">Question</th>
              <th className="p-4">Answer</th>
              {activeTab === 'FAQs' && <th className="p-4">Category</th>}
              {activeTab === 'Guidelines' && (
                <th className="p-4">Question Time</th>
              )}
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border text-sm text-neutral-800">
                <td className="w-[213px] px-4 py-2">{item.question}</td>
                <td className="w-[503px] px-4 py-2">{item.answer}</td>
                {activeTab === 'FAQs' && (
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block w-[132px] rounded-full px-4 py-2 text-center text-xs font-semibold ${getCategoryColor(
                        item.category,
                      )}`}
                    >
                      {item.category}
                    </span>
                  </td>
                )}

                {activeTab === 'Guidelines' && (
                  <td className="px-4 py-2">{item.time}</td>
                )}

                <td className="flex w-28 items-center justify-between gap-3 px-4 py-2">
                  <button className="text-blue-600 hover:underline">
                    <Image
                      src="/icons/tableEditIcon.svg"
                      alt="Edit"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Delete Button */}
                  <button className="text-red-600 hover:underline">
                    <Image
                      src="/icons/tableDeleteIcon.svg"
                      alt="Delete"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
              </tr>
            ))}

            {/* No Data Row */}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No items in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
