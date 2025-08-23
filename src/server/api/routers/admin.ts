import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import {
  user,
  adminLogs,
  disputes,
  submissions,
  tasks,
} from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, ilike, or, and, sql } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';
import { db } from '@/server/db';
import { resolveDispute } from '@/services/starknetSvc';
import { format, subDays, subYears } from 'date-fns';

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
    .query(async ({ ctx, input }) => {
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

  resolveDispute: adminProcedure
    .input(
      z.object({
        disputeId: z.string().uuid(),
        outcome: z.enum(['APPROVE', 'REJECT']),
        adminNotes: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { disputeId, outcome, adminNotes } = input;

      // Restrict to admins
      if (ctx.user.role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' });
      }

      // Find the dispute (with related task info)
      const [dispute] = await db
        .select({
          disputeId: disputes.disputeId,
          status: disputes.status,
          taskId: submissions.taskId,
          completerUserId: submissions.completerUserId,
        })
        .from(disputes)
        .innerJoin(
          submissions,
          eq(disputes.submissionId, submissions.submissionId),
        )
        .where(eq(disputes.disputeId, disputeId));
      if (!dispute) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Dispute not found',
        });
      }

      if (dispute.status !== 'OPEN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Dispute is not open',
        });
      }

      // Call Starknet contract
      await resolveDispute({
        taskId: dispute.taskId!,
        completerUserId: dispute.completerUserId!,
        resolution: outcome,
      });

      // Update the dispute record
      await db
        .update(disputes)
        .set({
          status:
            outcome === 'APPROVE' ? 'RESOLVED_APPROVE' : 'RESOLVED_REJECT',
          resolution: outcome === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          adminNotes,
          resolvedAt: new Date(),
          resolvedById: ctx.user.id,
        })
        .where(eq(disputes.disputeId, disputeId));

      return { success: true };
    }),

  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    try {
      const [totalUsers, activeTasks, completedTasks, openDisputes] =
        await Promise.all([
          db.query.user.findMany().then((users) => users.length),
          db.query.tasks
            .findMany({
              where: (task, { eq }) => eq(task.status, 'ACTIVE'),
            })
            .then((tasks) => tasks.length),
          db.query.tasks
            .findMany({
              where: (task, { eq }) => eq(task.status, 'COMPLETED'),
            })
            .then((tasks) => tasks.length),
          db.query.disputes
            .findMany({
              where: (d, { eq }) => eq(d.status, 'OPEN'),
            })
            .then((disputes) => disputes.length),
        ]);

      const earnings = await db.query.userStats.findMany();
      const totalEarnings = earnings.reduce(
        (acc, stat) => acc + Number(stat.totalEarnings ?? 0),
        0,
      );

      const allTasks = await db.query.tasks.findMany();
      const platformRevenue = allTasks.reduce(
        (acc, task) => acc + Number(task.platformFee ?? 0),
        0,
      );

      return {
        totalUsers,
        activeTasks,
        completedTasks,
        openDisputes,
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        platformRevenue: parseFloat(platformRevenue.toFixed(2)),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard stats',
        cause: error,
      });
    }
  }),

  getAnalytics: adminProcedure
    .input(
      z.object({
        period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
        metric: z.enum(['users', 'tasks', 'earnings', 'disputes']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { period, metric = 'users' } = input;
      const now = new Date();
      let fromDate: Date;
      switch (period) {
        case '7d':
          fromDate = subDays(now, 7);
          break;
        case '30d':
          fromDate = subDays(now, 30);
          break;
        case '90d':
          fromDate = subDays(now, 90);
          break;
        case '1y':
          fromDate = subYears(now, 1);
          break;
      }
      try {
        if (metric === 'users') {
          const users = await db.query.user.findMany({
            where: (u, { gte }) => gte(u.createdAt, fromDate),
          });
          const byDay = users.reduce(
            (acc, u) => {
              const day = format(new Date(u.createdAt), 'yyyy-MM-dd');
              acc[day] = (acc[day] || 0) + 1;

              return acc;
            },
            {} as Record<string, number>,
          );
          return Object.entries(byDay).map(([date, count]) => ({
            date,
            count,
          }));
        }
        if (metric === 'tasks') {
          const tasks = await db.query.tasks.findMany({
            where: (t, { gte }) => gte(t.createdAt, fromDate),
          });
          const byDay = tasks.reduce(
            (acc, t) => {
              const day = format(new Date(t.createdAt), 'yyyy-MM-dd');
              acc[day] = (acc[day] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );
          return Object.entries(byDay).map(([date, count]) => ({
            date,
            count,
          }));
        }
        if (metric === 'disputes') {
          const disputes = await db.query.disputes.findMany({
            where: (d, { gte }) => gte(d.createdAt, fromDate),
          });
          const byDay = disputes.reduce(
            (acc, d) => {
              const day = format(new Date(d.createdAt), 'yyyy-MM-dd');
              acc[day] = (acc[day] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );
          return Object.entries(byDay).map(([date, count]) => ({
            date,
            count,
          }));
        }
        if (metric === 'earnings') {
          const activity = await db.query.userActivity.findMany({
            where: (a, { gte }) => gte(a.date, fromDate),
          });
          const byDay = activity.reduce(
            (acc, a) => {
              const day = format(new Date(a.date), 'yyyy-MM-dd');
              const amt = Number(a.earningsAmount ?? 0);
              acc[day] = (acc[day] || 0) + amt;
              return acc;
            },
            {} as Record<string, number>,
          );
          return Object.entries(byDay).map(([date, total]) => ({
            date,
            count: 1,

            total: total.toFixed(2),
          }));
        }
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Unsupported metric type',
        });
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch analytics data',
          cause: err,
        });
      }
    }),

  getAllUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
        role: z.enum(['CREATOR', 'COMPLETER', 'ADMIN']).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { limit, offset, status, role, search } = input;
      const filters = [];
      if (status) {
        filters.push(eq(user.status, status));
      }
      if (role) {
        filters.push(eq(user.role, role));
      }
      if (search) {
        filters.push(
          or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)),
        );
      }
      const whereClause = filters.length > 0 ? and(...filters) : undefined;
      const users = await db.query.user.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: (user, { desc }) => [desc(user.createdAt)],
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(whereClause);
      const count = Number(countResult[0]?.count ?? 0);
      return {
        users,
        total: Number(count),
      };
    }),

  getAllTasksAdmin: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z
          .enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'])
          .optional(),
        creatorId: z.string().optional(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { limit, offset, status, creatorId } = input;
      const filters = [];
      if (status) {
        filters.push(eq(tasks.status, status));
      }
      if (creatorId) {
        filters.push(eq(tasks.creatorUserId, creatorId));
      }
      const whereClause = filters.length > 0 ? and(...filters) : undefined;
      const taskList = await db.query.tasks.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
        columns: {
          id: true,
          title: true,
          status: true,
          rewardAmount: true,
          requiredCompletions: true,
          approvedCompletions: true,
          deadline: true,
          creatorUserId: true,
          createdAt: true,
        },
      });
      const count = Number(
        (
          await db
            .select({ count: sql<number>`count(*)` })
            .from(tasks)
            .where(whereClause)
        )[0]?.count ?? 0,
      );
      return { tasks: taskList, total: count };
    }),

  getContentManagement: adminProcedure
    .input(
      z.object({
        type: z.enum(['courses', 'tutorials', 'tasks']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      switch (input.type) {
        case 'courses': {
          const courseList = await db.query.courses.findMany({
            orderBy: (courses, { desc }) => [desc(courses.createdAt)],
          });
          return { type: 'courses', data: courseList };
        }
        case 'tutorials': {
          const tutorialList = await db.query.tutorials.findMany({
            orderBy: (tutorials, { desc }) => [desc(tutorials.createdAt)],
          });
          return { type: 'tutorials', data: tutorialList };
        }
        case 'tasks': {
          const taskList = await db.query.tasks.findMany({
            orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
            columns: {
              id: true,
              title: true,
              status: true,
              category: true,
              rewardAmount: true,
              creatorUserId: true,
              createdAt: true,
            },
          });
          return { type: 'tasks', data: taskList };
        }
        default: {
          // Return all if no type is specified
          const [courseList, tutorialList, taskList] = await Promise.all([
            db.query.courses.findMany({
              orderBy: (courses, { desc }) => [desc(courses.createdAt)],
            }),
            db.query.tutorials.findMany({
              orderBy: (tutorials, { desc }) => [desc(tutorials.createdAt)],
            }),
            db.query.tasks.findMany({
              orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
              columns: {
                id: true,
                title: true,
                status: true,
                category: true,
                rewardAmount: true,

                creatorUserId: true,
                createdAt: true,
              },
            }),
          ]);
          return {
            type: 'all',
            data: {
              courses: courseList,
              tutorials: tutorialList,
              tasks: taskList,
            },
          };
        }
      }
    }),
});
