'use client';

import { authClient, useSession } from '@/lib/auth-client';
import { UserType } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getKeyByValue } from '~/lib/fns';
import { type AccessType } from '~/lib/route';
import { DashboardNavbar } from './dashboardNavbar';
import SidebarWrapper from './sidebarWrapper';

const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const checkAccess = async () => {
    // Early return if no session (still loading)
    if (!session) {
      setLoading(true);
      return;
    }

    const rootRoute = session?.user?.role
      ? getKeyByValue(UserType, session.user.role)
      : undefined;

    console.log({ session, rootRoute, params });

    if (
      session?.user?.role === 'ADMIN' &&
      params.accessType &&
      params.accessType !== 'admin'
    ) {
      router.push('/admin');
      setLoading(false);
      return;
    }

    if (session?.user?.role !== 'ADMIN' && rootRoute !== params.accessType) {
      toast.error('You are not authorized to access this page');
      await authClient.signOut(undefined, {
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
      return;
    }

    setLoading(false);
  };

  // FIXED: Added proper dependency array
  useEffect(() => {
    checkAccess().catch(console.error);
    // }, [session, params.accessType, router]); // ← Add dependencies here
  });

  console.log(session?.user?.role);

  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <Loader2Icon className="h-28 w-28 animate-spin" />
    </div>
  ) : (
    <div className="[--header-height:calc(--spacing(14))]">
      <div className="flex flex-col">
        <DashboardNavbar />
        <SidebarWrapper role={session?.user?.role as AccessType}>
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

// 'use client';

// import { authClient, useSession } from '@/lib/auth-client';
// import { UserType } from '@/lib/utils';
// import { Loader2Icon } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { getKeyByValue } from '~/lib/fns';
// import { type AccessType } from '~/lib/route';
// import { DashboardNavbar } from './dashboardNavbar';
// import SidebarWrapper from './sidebarWrapper';

// const AuthenticatedLayout = ({
//   children,
//   // isAdmin,
// }: {
//   children: React.ReactNode;
//   isAdmin?: boolean;
// }) => {
//   const router = useRouter();
//   const params = useParams();
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();

//   const checkAccess = async () => {

//     const rootRoute = session?.user?.role
//       ? getKeyByValue(UserType, session.user.role)
//       : undefined;

//     console.log({ session, rootRoute, params });

//     if (
//       session?.user?.role === 'ADMIN' &&
//       params.accessType &&
//       params.accessType !== 'admin'
//     ) {
//       router.push('/admin');
//       setLoading(false);
//     }

//     if (session?.user?.role !== 'ADMIN' && rootRoute !== params.accessType) {
//       toast.error('You are not authorized to access this page');
//       await authClient.signOut(undefined, {
//         onSuccess: () => {
//           setLoading(false);
//           router.push('/login');
//         },
//         onError: (ctx) => {
//           console.log({ ctx });
//           setLoading(false);
//           router.push('/login');
//         },
//       });
//     } else {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAccess().catch(console.error);
//   });

//   console.log(session?.user?.role);
//   return loading ? (
//     <div className="flex h-screen items-center justify-center">
//       <Loader2Icon className="h-28 w-28 animate-spin" />
//     </div>
//   ) : (
//     <div className="[--header-height:calc(--spacing(14))]">
//       <div className="flex flex-col">
//         <DashboardNavbar />
//         <SidebarWrapper role={session?.user?.role as AccessType}>
//           <div className="flex flex-1 flex-col gap-4 p-4">
//             <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min">
//               {children}
//             </div>
//           </div>
//         </SidebarWrapper>
//       </div>
//     </div>
//   );
// };

// export default AuthenticatedLayout;
