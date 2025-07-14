import { protectedProcedure, createTRPCRouter } from '../trpc';
import { z } from 'zod';
import { db } from '~/server/db';

export const walletRouter = createTRPCRouter({
  getTransactionHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        token: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session!.userId;

      const wallets = await db.query.wallets.findMany({
        where: (w, { eq, and }) => and(eq(w.userId, userId), eq(w.isActive, 1)),
      });

      const addresses = wallets.map((w) => w.starknetAddress.toLowerCase());

      if (addresses.length === 0) {
        return [];
      }

      const events = await db.query.onchainEvents.findMany({
        where: (e, { inArray, eq, and }) =>
          and(
            inArray(e.walletAddress, addresses),
            input.token ? eq(e.token, input.token) : undefined,
          ),
        limit: input.limit,
        offset: input.offset,
        orderBy: (e, { desc }) => desc(e.timestamp),
      });

      return events;
    }),
});
