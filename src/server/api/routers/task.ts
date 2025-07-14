import { getTaskByIdSchema } from '../schemas/task';
import { db } from '~/server/db';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { tasks, user } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

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
});
