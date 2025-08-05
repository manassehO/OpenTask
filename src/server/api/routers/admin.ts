import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { user, adminLogs } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, ilike, or, and, sql } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';

type User = InferModel<typeof user, 'select'>;

export const adminRouter = createTRPCRouter({
  // List/search users
  findUsers: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { search, status, limit, page } = input;
      const conditions = [];

      if (search) {
        conditions.push(
          or(ilike(user.email, `%${search}%`), eq(user.id, search)),
        );
      }

      if (status) {
        conditions.push(eq(user.status, status));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const usersResult: User[] = await ctx.db
        .select()
        .from(user)
        .where(whereClause)
        .limit(limit)
        .offset((page - 1) * limit);

      const totalUsers =
        (
          await ctx.db
            .select({ count: sql`count(*)` })
            .from(user)
            .where(whereClause)
        )[0]?.count ?? 0;

      return {
        success: true,
        data: usersResult,
        total: Number(totalUsers),
        page,
        limit,
      };
    }),

  // Update a user's status
  updateUserStatus: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
        reason: z.string().min(1, 'Reason is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, status, reason } = input;

      const foundUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!foundUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const result: User[] = await ctx.db
        .update(user)
        .set({ status, updatedAt: new Date() })
        .where(eq(user.id, userId))
        .returning();

      if (result.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user status',
        });
      }

      // Log the action
      await ctx.db.insert(adminLogs).values({
        adminId: ctx.user.id,
        action: `STATUS_${status}`,
        targetTable: 'user',
        targetId: userId,
        message: reason,
      });

      return {
        success: true,
        message: `User status updated to ${status}`,
        user: result[0]!,
      };
    }),
});
