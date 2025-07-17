import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { wallets } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const STARKNET_ADDRESS_REGEX = /^0x[0-9a-fA-F]{64}$/;

export const walletRouter = createTRPCRouter({
  saveWallet: protectedProcedure
    .input(
      z.object({
        starknetAddress: z
          .string()
          .regex(STARKNET_ADDRESS_REGEX, 'Invalid address format')
          .transform((addr) => addr.toLowerCase()),
        privateKey: z.string().min(1, 'Private key required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { starknetAddress, privateKey } = input;
      const userId = ctx.user.id;

      if (!starknetAddress || !privateKey) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Wallet address and private key are required',
        });
      }

      const existingWallet = await ctx.db.query.wallets.findFirst({
        where: eq(wallets.starknetAddress, starknetAddress),
      });

      if (existingWallet && existingWallet.userId !== userId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Wallet already linked to another user',
        });
      }

      const hashedPrivateKey = await bcrypt.hash(privateKey, 12);

      let result;
      try {
        if (existingWallet) {
          result = await ctx.db
            .update(wallets)
            .set({
              hashedPrivateKey,
              updatedAt: new Date(),
            })
            .where(eq(wallets.walletId, existingWallet.walletId))
            .returning();
        } else {
          result = await ctx.db
            .insert(wallets)
            .values({
              userId,
              starknetAddress,
              hashedPrivateKey,
              walletType: 'self_custody',
              isActive: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();
        }
      } catch (err: unknown) {
        if ((err as { code: string }).code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Wallet address already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save wallet',
        });
      }

      return { success: true, wallet: result[0] };
    }),
});
