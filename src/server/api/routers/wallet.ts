import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { wallets, nonceVerification } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { verifyStarknetSignature } from "~/server/api/routers/walletStarknetSvc";
import { randomBytes } from "crypto";

const STARKNET_ADDRESS_REGEX = /^0x[0-9a-fA-F]{64}$/;
const NONCE_EXPIRY_MINUTES = 10;

function generateNonce(length = 24) {
  return randomBytes(length).toString("hex");
}

export const walletRouter = createTRPCRouter({
  generateWalletNonce: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      const userId = ctx.user.id;
      const nonce = generateNonce();
      const expiresAt = new Date(Date.now() + NONCE_EXPIRY_MINUTES * 60 * 1000);

      await ctx.db.insert(nonceVerification).values({
        identifier: userId,
        value: nonce,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { nonce, expiresAt };
    }),

  linkExternalWallet: protectedProcedure
    .input(
      z.object({
        starknetAddress: z
          .string()
          .regex(STARKNET_ADDRESS_REGEX, "Invalid address format"),
        signedMessage: z.string(),
        originalMessage: z.string(),
        nonce: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { starknetAddress, signedMessage, originalMessage, nonce } = input;
      const userId = ctx.user.id;

      const nonceRecord = await ctx.db.query.nonceVerification.findFirst({
        where: and(
          eq(nonceVerification.identifier, userId),
          eq(nonceVerification.value, nonce),
        ),
      });

      if (!nonceRecord) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired nonce",
        });
      }

      if (nonceRecord.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nonce has expired",
        });
      }

      const existingWallet = await ctx.db.query.wallets.findFirst({
        where: eq(wallets.starknetAddress, starknetAddress),
      });

      if (existingWallet && existingWallet.userId !== userId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Wallet already linked to another user",
        });
      }

      let isValid;

      try {
        isValid = await verifyStarknetSignature(
          originalMessage,
          signedMessage,
          starknetAddress,
        );
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Signature verification failed",
        });
      }

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid signature for provided address",
        });
      }

      let result;

      if (existingWallet) {
        result = await ctx.db
          .update(wallets)
          .set({
            isActive: 1,
            walletType: "self_custody",
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
            walletType: "self_custody",
            isActive: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
      }

      await ctx.db
        .delete(nonceVerification)
        .where(eq(nonceVerification.id, nonceRecord.id));

      return { success: true, wallet: result[0] };
    }),
});
