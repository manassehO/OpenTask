import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { db } from '~/server/db';
import { tasks, user, wallets, taskClaims } from '@/server/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq, and, ilike, gte, asc, desc, count } from 'drizzle-orm';
import {
  getTaskByIdSchema,
  createTaskSchema,
  findTaskSchema,
} from '../schemas/task';

export const taskRouter = createTRPCRouter({
  /**
   * Get a single task by its ID
   */
  getTaskById: protectedProcedure
    .input(getTaskByIdSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          creatorId: tasks.creatorUserId,
          creatorDisplayName: user.displayName,
        })
        .from(tasks)
        .where(eq(tasks.id, input.taskId))
        .leftJoin(user, eq(tasks.creatorUserId, user.id));

      if (!result.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      return result[0];
    }),

  /**
   * Create a new task
   */
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only users with the CREATOR role can create tasks.',
        });
      }

      const [createdTask] = await db
        .insert(tasks)
        .values({
          ...input,
          creatorUserId: userId, // Ensure task is created by the logged-in user
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

  /**
   * Initiate the funding process for a task
   */
  initiateFunding: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { taskId } = input;
      const userId = ctx.user.id;

      const [taskData] = await db
        .select({
          id: tasks.id,
          creatorId: tasks.creatorUserId,
          status: tasks.status,
          rewardAmount: tasks.rewardAmount,
          maxCompletions: tasks.requiredCompletions,
          platformFee: tasks.platformFee,
        })
        .from(tasks)
        .where(eq(tasks.id, taskId));

      if (!taskData)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      if (taskData.creatorId !== userId)
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' });
      if (taskData.status !== 'DRAFT')
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Task is not in DRAFT status',
        });

      const reward = BigInt(taskData.rewardAmount);
      const completions = BigInt(taskData.maxCompletions);
      const fee = BigInt(taskData.platformFee ?? 0);
      const totalFunding = reward * completions + fee;

      const [userWallet] = await db
        .select({
          address: wallets.starknetAddress,
          type: wallets.walletType,
        })
        .from(wallets)
        .where(eq(wallets.userId, userId));

      if (!userWallet)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Wallet not found' });

      if (userWallet.type === 'self_custody') {
        return {
          type: 'SELF_CUSTODY',
          approveCall: {
            contractAddress: process.env.ERC20_CONTRACT!,
            entrypoint: 'approve',
            calldata: [process.env.ESCROW_CONTRACT!, totalFunding.toString()],
          },
          fundTaskCall: {
            contractAddress: process.env.ESCROW_CONTRACT!,
            entrypoint: 'fund_task',
            calldata: [taskId, totalFunding.toString()],
          },
        };
      } else if (userWallet.type === 'managed') {
        const result = await ctx.starknetSvc.fundTaskWithManagedWallet({
          taskId,
          totalFunding,
          walletAddress: userWallet.address,
        });

        return { type: 'MANAGED', status: result.status };
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unknown wallet type',
        });
      }
    }),

  /**
   * Claim a spot to complete an active task
   */
  claimTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { taskId } = input;
      const userId = ctx.user.id;

      if (ctx.user.role !== 'COMPLETER') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only completers can claim tasks',
        });
      }

      const [taskData] = await db
        .select({
          id: tasks.id,
          status: tasks.status,
          maxCompletions: tasks.requiredCompletions,
          approvedCompletions: tasks.approvedCompletions,
          inProgressCompletions: tasks.inProgressCompletions,
        })
        .from(tasks)
        .where(eq(tasks.id, taskId));

      if (!taskData) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      if (taskData.status !== 'ACTIVE') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Task is not active',
        });
      }

      const slotsAvailable =
        (taskData.maxCompletions ?? 0) -
        (taskData.approvedCompletions ?? 0) -
        (taskData.inProgressCompletions ?? 0);

      if (slotsAvailable <= 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No available slots',
        });
      }

      await db.transaction(async (tx) => {
        await tx.insert(taskClaims).values({
          taskId,
          userId,
          status: 'IN_PROGRESS',
          createdAt: new Date(),
        });

        await tx
          .update(tasks)
          .set({
            inProgressCompletions: (taskData.inProgressCompletions ?? 0) + 1,
          })
          .where(eq(tasks.id, taskId));
      });

      return { success: true, message: 'Task claimed successfully' };
    }),
});
