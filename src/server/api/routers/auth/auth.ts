import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  protectedProcedure
} from '~/server/api/trpc';

import { z } from 'zod';
import {  eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { wallets } from '@/server/db/schema';


export const authRouter = createTRPCRouter({
  // Admin-only endpoint
  getAdminData: adminProcedure.query(({ ctx }) => {
    return {
      message: 'This is admin-only data',
      adminUser: ctx.user.name,
      secretData: 'Super secret admin information',
    };
  }),

  // Check session status
  
  getSessionStatus: publicProcedure.query(async ({ ctx }) => {
  if (!ctx.session || !ctx.user) {
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      activeWallet: null,
    };
  }

  // Fetch active wallet for the current user
  const activeWallet = await ctx.db.query.wallets.findFirst({
    where: (w, { eq, and }) =>
    and(eq(w.userId, ctx.session!.userId), eq(w.isActive, 1))

  });

  return {
    isAuthenticated: true,
    user: {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
    },
    session: {
      id: ctx.session.id,
      expiresAt: ctx.session.expiresAt,
    },
    activeWallet: activeWallet
      ? {
          id: activeWallet.walletId,
          address: activeWallet.starknetAddress,
        }
      : null,
  };
}),

  // Switch active wallet
  switchAccount: protectedProcedure
    .input(
      z.object({
        walletId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.userId;

      const wallet = await ctx.db.query.wallets.findFirst({
        where: (w, { eq, and }) =>
          and(eq(w.walletId, input.walletId), eq(w.userId, userId)),
      });

      if (!wallet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Wallet not found for this user',
        });
      }

      await ctx.db
        .update(wallets)
        .set({ isActive: 0 })
        .where(eq(wallets.userId, userId));

      await ctx.db
        .update(wallets)
        .set({ isActive: 1 })
        .where(eq(wallets.walletId, input.walletId));

      return { success: true, activeWallet: wallet.starknetAddress };
    

    }),
});
