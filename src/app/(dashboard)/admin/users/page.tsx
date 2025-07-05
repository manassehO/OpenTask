import UserListSkeleton from '~/_components/dashboard_components/admin/user/UserListSkeleton';
import Header from '~/_components/dashboard_components/admin/header';
import UsersTable from '~/_components/dashboard_components/admin/user/UsersTable';

export default function UsersPage() {
  const isLoading = false; // replace with real loading state

  return isLoading ? (
    <UserListSkeleton />
  ) : (
    <div className="relative h-screen w-full">
      <Header title="Users" subText="manage platform users" />
      <UsersTable />
    </div>
  );
}
