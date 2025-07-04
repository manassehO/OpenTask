// app/(dashboard)/admin/users/[id]/page.tsx
import { Suspense } from 'react';
import UserDetailSkeleton from './components/UserDetailSkeleton';
import UserDetailPageWrapper from './components/UserDetailPageWrapper';

// 🔑 1.  Make the page function async
export default async function UserDetailPage({
  // 🔑 2.  Tell TS that `params` is a Promise
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🔑 3.  Await it once, then use the value
  const { id } = await params;

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailPageWrapper userId={id} />
    </Suspense>
  );
}
