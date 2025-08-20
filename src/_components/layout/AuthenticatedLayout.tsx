'use client';

import { authClient, useSession } from '@/lib/auth-client';
import { UserType } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getKeyByValue } from '~/lib/fns';
import { AccessType } from '~/lib/route';
import { DashboardNavbar } from './dashboardNavbar';
import SidebarWrapper from './sidebarWrapper';

const AuthenticatedLayout = ({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const checkAccess = () => {
    const rootRoute = session?.user?.roles
      ? getKeyByValue(UserType, session.user.roles as string)
      : undefined;
    console.log({ session, rootRoute, params });
    if (
      session?.user?.roles === 'ADMIN' &&
      params.accessType &&
      params.accessType !== 'admin'
    ) {
      router.push('/admin');
      setLoading(false);
    }
    if (session?.user?.roles !== 'ADMIN' && rootRoute !== params.accessType) {
      toast.error('You are not authorized to access this page');
      authClient.signOut(undefined, {
        onSuccess: () => {
          setLoading(false);
          router.push('/login');
        },
        onError: (ctx) => {
          console.log({ ctx });
          setLoading(false);
          router.push('/login');
        },
      });
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAccess();
  }, [session]);

  console.log(session?.user?.roles);
  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <Loader2Icon className="h-28 w-28 animate-spin" />
    </div>
  ) : (
    <div className="[--header-height:calc(--spacing(14))]">
      <div className="flex flex-col">
        <DashboardNavbar />
        <SidebarWrapper role={session?.user?.roles as AccessType}>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min">
              {children}
            </div>
          </div>
        </SidebarWrapper>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
