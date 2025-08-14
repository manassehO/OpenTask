import { z } from 'zod';
import { protectedProcedure, createTRPCRouter, hasRole } from '../trpc';
import { db } from '~/server/db';
import { tasks, submissions, userStats } from '@/server/db/schema';
import { eq, and, count, gte, inArray } from 'drizzle-orm';

export const creatorRouter = createTRPCRouter({
  getCreatorDashboard: protectedProcedure
    .use(hasRole(['CREATOR']))
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      // Total tasks
      const totalTasks = await db
        .select({ count: count() })
        .from(tasks)
        .where(eq(tasks.creatorUserId, userId));

      // Active tasks
      const activeTasks = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(eq(tasks.creatorUserId, userId), eq(tasks.status, 'ACTIVE')),
        );

      // Completed tasks
      const completedTasks = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(eq(tasks.creatorUserId, userId), eq(tasks.status, 'COMPLETED')),
        );

      // Total earnings (from userStats)
      const stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId));
      const totalEarnings = stats[0]?.totalEarnings ?? 0;

      return {
        totalTasks: Number(totalTasks[0]?.count ?? 0),
        activeTasks: Number(activeTasks[0]?.count ?? 0),
        completedTasks: Number(completedTasks[0]?.count ?? 0),
        totalEarnings: Number(totalEarnings),
      };
    }),

  getCreatorTasks: protectedProcedure
    .use(hasRole(['CREATOR']))
    .input(
      z.object({
        status: z
          .enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
          .optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { status, limit, offset } = input;
      const whereClauses = [eq(tasks.creatorUserId, userId)];
      if (status) whereClauses.push(eq(tasks.status, status));

      const result = await db
        .select()
        .from(tasks)
        .where(and(...whereClauses))
        .limit(limit)
        .offset(offset)
        .orderBy(tasks.createdAt);

      const total = await db
        .select({ count: count() })
        .from(tasks)
        .where(and(...whereClauses));

      return {
        tasks: result,
        total: Number(total[0]?.count ?? 0),
      };
    }),

  getCreatorAnalytics: protectedProcedure
    .use(hasRole(['CREATOR']))
    .input(
      z.object({
        period: z.enum(['7d', '30d', '90d']).default('30d'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { period } = input;
      // Calculate date range
      const now = new Date();
      const fromDate = new Date();
      if (period === '7d') fromDate.setDate(now.getDate() - 7);
      else if (period === '30d') fromDate.setDate(now.getDate() - 30);
      else if (period === '90d') fromDate.setDate(now.getDate() - 90);

      // Tasks created in period
      const tasksCreated = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(eq(tasks.creatorUserId, userId), gte(tasks.createdAt, fromDate)),
        );

      // Submissions received in period (for creator's tasks)

      const creatorTaskIds = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(eq(tasks.creatorUserId, userId));
      const taskIds = creatorTaskIds.map((t) => t.id);
      let submissionsCount = 0;
      if (taskIds.length > 0) {
        const subResult = await db
          .select({ count: count() })
          .from(submissions)
          .where(
            and(
              gte(submissions.submittedAt, fromDate),
              inArray(submissions.taskId, taskIds),
            ),
          );
        submissionsCount = Number(subResult[0]?.count ?? 0);
      }

      // Earnings in period (from userStats, fallback to 0)
      const stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId));
      const totalEarnings = stats[0]?.totalEarnings ?? 0;

      return {
        tasksCreated: Number(tasksCreated[0]?.count ?? 0),
        submissionsReceived: submissionsCount,
        totalEarnings: Number(totalEarnings),
      };
    }),
});
