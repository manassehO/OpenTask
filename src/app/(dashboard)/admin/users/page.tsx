// import UserListSkeleton from "@/components/UserListSkeleton";
// import UsersPageClient from "@/components/UsersPageClient";

import UserListSkeleton from '~/_components/admin/user/UserListSkeleton';
import UsersPageClient from '~/_components/admin/user/UsersPageClient';

export default function UsersPage() {
  const isLoading = false; // replace with real loading state

  return isLoading ? <UserListSkeleton /> : <UsersPageClient />;
}
