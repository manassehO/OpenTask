'use client';
import { Suspense } from 'react';
import UserListSkeleton from './components/UserListSkeleton';
import UserListPageClientProps from './components/UserListComponent';

export default function UserListPage() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListPageClientProps />
    </Suspense>
  );
}
