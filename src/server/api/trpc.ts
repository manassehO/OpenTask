/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { db } from '~/server/db';
import { auth, type Session, type User } from '~/lib/auth';
import {
  deployAAWallet,
  approve,
  fundTask,
  transfer,
  verifyMessage,
  flagDispute,
  resolveDispute,
  fundTaskWithManagedWallet,
} from '../../services/starknetSvc';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authorization = opts.headers.get('authorization');
  const sessionToken =
    authorization?.replace('Bearer ', '') ??
    opts.headers
      .get('cookie')
      ?.split('better-auth.session_token=')[1]
      ?.split(';')[0];

  let session: Session | null = null;
  let user: User | null = null;

  if (sessionToken) {
    try {
      const sessionData = await auth.api.getSession({
        headers: opts.headers,
      });

      if (sessionData) {
        session = sessionData.session;

        // Merge DB fields into user
        const dbUser = await db.query.user.findFirst({
          where: (u, { eq }) => eq(u.id, sessionData.user.id),
        });

        if (dbUser) {
          user = { ...sessionData.user, ...dbUser };
        } else {
          user = sessionData.user;
        }
      }
    } catch (error) {
      console.log('Session validation failed:', error);
    }
  }

  return {
    db,
    session,
    user,
    ...opts,
    starknetSvc: {
      deployAAWallet,
      approve,
      fundTask,
      transfer,
      verifyMessage,
      flagDispute,
      resolveDispute,
      fundTaskWithManagedWallet,
    },
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Authentication middleware
 *
 * This middleware verifies that a user is authenticated and throws an UNAUTHORIZED error if not.
 * It also attaches the user and session data to the context for use in protected procedures.
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

/**
 * Role-based authorization middleware
 *
 * This middleware verifies that a user has the required role(s) to access a resource.
 */
const hasRole = (roles: string[]) =>
  t.middleware(({ next, ctx }) => {
    if (!ctx.user || !ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      });
    }

    return next({
      ctx: {
        user: ctx.user,
        session: ctx.session,
      },
    });
  });

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.user` and `ctx.session` are not null.
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(isAuthed);

/**
 * Admin-only procedure
 *
 * Only users with the "admin" role can access procedures created with this.
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(hasRole(['ADMIN']));

/**
 * Moderator+ procedure
 *
 * Users with either "admin" or "moderator" roles can access procedures created with this.
 */
export const moderatorProcedure = t.procedure
  .use(timingMiddleware)
  .use(hasRole(['ADMIN', 'moderator']));

/**
 * Completer-only procedure
 *
 * Only users with the "COMPLETER" role can access procedures created with this.
 */
export const completerProcedure = t.procedure
  .use(timingMiddleware)
  .use(hasRole(['COMPLETER']));
