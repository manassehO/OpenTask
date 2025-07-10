import { Suspense } from 'react';
import UserDetailPageClient from '~/_components/dashboard_components/admin/user/UserDetailPageClient';
import UserDetailSkeleton from '~/_components/dashboard_components/admin/user/UserDetailSkeleton';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailPageClient userId={id} />
    </Suspense>
  );
}
