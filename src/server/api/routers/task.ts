import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { tasks, user } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, and, ilike, gte, asc, desc, sql, count } from 'drizzle-orm';
import { db } from '~/server/db';
import {
  getTaskByIdSchema,
  createTaskSchema,
  findTaskSchema,
} from '../schemas/task';

export const taskRouter = createTRPCRouter({
  getTaskById: protectedProcedure
    .input(getTaskByIdSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: tasks.taskId,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          creatorId: tasks.creatorUserId,
          creatorDisplayName: user.displayName,
        })
        .from(tasks)
        .where(eq(tasks.taskId, input.taskId))
        .leftJoin(user, eq(tasks.creatorUserId, user.id));

      if (!result.length) {
        throw new Error('Task not found');
      }

      return result[0];
    }),

  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, input.creatorUserId),
      });
      if (!foundUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid creatorUserId',
        });
      }

      if (foundUser.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only users with the CREATOR role can create tasks.',
        });
      }

      if (foundUser.status !== 'ACTIVE') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User account is not active.',
        });
      }

      // Check for duplicate
      const duplicate = await ctx.db.query.tasks.findFirst({
        where: (t, { and, eq }) =>
          and(
            eq(t.title, input.title),
            eq(t.fundingTxHash, input.fundingTxHash),
          ),
      });

      if (duplicate) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Duplicate task submission',
        });
      }

      // Insert task

      // TODO: Create task in frontend using Chipi SDK or equivalent once integration is ready
      const [createdTask] = await ctx.db
        .insert(tasks)
        .values({
          creatorUserId: input.creatorUserId,
          title: input.title,
          description: input.description,
          instructions: input.instructions,
          category: input.category,
          rewardAmount: input.rewardAmount,
          rewardTokenAddress: input.rewardTokenAddress,
          requiredCompletions: input.requiredCompletions,
          status: input.status,
          fundingTxHash: input.fundingTxHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        success: true,
        task: createdTask,
      };
    }),

  findTasks: protectedProcedure
    .input(findTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { category, min_reward, sort_by, order, limit, page } = input;

      // Only allow sorting by whitelisted fields
      const sortFieldMap = {
        created_at: 'createdAt',
        reward: 'rewardAmount',
      } as const;
      const sortField = sortFieldMap[sort_by] || 'createdAt';
      const sortOrder = order === 'asc' ? 'asc' : 'desc';

      // Build where clause for drizzle
      const whereClauses = [eq(tasks.status, 'ACTIVE')];

      if (category && category.trim() !== '') {
        whereClauses.push(ilike(tasks.category, category));
      }

      if (typeof min_reward === 'number' && !isNaN(min_reward)) {
        whereClauses.push(gte(tasks.rewardAmount, min_reward.toString()));
      }

      const sortColumn = sortFieldMap[sort_by] ?? tasks.createdAt;
      const orderByClause =
        order === 'asc' ? asc(sortColumn) : desc(sortColumn);

      // Pagination implementation
      const safeLimit = Math.max(1, Math.min(limit, 30)); // max of 30 per page
      const safePage = Math.max(1, page);
      const offset = (safePage - 1) * safeLimit;

      try {
        const [tasksResult, countResult] = await Promise.all([
          ctx.db.query.tasks.findMany({
            where: and(...whereClauses),
            orderBy: [orderByClause],
            limit: safeLimit,
            offset,
          }),
          ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(and(...whereClauses)),
        ]);

        const totalCount = Number(countResult[0]?.count ?? 0);

        return {
          success: true,
          tasks: tasksResult,
          totalCount,
        };
      } catch (error) {
        console.error('Failed to fetch tasks or count:', error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tasks',
        });
      }
    }),
});
