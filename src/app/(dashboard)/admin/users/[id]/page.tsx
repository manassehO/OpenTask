import { Suspense } from 'react';
import UserDetailPageClient from '~/_components/admin/user/UserDetailPageClient';
import UserDetailSkeleton from '~/_components/admin/user/UserDetailSkeleton';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 Make params a Promise
}) {
  const { id } = await params; // 👈 Await the params

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailPageClient userId={id} />
    </Suspense>
  );
}
