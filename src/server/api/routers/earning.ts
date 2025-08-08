import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { withdrawals, userBalances} from "@/server/db/schema";
import { parseAmountToBigInt } from '@/lib/utils';



export const earningsRouter = createTRPCRouter({
  getUserEarnings: protectedProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db.query.userStats.findFirst({
    where: (s, { eq }) => eq(s.userId, ctx.user.id),
  });

  if (!stats) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Stats not found' });
  }

  return {
    totalEarnings: stats.totalEarnings.toString(),
    totalEarningsUsd: Number(stats.totalEarnings), 
    totalTasksCompleted: stats.totalTasksCompleted,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalTimeSpent: stats.totalTimeSpent,
    averageRating: stats.averageRating?.toString() ?? '0',
    totalCoursesCompleted: stats.totalCoursesCompleted,
    lastActivityAt: stats.lastActivityAt,
  };
}),


 getEarningSummary: protectedProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db.query.userStats.findFirst({
    where: (s, { eq }) => eq(s.userId, ctx.user.id),
  });

  if (!stats) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }

  return {
    totalEarned: stats.totalEarnings.toString(),
    fiatValue: (Number(stats.totalEarnings) * 1).toFixed(2), // Optional: convert to USD
    tasksCompleted: stats.totalTasksCompleted,
    timeSpent: `${stats.totalTimeSpent} mins`,
  };
}),


 getTransactionHistory: protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    type: z.enum(['EARNING', 'WITHDRAWAL']).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { user } = ctx;

    const userWallet = await ctx.db.query.wallets.findFirst({
      where: (w, { eq, and }) => and(eq(w.userId, user.id), eq(w.isActive, 1)),
    });

    if (!userWallet) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No active wallet found' });
    }


    const withdrawals = input.type !== 'EARNING'
      ? await ctx.db.query.withdrawals.findMany({
          where: (w, { eq }) => eq(w.userId, user.id),
          limit: input.limit,
          offset: input.offset,
        })
      : [];

    const earnings = input.type !== 'WITHDRAWAL'
      ? await ctx.db.query.onchainEvents.findMany({
          where: (e, { eq }) => eq(e.walletAddress,  userWallet.starknetAddress),
          limit: input.limit,
          offset: input.offset,
        })
      : [];

    return {
      withdrawals,
      earnings,
    };
  }),

  getWithdrawalOptions: protectedProcedure.query(async ({ ctx }) => {
  const methods = await ctx.db.query.userWithdrawalMethods.findMany({
    where: (m, { eq }) => eq(m.userId, ctx.user.id),
  });

  return methods;
}),

 createCryptoWithdrawal: protectedProcedure
  .input(z.object({
    amount: z.string().regex(/^\d+(\.\d{1,18})?$/),
    tokenAddress: z.string(),
    destinationAddress: z.string(),
    currency: z.enum(['ETH', 'BTC', 'USDT']),
  }))
  .mutation(async ({ ctx, input }) => {
    // const withdrawal = await ctx.db.insert(withdrawals).values({
    //   userId: ctx.user.id,
    //   method: 'CRYPTO_WALLET',
    //   amount: input.amount,
    //   tokenAddress: input.tokenAddress,
    //   destinationAddress: input.destinationAddress,
    //   status: 'PENDING',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });
    const userWallet = await ctx.db.query.wallets.findFirst({
  where: (w, { eq, and }) => and(eq(w.userId, ctx.user.id), eq(w.isActive, 1)),
});

if (!userWallet) {
  throw new TRPCError({ code: 'NOT_FOUND', message: 'No active wallet found' });
}


     const balance = await ctx.db.query.userBalances.findFirst({
        where: (b, { eq }) => eq(b.userAddress,  userWallet.starknetAddress),
      });

      if (!balance) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User balance not found' });
      }

      // if (BigInt(balance.balance) < BigInt(input.amount)) {
      //   throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' });
      // }
       const inputAmount = parseAmountToBigInt(input.amount); 

    if (BigInt(balance.balance) < inputAmount) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' });
    }

      try {
        await ctx.db.insert(withdrawals).values({
          userId: ctx.user.id,
          method: 'CRYPTO_WALLET',
          amount: input.amount,
          tokenAddress: input.tokenAddress,
          destinationAddress: input.destinationAddress,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

    return { success: true };
  } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create crypto withdrawal' });
      }
    }),


  createBankWithdrawal: protectedProcedure
  .input(z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
    bankAccountDetails: z.object({
      accountNumber: z.string(),
      routingNumber: z.string(),
      accountHolderName: z.string(),
    }),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.insert(withdrawals).values({
        userId: ctx.user.id,
        method: 'BANK_ACCOUNT',
        amount: input.amount,
        tokenAddress: 'N/A',
        bankAccountDetails: JSON.stringify(input.bankAccountDetails),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create bank withdrawal',
      });
    }
  })
}) 
