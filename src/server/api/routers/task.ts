import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from '~/server/api/trpc';
import { db } from '~/server/db';
import {
  tasks,
  user,
  wallets,
  taskClaims,
  submissions,
  disputes,
} from '@/server/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  eq,
  and,
  ilike,
  gte,
  asc,
  desc,
  count,
  sql,
  inArray,
  ne,
  type SQLWrapper,
  notInArray,
} from 'drizzle-orm';
import {
  getTaskByIdSchema,
  createTaskSchema,
  findTaskSchema,
} from '../schemas/task';
import { submitTaskSchema } from '../schemas/submission';

import { randomUUID } from 'crypto';
import { createAutoNotification } from '~/services/notifications';

export const taskRouter = createTRPCRouter({
  /**
   * Get a single task by its ID
   */
  getTaskById: protectedProcedure
    .input(getTaskByIdSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          instructions: tasks.instructions,
          category: tasks.category,
          rewardAmount: tasks.rewardAmount,
          rewardTokenAddress: tasks.rewardTokenAddress,
          platformFee: tasks.platformFee,
          approvedCompletions: tasks.approvedCompletions,
          inProgressCompletions: tasks.inProgressCompletions,
          requiredCompletions: tasks.requiredCompletions,
          deadline: tasks.deadline,
          image: tasks.image,
          status: tasks.status,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          creatorId: tasks.creatorUserId,
          creatorDisplayName: user.displayName,
          tags: tasks.tags,
          example: tasks.example,
          specialRequirements: tasks.specialRequirements,
        })
        .from(tasks)
        .where(eq(tasks.id, input.taskId))
        .leftJoin(user, eq(tasks.creatorUserId, user.id));

      if (!result.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      // Parse tags for API response
      const response = result[0];
      let parsedTags: string[] = [];
      if (response?.tags) {
        try {
          parsedTags = JSON.parse(response.tags) as string[];
        } catch {
          parsedTags = [];
        }
      }
      return {
        ...response,
        tags: parsedTags,
      };
    }),

  /**
   * Create a new task
   */
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { deadline, ...rest } = input;
      const parsedDeadline = new Date(deadline);

      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only users with the CREATOR role can create tasks.',
        });
      }

      const [createdTask] = await db
        .insert(tasks)
        .values({
          ...rest,
          tags: JSON.stringify(input.tags),
          example: input.example ?? null,
          specialRequirements: input.specialRequirements ?? null,
          deadline: parsedDeadline,
          creatorUserId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Parse tags for API response
      const response = createdTask;
      let parsedTags: string[] = [];
      if (response?.tags) {
        try {
          parsedTags = JSON.parse(response.tags) as string[];
        } catch {
          parsedTags = [];
        }
      }
      return {
        success: true,
        task: {
          ...response,
          tags: parsedTags,
        },
      };
    }),

  findTasks: protectedProcedure
    .input(findTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { category, min_reward, sort_by, order, limit, page } = input;

      // Only allow sorting by whitelisted fields
      /* const sortFieldMap = {
        created_at: tasks.createdAt,
        reward: tasks.rewardAmount,
      } as const;
 */
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
          creatorUserId: tasks.creatorUserId,
          id: tasks.id,
          title: tasks.title,
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

      // Check if this user already claimed this task
      const existingClaim = await db
        .select()
        .from(taskClaims)
        .where(
          and(
            eq(taskClaims.taskId, taskId),
            eq(taskClaims.userId, userId),
            ne(taskClaims.status, 'REJECTED'),
          ),
        );

      if (existingClaim.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have already claimed this task',
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

      console.log(taskData);

      await createAutoNotification({
        userId: taskData.creatorUserId,
        type: 'TASK_ASSIGNED',
        title: 'Task Claimed',
        message: `${ctx.user.email} has claimed your task '${taskData.title}'`,
        relatedTaskId: taskId,
      });

      return { success: true, message: 'Task claimed successfully' };
    }),

  rejectSubmission: protectedProcedure
    .input(
      z.object({
        submissionId: z.string().uuid(),
        reason: z.string().min(10).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only creators can reject submissions',
        });
      }

      const submission = await db.query.submissions.findFirst({
        where: (s, { eq }) => eq(s.submissionId, input.submissionId),
        with: {
          task: {
            columns: {
              id: true,
              creatorUserId: true,
              title: true,
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found',
        });
      }

      if (submission.task?.creatorUserId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not the creator of this task',
        });
      }

      if (submission.status !== 'PENDING_REVIEW') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission is not pending review',
        });
      }

      await db
        .update(submissions)
        .set({
          status: 'REJECTED',
          reviewedAt: new Date(),
          rejectionReason: input.reason,
        })
        .where(eq(submissions.submissionId, input.submissionId));

      // Auto Notification Trigger
      await createAutoNotification({
        userId: submission.completerUserId!,
        type: 'TASK_REJECTED',
        title: 'Task Submission Rejected',
        message: `Your submission for ${submission.task.title} was rejected. Reason: ${input.reason}`,
        relatedTaskId: submission.task.id,
        relatedSubmissionId: submission.submissionId,
      });

      return { success: true };
    }),

  /**
   * Submit task completed by users
   */
  submitTask: protectedProcedure
    .input(submitTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        taskId,
        submissionType,
        textContent,
        submissionUrl,
        fileMetadata,
        additionalNotes,
      } = input;
      const userId = ctx.user.id;

      // Verify task exists and is active
      const [taskData] = await db
        .select({
          id: tasks.id,
          status: tasks.status,
          title: tasks.title,
          creatorUserId: tasks.creatorUserId,
        })
        .from(tasks)
        .where(eq(tasks.id, taskId));

      if (!taskData) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      if (taskData.status !== 'ACTIVE') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot submit to an inactive task',
        });
      }

      // Verify user has an active claim for the task
      const [claimData] = await db
        .select()
        .from(taskClaims)
        .where(
          and(
            eq(taskClaims.taskId, taskId),
            eq(taskClaims.userId, userId),
            eq(taskClaims.status, 'IN_PROGRESS'),
          ),
        );

      if (!claimData) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'No active claim found for this task. You must claim the task before submitting.',
        });
      }

      // Check if user already has a submission for this task
      const [existingSubmission] = await db
        .select()
        .from(submissions)
        .where(
          and(
            eq(submissions.taskId, taskId),
            eq(submissions.completerUserId, userId),
          ),
        );

      if (existingSubmission) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have already submitted work for this task',
        });
      }

      // Prepare submission data reference
      const submissionData = {
        type: submissionType,
        textContent: textContent ?? null,
        submissionUrl: submissionUrl ?? null,
        fileMetadata: fileMetadata ?? null,
        additionalNotes: additionalNotes ?? null,
        submittedAt: new Date().toISOString(),
      };

      const dataRef = JSON.stringify(submissionData);

      // Create submission record
      const newSubmission = await db.transaction(async (tx) => {
        // Insert submission
        const [submission] = await tx
          .insert(submissions)
          .values({
            taskId,
            completerUserId: userId,
            status: 'PENDING_REVIEW',
            dataRef,
            rejectionReason: '', // Empty string for new submissions
            submittedAt: new Date(),
          })
          .returning({ submissionId: submissions.submissionId });

        // Update task claim status to completed
        await tx
          .update(taskClaims)
          .set({
            status: 'COMPLETED',
            updatedAt: new Date(),
          })
          .where(
            and(eq(taskClaims.taskId, taskId), eq(taskClaims.userId, userId)),
          );

        return submission;
      });

      // create notification
      if (taskData.creatorUserId) {
        await createAutoNotification({
          userId: taskData.creatorUserId,
          type: 'TASK_SUBMITTED',
          title: 'Task Submission Received',
          message: `${ctx.user.email} has submitted work for "${taskData.title}". Please review.`,
          relatedTaskId: taskId,
          relatedSubmissionId: newSubmission.submissionId,
        });
      }

      return {
        success: true,
        submissionId: newSubmission?.submissionId,
        message: 'Task submitted successfully and is pending review',
      };
    }),

  getDisputes: adminProcedure
    .input(
      z.object({
        status: z
          .enum(['OPEN', 'RESOLVED_APPROVE', 'RESOLVED_REJECT'])
          .optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { status, limit, offset } = input;

      if (ctx.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only Admins can access this resource',
        });
      }

      // Base query
      const whereConditions = status ? eq(disputes.status, status) : undefined;

      type Dispute = typeof disputes.$inferSelect;

      // Fetch disputes with joins
      const disputesList: Dispute[] = await ctx.db.query.disputes.findMany({
        where: whereConditions,
        limit,
        offset,
        with: {
          submission: {
            with: {
              task: {
                columns: {
                  id: true,
                  title: true,
                },
                with: {
                  creator: {
                    columns: {
                      id: true,
                      username: true,
                      email: true,
                    },
                  },
                },
              },
              completer: {
                columns: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: (d, { desc }) => [desc(d.createdAt)],
      });

      // Total count for pagination
      const totalQuery = ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(disputes);

      const total = await (
        whereConditions ? totalQuery.where(whereConditions) : totalQuery
      ).then((rows) => rows[0]?.count ?? 0);

      return {
        success: true,
        disputes: disputesList,
        total,
      };
    }),

  initiateDispute: protectedProcedure
    .input(
      z.object({
        submissionId: z.string().uuid(),
        claim: z.string().min(10),
        txHash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Fetch the submission
      const submission = await ctx.db.query.submissions.findFirst({
        where: (s, { eq }) => eq(s.submissionId, input.submissionId),
        with: { task: true },
      });

      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found',
        });
      }

      // Ensure user owns the submission
      if (submission.completerUserId !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not own this submission',
        });
      }

      // Ensure submission is REJECTED
      if (submission.status !== 'REJECTED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You can only DISPUTE REJECTED Submissions',
        });
      }

      // Create a dispute record
      const [dispute] = await ctx.db
        .insert(disputes)
        .values({
          submissionId: input.submissionId,
          completerClaim: input.claim,
          status: 'OPEN',
          flagTxHash: input.txHash,
          resolvedById: randomUUID(),
          resolvedAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ disputeId: disputes.disputeId });

      // Update the submission status to DISPUTED
      await ctx.db
        .update(submissions)
        .set({ status: 'DISPUTED' })
        .where(eq(submissions.submissionId, input.submissionId));

      // Notify the task creator
      await createAutoNotification({
        userId: submission.task.creatorUserId,
        type: 'DISPUTE_CREATED',
        title: 'Dispute Opened',
        message: `A dispute has been opened for ${submission.task.title}. Claim: ${input.claim}`,
        relatedTaskId: submission.task.id,
        relatedSubmissionId: submission.submissionId,
      });

      const admins = await ctx.db.query.user.findMany({
        where: (u, { eq }) => eq(u.role, 'ADMIN'),
        columns: { id: true },
      });

      await Promise.all(
        admins.map((admin) =>
          createAutoNotification({
            userId: admin.id,
            type: 'DISPUTE_CREATED',
            title: 'Dispute Opened',
            message: `A dispute has been opened for ${submission.task.title}. Claim: ${input.claim}`,
            relatedTaskId: submission.task.id,
            relatedSubmissionId: submission.submissionId,
          }),
        ),
      );

      return {
        success: true,
        disputeId: dispute?.disputeId,
      };
    }),

  approveSubmission: protectedProcedure
    .input(
      z.object({
        submissionId: z.string(),
        txHash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only creators can approve submissions',
        });
      }

      // Fetch submission and task
      const submission = await ctx.db.query.submissions.findFirst({
        where: (s, { eq }) => eq(s.submissionId, input.submissionId),
        with: { task: true },
      });

      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found',
        });
      }

      // Verify task ownership
      if (submission.task.creatorUserId !== userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not your task' });
      }

      // Verify submission status
      if (submission.status !== 'PENDING_REVIEW') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission is not pending review',
        });
      }

      // Fetch completer's active wallet
      const wallet = await ctx.db.query.wallets.findFirst({
        where: (w, { eq, and }) =>
          and(eq(w.userId, submission.completerUserId!), eq(w.isActive, 1)),
      });

      if (!wallet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Completer has no active wallet',
        });
      }

      await db.transaction(async (tx) => {
        // Update DB with txHash
        await tx
          .update(submissions)
          .set({
            approvalTxHash: input.txHash,
            status: 'APPROVED',
            reviewedAt: new Date(),
          })
          .where(eq(submissions.submissionId, input.submissionId));

        // Increment approvedCompletions in related task
        await tx
          .update(tasks)
          .set({ approvedCompletions: sql`${tasks.approvedCompletions} + 1` })
          .where(eq(tasks.id, submission.task.id));
      });

      // Task approved notification
      await createAutoNotification({
        userId: submission.completerUserId!,
        type: 'TASK_APPROVED',
        title: 'Task Approved! 🎉',
        message: `Your submission for ${submission.task.title} has been approved. Reward: ${submission.task.rewardAmount} ETH`,
        relatedTaskId: submission.task.id,
        relatedSubmissionId: submission.submissionId,
      });

      // Payment received notification
      await createAutoNotification({
        userId: submission.completerUserId!,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received! 💰',
        message: `You've received ${submission.task.rewardAmount} ETH for completing ${submission.task.title}`,
        relatedTaskId: submission.task.id,
        relatedSubmissionId: submission.submissionId,
      });

      return { success: true };
    }),

  getRecommendedTasks: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get tasks the user has already claimed or submitted
      const [claimedTasks, submittedTasks] = await Promise.all([
        db
          .select({ taskId: taskClaims.taskId })
          .from(taskClaims)
          .where(eq(taskClaims.userId, userId)),
        db
          .select({ taskId: submissions.taskId })
          .from(submissions)
          .where(eq(submissions.completerUserId, userId)),
      ]);

      type UUID = string;

      const excludedTaskIds: UUID[] = [
        ...new Set(
          [...claimedTasks, ...submittedTasks]
            .map((row) => row.taskId)
            .filter((id): id is UUID => id !== null),
        ),
      ];

      // Get categories of previously submitted tasks
      const categoryRows = await db
        .select({ category: tasks.category })
        .from(tasks)
        .where(
          inArray(
            tasks.id,
            submittedTasks.map((row) => String(row.taskId)),
          ),
        );

      const categories = [...new Set(categoryRows.map((row) => row.category))];

      const now = new Date();

      // Build SQL-safe category array
      const categoryArraySQL = categories.length
        ? sql.raw(`ARRAY[${categories.map((cat) => `'${cat}'`).join(',')}]`)
        : sql.raw(`ARRAY[]::text[]`);

      // Safely build WHERE conditions first
      const conditions: SQLWrapper[] = [
        eq(tasks.status, 'ACTIVE'),
        gte(tasks.deadline, now),
      ];

      if (excludedTaskIds.length > 0) {
        const exclusionCondition = notInArray(
          tasks.id,
          excludedTaskIds,
        ) as SQLWrapper;
        conditions.push(exclusionCondition);
      }

      // Query recommended tasks
      const recommendedTasks = await db
        .select({
          task: tasks,
          claimCount: sql<number>`COUNT(${taskClaims.id})`.as('claim_count'),
        })
        .from(tasks)
        .leftJoin(taskClaims, eq(tasks.id, taskClaims.taskId))
        .where(and(...conditions))
        .groupBy(tasks.id)
        .orderBy(
          desc(
            sql`CASE WHEN ${tasks.category} = ANY(${categoryArraySQL}) THEN 1 ELSE 0 END`,
          ),
          desc(sql`COUNT(${taskClaims.id})`),
          desc(tasks.rewardAmount),
          desc(tasks.createdAt),
        )
        .limit(input.limit);

      return {
        success: true,
        tasks: recommendedTasks.map((row) => row.task),
      };
    }),

  getTasksByStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED']),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { status, limit, offset } = input;
      const userId = ctx.user.id;

      if (ctx.user.role !== 'CREATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only creators can view their tasks',
        });
      }

      // Count total tasks for this creator + status
      const [{ count }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tasks)
        .where(and(eq(tasks.status, status), eq(tasks.creatorUserId, userId)));

      const totalRecordsNum = Number(count);
      let taskQuery;

      if (['ACTIVE', 'COMPLETED'].includes(status)) {
        // Include claims
        taskQuery = db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            rewardAmount: tasks.rewardAmount,
            deadline: tasks.deadline,
            image: tasks.image,
            createdAt: tasks.createdAt,
            claimedBy: taskClaims.userId,
            claimStatus: taskClaims.status,
            claimedAt: taskClaims.createdAt,
          })
          .from(tasks)
          .leftJoin(taskClaims, eq(tasks.id, taskClaims.taskId))
          .where(and(eq(tasks.status, status), eq(tasks.creatorUserId, userId)))
          .orderBy(desc(tasks.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        // No claims
        taskQuery = db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            rewardAmount: tasks.rewardAmount,
            deadline: tasks.deadline,
            image: tasks.image,
            createdAt: tasks.createdAt,
          })
          .from(tasks)
          .where(and(eq(tasks.status, status), eq(tasks.creatorUserId, userId)))
          .orderBy(desc(tasks.createdAt))
          .limit(limit)
          .offset(offset);
      }

      const data = await taskQuery;

      return {
        pageSize: limit,
        totalPages: Math.ceil(Number(count) / limit),
        totalRecords: totalRecordsNum,
        data,
      };
    }),

  cancelTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { taskId } = input;

      try {
        // Verify task exists and the user is the creator
        const task = await ctx.db.query.tasks.findFirst({
          where: (tasks, { and, eq }) =>
            and(eq(tasks.id, taskId), eq(tasks.creatorUserId, userId)),
        });

        if (!task) {
          throw new Error(
            'Task not found or you are not authorized to cancel it.',
          );
        }

        // Only allow cancellation if it is still ACTIVE
        if (task.status !== 'ACTIVE') {
          throw new Error('Only ACTIVE tasks can be cancelled.');
        }

        // Cancel the task
        await ctx.db
          .update(tasks)
          .set({ status: 'CANCELLED' })
          .where(eq(tasks.id, taskId));

        // Cancel all related task claims
        await ctx.db
          .update(taskClaims)
          .set({ status: 'CANCELLED' })
          .where(eq(taskClaims.taskId, taskId));

        return { success: true };
      } catch (error) {
        console.error('Error cancelling task:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while cancelling the task.',
          cause: error,
        });
      }
    }),

  getTaskCategories: protectedProcedure.query(async ({ ctx }) => {
    const rawCategories = await ctx.db
      .selectDistinct({ category: tasks.category })
      .from(tasks)
      .where(sql`trim(${tasks.category}) != ''`);

    const categories = Array.from(
      new Set(rawCategories.map((row) => row.category.trim())),
    ).sort((a, b) => a.localeCompare(b));

    return {
      success: true,
      categories,
    };
  }),

  getUserClaimedTasks: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Count total claimed tasks
      const [{ count }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(taskClaims)
        .where(eq(taskClaims.userId, userId));

      const totalRecordNum = Number(count);

      // Fetch claimed tasks with task details
      const claimedTasks = await db
        .select({
          claimId: taskClaims.id,
          claimStatus: taskClaims.status,
          claimCreatedAt: taskClaims.createdAt,
          claimUpdatedAt: taskClaims.updatedAt,
          taskId: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          rewardAmount: tasks.rewardAmount,
          deadline: tasks.deadline,
          image: tasks.image,
          createdAt: tasks.createdAt,
        })
        .from(taskClaims)
        .innerJoin(tasks, eq(taskClaims.taskId, tasks.id))
        .where(eq(taskClaims.userId, userId))
        .orderBy(desc(taskClaims.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        pageSize: input.limit,
        totalPages: Math.ceil(Number(count) / input.limit),
        totalRecords: totalRecordNum,
        data: claimedTasks,
      };
    }),

  editTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        title: z.string().min(3).max(255).optional(),
        description: z.string().min(10).optional(),
        category: z.string().min(2).max(100).optional(),
        rewardAmount: z.string().optional(),
        requiredCompletions: z.number().min(1).optional(),
        deadline: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { taskId, deadline, ...updates } = input;

      // Fetch task to verify ownership and status
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, taskId),
      });

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      if (task.creatorUserId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not the owner of this task',
        });
      }

      if (task.status !== 'DRAFT') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only draft tasks can be edited',
        });
      }

      const updatePayload: Record<string, unknown> = {
        ...updates,
        updatedAt: new Date(),
      };

      if (deadline) {
        updatePayload.deadline = new Date(deadline);
      }

      const [updatedTask] = await ctx.db
        .update(tasks)
        .set(updatePayload)
        .where(eq(tasks.id, taskId))
        .returning();

      return {
        success: true,
        task: updatedTask,
      };
    }),

  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid('Invalid task ID'),
        newStatus: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId, newStatus } = input;
      const userId = ctx.user.id;

      // Get the task
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
      });

      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      // Ensure user is the creator
      if (task.creatorUserId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to update the status of this task',
        });
      }

      // allowed transitions
      const validTransitions: Record<string, string> = {
        DRAFT: 'ACTIVE',
        ACTIVE: 'COMPLETED',
      };

      if (task.status === newStatus) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Task is already ${newStatus}`,
        });
      }

      if (validTransitions[task.status] !== newStatus) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid status transition from ${task.status} to ${newStatus}`,
        });
      }

      // Update status
      await db
        .update(tasks)
        .set({ status: newStatus })
        .where(eq(tasks.id, taskId));

      return { success: true, message: `Task status updated to ${newStatus}` };
    }),
});