import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, t } from '~/server/api/trpc';
import { tasks, user } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, and, ilike, gte, asc, desc, sql, count } from 'drizzle-orm';
import { db } from '~/server/db';

// Allowed status values
const allowedStatus = [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
] as const;

const createTaskSchema = z.object({
  creatorUserId: z.string().min(1, 'creatorUserId is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  category: z.string().min(1, 'Category is required'),
  rewardAmount: z
    .string()
    .refine((val) => /^\d+(\.\d{1,18})?$/.test(val) && parseFloat(val) > 0, {
      message:
        'Invalid reward amount: must be a positive number with up to 18 decimals',
    }),
  rewardTokenAddress: z
    .string()
    .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid rewardTokenAddress format',
    }),
  requiredCompletions: z
    .number()
    .int()
    .min(1, 'requiredCompletions must be at least 1'),
  status: z.enum(allowedStatus),
  fundingTxHash: z.string().refine((val) => /^0x[a-fA-F0-9]{64}$/.test(val), {
    message: 'Invalid fundingTxHash format',
  }),
});

const findTaskSchema = z.object({
  category: z.string().optional(),
  min_reward: z.coerce.number().min(0).optional(), // minimum zero ensures that no negative minimum reward is provided
  sort_by: z.enum(['created_at', 'reward']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).default(10),
  page: z.number().min(1).default(1),
});

export const taskRouter = createTRPCRouter({
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

      let orderByClause;

      if (sort_by === 'created_at') {
        orderByClause =
          order === 'asc' ? asc(tasks.createdAt) : desc(tasks.createdAt);
      } else {
        orderByClause =
          order === 'asc' ? asc(tasks.rewardAmount) : desc(tasks.rewardAmount);
      }

      // Pagination implementation
      const safeLimit = Math.max(1, Math.min(limit, 30)); // max of 30 per page
      const safePage = Math.max(1, page);
      const offset = (safePage - 1) * safeLimit;

      // Query for paginated tasks
      const tasksResult = await ctx.db.query.tasks.findMany({
        where: and(...whereClauses),
        orderBy: [orderByClause],
        limit: safeLimit,
        offset,
      });

      // Query for total count of tasks in database excluding pagination
      const countResult = await ctx.db
        .select({ count: count() })
        .from(tasks)
        .where(and(...whereClauses));

      const totalCount = Number(countResult[0]?.count ?? 0);

      return {
        success: true,
        tasks: tasksResult,
        totalCount,
      };
    }),
});
