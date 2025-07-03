import { t } from '~/server/api/trpc';
import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { db } from '~/server/db';
import { user } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const userProtocol = t.router({
  updateWalletInfo: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().min(1),
        hashPrivateKey: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(user)
        .set({
          walletAddress: input.walletAddress,
          hashPrivateKey: input.hashPrivateKey,
        })
        .where(eq(user.id, ctx.session.userId));

      console.log(`[WALLET CREATED] ${ctx.session.userId}`);
      return { success: true };
    }),
});
