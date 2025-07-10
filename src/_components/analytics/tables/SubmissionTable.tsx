import React from 'react';
import { ReusableTable } from '../ReusableTable';
import { getColumns } from '../columns/submissionColumn';
import { type SubmissionProps } from '~/types/analytics';

export const SubmissionTable = ({
  results,
}: {
  results: SubmissionProps[];
}) => {
  const onView = (row: SubmissionProps) => {
    console.log('view', row);
  };

  const onReview = (row: SubmissionProps) => {
    console.log('review', row);
  };
  return (
    <ReusableTable data={results} columns={getColumns({ onView, onReview })} />
  );
};
