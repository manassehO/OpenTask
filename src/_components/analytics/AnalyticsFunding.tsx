import React, { useState } from 'react';
import { FundingStats } from './FundingStats';
import { TransactionTable } from './tables/TransactionTable';
import { transactionHistory } from '~/mocks/analytics';
import { Pagination } from './Pagination';

export const AnalyticsFunding = () => {
  const [results] = useState(transactionHistory);

  const ITEMS_PER_PAGE = 15;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <FundingStats />
      <TransactionTable results={paginatedResults} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};
