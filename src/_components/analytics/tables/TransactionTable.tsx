import React from 'react';
import { ReusableTable } from '../ReusableTable';
import { type Transaction } from '~/types/analytics';
import { getColumns } from '../columns/transactionColumn';

export const TransactionTable = ({ results }: { results: Transaction[] }) => {
  return (
    <div className="mt-20">
      <h1 className="mb-6 mt-4 text-lg font-bold">Transaction History</h1>
      <ReusableTable data={results} columns={getColumns()} />
    </div>
  );
};
