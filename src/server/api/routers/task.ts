import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
  tasks,
  user,
  wallets,
  taskClaims,
  submissions,
} from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, and, ilike, gte, asc, desc, count } from 'drizzle-orm';
import { db } from '~/server/db';
import { z } from 'zod';
import {
  getTaskByIdSchema,
  createTaskSchema,
  findTaskSchema,
  submitTaskSchema,
  getSubmissionsSchema,
} from '../schemas/task';
import { uploadBase64FileToMinio } from '~/services/minio';

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
        created_at: tasks.createdAt,
        reward: tasks.rewardAmount,
      } as const;

      // Build where clause for drizzle
      const whereClauses = [eq(tasks.status, 'ACTIVE')];

      if (category && category.trim() !== '') {
        whereClauses.push(ilike(tasks.category, category));
      }

      if (typeof min_reward === 'number' && !isNaN(min_reward)) {
        whereClauses.push(gte(tasks.rewardAmount, min_reward.toString()));
      }

      const sortColumn =
        sort_by === 'reward' ? tasks.rewardAmount : tasks.createdAt;
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

      const result = await db
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

      const taskData = result[0];
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

      const result = await db
        .select({
          id: tasks.id,
          status: tasks.status,
          maxCompletions: tasks.requiredCompletions,
          approvedCompletions: tasks.approvedCompletions,
          inProgressCompletions: tasks.inProgressCompletions,
        })
        .from(tasks)
        .where(eq(tasks.id, taskId));

      const taskData = result[0];
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

  submitTask: protectedProcedure
    .input(submitTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { taskId, file, filename, mimetype } = input;

      // Validate the task claim
      const taskClaim = await ctx.db.query.taskClaims.findFirst({
        where: (taskClaims, { and, eq }) =>
          and(
            eq(taskClaims.userId, ctx.user.id),
            eq(taskClaims.taskId, taskId),
          ),
      });

      if (!taskClaim) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have a claim on this task.',
        });
      }

      //  Prevent duplicate submissions
      const existingSubmission = await ctx.db.query.submissions.findFirst({
        where: (submissions, { eq, and }) =>
          and(
            eq(submissions.taskId, taskId),
            eq(submissions.completerUserId, ctx.user.id),
          ),
      });

      if (existingSubmission) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already submitted a response for this task.',
        });
      }

      // Upload to MinIO
      const objectKey = `submissions/${Date.now()}-${filename}`;
      let fileUrl: string;

      try {
        fileUrl = await uploadBase64FileToMinio(file, objectKey, mimetype);
      } catch (error) {
        console.error('File upload failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'File upload failed. Please try again later.',
        });
      }

      // Insert submission record in DB
      let submittedTask;
      try {
        const inserted = await ctx.db
          .insert(submissions)
          .values({
            taskId: taskId,
            completerUserId: ctx.user.id,
            status: 'PENDING_REVIEW',
            dataRef: fileUrl,
            submittedAt: new Date(),
            rejectionReason: '',
          })
          .returning();

        submittedTask = inserted[0];
      } catch (error) {
        console.error('Failed to save submission:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Submission could not be saved.',
        });
      }

      return { submittedTask };
    }),
  
  getSubmissions: protectedProcedure
    .input(getSubmissionsSchema)
    .mutation(async ({ ctx, input }) => {
      const { taskId, status, limit, page } = input;
      const userId = ctx.user.id;

      // Ensure user is a CREATOR
      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only creators can view task submissions.',
        });
      }

      // Check task exists and belongs to user
      const task = await ctx.db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, taskId),
      });

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found.',
        });
      }

      if (task.creatorUserId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this task.',
        });
      }

      // Build filters
      const whereConditions = [eq(submissions.taskId, taskId)];

      if (status) {
        whereConditions.push(eq(submissions.status, status));
      }

      const offset = (page - 1) * limit;

      try {
        const [results, totalCountResult] = await Promise.all([
          ctx.db
            .select({
              submissionId: submissions.submissionId,
              status: submissions.status,
              submittedAt: submissions.submittedAt,
              rejectionReason: submissions.rejectionReason,
              dataRef: submissions.dataRef,
              completerId: user.id,
              completerDisplayName: user.displayName,
            })
            .from(submissions)
            .where(and(...whereConditions))
            .leftJoin(user, eq(user.id, submissions.completerUserId))
            .orderBy(desc(submissions.submittedAt))
            .limit(limit)
            .offset(offset),

          ctx.db
            .select({ count: count() })
            .from(submissions)
            .where(and(...whereConditions)),
        ]);

        const totalCount = Number(totalCountResult[0]?.count ?? 0);

        return {
          success: true,
          submissions: results,
          totalCount,
          page,
          pageSize: limit,
        };
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not fetch submissions.',
        });
      }
    }),
});
