import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from '~/server/api/trpc';
import {
  user,
  userProfiles,
  submissions,
  tasks,
  disputes,
  userStats,
} from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, count, sql } from 'drizzle-orm';

// import { type InferModel } from "drizzle-orm";
import type { InferModel } from 'drizzle-orm';
type User = InferModel<typeof user, 'select'>;

import axios from "axios";

export async function convertToFiat(amount: number, tokenId = "ethereum"): Promise<number> {
  if (amount === 0) return 0;

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    const usdRate = data[tokenId]?.usd ?? 0;
    return amount * usdRate;
  } catch (error) {
    console.error("CoinGecko conversion failed:", error);
    return 0;
  }
}

const updateProfileSelfSchema = z
  .object({
    name: z.string().min(1).optional(),
    displayName: z.string().min(1).max(150).optional(),
    image: z.string().url().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

const updateProfileAdminSchema = z
  .object({
    userId: z.string(),
    name: z.string().min(1).optional(),
    displayName: z.string().min(1).max(150).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
    image: z.string().url().optional(),
    role: z.enum(['CREATOR', 'COMPLETER', 'ADMIN']).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided in addition to userId',
  });

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const foundUser = await ctx.db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.user.id),
    });

    if (!foundUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User profile not found',
      });
    }

    return {
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name ?? '',
        email: foundUser.email,
        emailVerified: foundUser.emailVerified,
        displayName: foundUser.displayName ?? '',
        status: foundUser.status,
        image: foundUser.image ?? '',
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        role: foundUser.role,
      },
    };
  }),

  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [createdTasks, completedTasks, raisedDisputes] = await Promise.all([
      // Tasks created by user
      ctx.db
        .select({ count: count() })
        .from(tasks)
        .where(eq(tasks.creatorUserId, userId)),

      // Submissions completed by user
      ctx.db
        .select({ count: count() })
        .from(submissions)
        .where(eq(submissions.completerUserId, userId)),

      // Disputes raised by user
      ctx.db
        .select({ count: count() })
        .from(disputes)
        .leftJoin(submissions, eq(disputes.submissionId, submissions.submissionId))
        .where(eq(submissions.completerUserId, userId)),
    ]);

    return {
      success: true,
      stats: {
        createdTasks: Number(createdTasks[0]?.count ?? 0),
        completedTasks: Number(completedTasks[0]?.count ?? 0),
        disputesRaised: Number(raisedDisputes[0]?.count ?? 0),
      },
    };
  }),

    return {
      success: true,
      stats: {
        createdTasks: Number(createdTasks[0]?.count ?? 0),
        completedTasks: Number(completedTasks[0]?.count ?? 0),
        disputesRaised: Number(raisedDisputes[0]?.count ?? 0),
        totalEarnings: stats.totalEarnings,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        earningSummary: {
          totalEarned,
          fiatValue, 
          tasksCompleted: totalTasksCompleted,
        },
      },
    };
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSelfSchema)
    .mutation(async ({ ctx, input }) => {
      const forbiddenFields = [
        'email',
        'status',
        'role',
        'updatedAt',
        'createdAt',
      ];
      for (const field of forbiddenFields) {
        if (field in input) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You are not allowed to update the field: ${field}`,
          });
        }
      }

      const userId = ctx.user.id;

      const foundUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!foundUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const dataToUpdate: Record<string, unknown> = {
        updatedAt: new Date(),
        ...(input.name && { name: input.name }),
        ...(input.displayName && { displayName: input.displayName }),
        ...(input.image && { image: input.image }),
      };

      const result: User[] = await ctx.db
        .update(user)
        .set(dataToUpdate)
        .where(eq(user.id, userId))
        .returning();

      if (result.length === 0) {
        console.error('No rows updated');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }

      const updatedUser: User = result[0]!;
      return {
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name ?? '',
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
          displayName: updatedUser.displayName ?? '',
          status: updatedUser.status,
          image: updatedUser.image ?? '',
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    }),

  updateProfileAdmin: adminProcedure
    .input(updateProfileAdminSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, ...fields } = input;

      // const foundUser: User | null = await ctx.db.query.user.findFirst({
      //   where: (u, { eq }) => eq(u.id, userId as string),
      // });

      const foundUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!foundUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const dataToUpdate: Record<string, unknown> = {
        updatedAt: new Date(),
        ...(fields.name && { name: fields.name }),
        ...(fields.displayName && { displayName: fields.displayName }),
        ...(fields.status && { status: fields.status }),
        ...(fields.image && { image: fields.image }),
        ...(fields.role && { role: fields.role }),
      };

      const result: User[] = await ctx.db
        .update(user)
        .set(dataToUpdate)
        .where(eq(user.id, userId))
        .returning();

      if (result.length === 0) {
        console.error('No rows updated');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }

      const updatedUser = result[0]!;

      return {
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name ?? '',
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
          displayName: updatedUser.displayName ?? '',
          status: updatedUser.status,
          image: updatedUser.image ?? '',
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    }),

  getExtendedProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Fetch basic user info and associated profile
    const userRow = await ctx.db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      with: {
        profile: true,
      },
    });

    if (!userRow) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const profile = (userRow.profile ?? {}) as typeof userProfiles.$inferSelect;
    console.log('Raw profile data:', profile);

    // Parse skillTags and socialLinks from JSON strings into usable JS objects
    let parsedSkillTags: string[] = [];
    let parsedSocialLinks: Record<string, string> = {};

    try {
      if (typeof profile.skillTags === 'string') {
        const rawTags = profile.skillTags;
        parsedSkillTags = JSON.parse(rawTags) as string[];
      }
    } catch {
      parsedSkillTags = [];
    }

    try {
      if (typeof profile.socialLinks === 'string') {
        const rawLinks = profile.socialLinks;
        parsedSocialLinks = JSON.parse(rawLinks) as Record<string, string>;
      }
    } catch {
      parsedSocialLinks = {};
    }

    return {
      ...userRow,
      profile: {
        ...profile,
        skillTags: parsedSkillTags,
        socialLinks: parsedSocialLinks,
      },
    };
  }),

  updateExtendedProfile: protectedProcedure
    .input(
      z.object({
        // user table fields
        name: z.string().optional(),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().url().optional(),
        walletAddress: z.string().max(100).optional(),

        // userProfiles table fields
        gender: z.string().optional(),
        niche: z.string().optional(),
        bio: z.string().optional(),
        phoneNumber: z.string().max(20).optional(),
        location: z.string().optional(),
        timezone: z.string().optional(),
        skillTags: z.array(z.string()).max(10).optional(),
        socialLinks: z.record(z.string().url()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const now = new Date();

      const clean = <T>(value: T | undefined) =>
        typeof value === 'string' && value.trim() === '' ? undefined : value;

      try {
        await ctx.db.transaction(async (trx) => {
          // --- Update user table fields ---
          const userUpdate: Partial<typeof user.$inferInsert> = {
            name: clean(input.name),
            displayName: clean(input.displayName),
            email: clean(input.email),
            image: clean(input.image),
            walletAddress: clean(input.walletAddress),
            updatedAt: now,
          };
          await trx.update(user).set(userUpdate).where(eq(user.id, userId));

          // --- Update userProfiles table fields ---
          const profileUpdate: Partial<typeof userProfiles.$inferInsert> = {
            gender: clean(input.gender),
            niche: clean(input.niche),
            bio: clean(input.bio),
            location: clean(input.location),
            timezone: clean(input.timezone),
            phoneNumber: clean(input.phoneNumber),
            skillTags: input.skillTags
              ? JSON.stringify(input.skillTags)
              : undefined,
            socialLinks: input.socialLinks
              ? JSON.stringify(input.socialLinks)
              : undefined,
            updatedAt: now,
          };

          const [existingProfile] = await trx
            .select({ profileId: userProfiles.profileId })
            .from(userProfiles)
            .where(eq(userProfiles.userId, userId));

          if (existingProfile) {
            await trx
              .update(userProfiles)
              .set(profileUpdate)
              .where(eq(userProfiles.userId, userId));
          } else {
            await trx.insert(userProfiles).values({
              userId,
              ...profileUpdate,
              isProfileComplete: true,
              createdAt: now,
            });
          }
        });

        return { success: true, message: 'Profile updated successfully' };
      } catch (error) {
        console.error('DB update error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
          cause: error,
        });
      }
    }),
});