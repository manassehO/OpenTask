import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { eq, and } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { otps } from "~/server/db/schema";
import {
  findOrCreateUserByEmail,
  generateUserToken,
  generateHashedOtp,
  compareHashedOtp,
} from "./services";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sendOtp } from "~/server/email";
import otpGenerator from "otp-generator";

export const authRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      emailVerified: ctx.user.emailVerified,
      image: ctx.user.image,
      createdAt: ctx.user.createdAt,
    };
  }),

  // Admin-only endpoint
  getAdminData: adminProcedure.query(({ ctx }) => {
    return {
      message: "This is admin-only data",
      adminUser: ctx.user.name,
      secretData: "Super secret admin information",
    };
  }),

  // Check session status
  getSessionStatus: publicProcedure.query(({ ctx }) => {
    return {
      isAuthenticated: !!ctx.user,
      user: ctx.user
        ? {
            id: ctx.user.id,
            name: ctx.user.name,
            email: ctx.user.email,
            role: ctx.user.role,
          }
        : null,
      session: ctx.session
        ? {
            id: ctx.session.id,
            expiresAt: ctx.session.expiresAt,
          }
        : null,
    };
  }),

  // Request OTP
  requestOtp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const otp: string = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // Delete existing OTPs for the same email
      await ctx.db.delete(otps).where(eq(otps.email, input.email));

      const expiresAt = addMinutes(new Date(), 10);
      const hashedOtp = await generateHashedOtp(otp);

      // Insert new OTP
      await ctx.db.insert(otps).values({
        email: input.email,
        code: hashedOtp,
        expiresAt,
        createdAt: new Date(),
      });

      await sendOtp(input.email, otp);

      return { success: true };
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const otpRecord = await ctx.db.query.otps.findFirst({
        where: eq(otps.email, input.email),
      });

      if (!otpRecord) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email Provided",
        });
      }

      const isHashedOtp = await compareHashedOtp(input.code, otpRecord.code);

      if (!isHashedOtp) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid OTP" });
      }

      if (otpRecord.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "OTP expired" });
      }

      // Delete OTP after successful verification
      await ctx.db.delete(otps).where(eq(otps.email, input.email));

      const user = await findOrCreateUserByEmail(input.email);
      const token = generateUserToken(user);

      return {
        success: true,
        token,
        user,
      };
    }),
});
