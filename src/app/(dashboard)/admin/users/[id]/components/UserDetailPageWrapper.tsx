'use client';

import UserDetailPageClient from './UserDetailComponent';

export default function UserDetailPageWrapper({ userId }: { userId: string }) {
  return <UserDetailPageClient userId={userId} />;
}
