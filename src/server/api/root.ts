import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { authRouter } from '~/server/api/routers/auth/auth';
import { profileRouter } from '~/server/api/routers/profile';
import { walletRouter } from './routers/wallet';
import { taskRouter } from './routers/task';
import { adminRouter } from './routers/admin';
import { notificationsRouter } from '~/server/api/routers/notifications';
import { earningsRouter } from "./routers/earning";

/*
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  wallet: walletRouter,
  task: taskRouter,
  admin: adminRouter,
  notifications: notificationsRouter,
  earnings: earningsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
