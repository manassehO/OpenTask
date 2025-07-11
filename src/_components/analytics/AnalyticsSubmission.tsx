import { useEffect, useState } from 'react';
import { submissionData } from '~/mocks/analytics';
import { Search } from './Search';
import { FilterDropdown } from './FilterDropdown';
import { SubmissionTable } from './tables/SubmissionTable';
import { Pagination } from './Pagination';

export const AnalyticsSubmission = () => {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(submissionData);

  const ITEMS_PER_PAGE = 15;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    const lower = query.toLowerCase();

    const filtered = submissionData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(lower) ||
        item.status.toLowerCase().includes(lower) ||
        item.submittedAt.toLowerCase().includes(lower) ||
        String(item.quality).includes(lower);

      const matchesFilter =
        filter === 'All' || item.status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setResults(filtered);
    setCurrentPage(1);
  }, [query, filter]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:gap-9">
        <Search onSearch={setQuery} />
        <FilterDropdown onSelect={setFilter} />
      </div>
      <SubmissionTable results={paginatedResults} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};
