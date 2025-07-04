import UserDetailPageWrapper from './components/UserDetailPageWrapper';
import UserDetailSkeleton from './components/UserDetailSkeleton';
import { Suspense } from 'react';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailPageWrapper userId={params.id} />
    </Suspense>
  );
}
