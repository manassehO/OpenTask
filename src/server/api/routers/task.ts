import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { getTaskByIdSchema } from '../schemas/task';
import { db } from '~/server/db';
import { task, user, wallets, tasks} from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';


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

    initiateFunding: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { taskId } = input;
      const userId = ctx.session!.userId;

      const result = await db
         .select({
           id: task.id,
           creatorId: task.creatorId,
           status: task.status,
           rewardAmount: task.rewardAmount,
           maxCompletions: task.maxCompletions,
           platformFee: task.platformFee,
        })
        .from(task)
        .where(eq(task.id, taskId));

      const taskData = result[0];

      if (!taskData) throw new Error("Task not found");
      if (taskData.creatorId !== userId) throw new Error("Unauthorized");
      if (taskData.status !== "DRAFT") throw new Error("Task is not in DRAFT status");

      const reward = BigInt(taskData.rewardAmount);
      const completions = BigInt(taskData.maxCompletions);
      const fee = BigInt(taskData.platformFee ?? 0);

      const totalFunding = reward * completions + fee;
      const walletResult = await db
        .select({
           address: wallets.starknetAddress,
           type: wallets.walletType,
       })
        .from(wallets)
        .where(eq(wallets.userId, userId));

      const userWallet = walletResult[0];
          if (!userWallet) throw new Error("Wallet not found");
          if (userWallet.type  === "self_custody") {
      return {
         type: "SELF_CUSTODY",
       approveCall: {
          contractAddress: process.env.ERC20_CONTRACT!,
          entrypoint: "approve",
          calldata: [
            process.env.ESCROW_CONTRACT!,
            totalFunding.toString(),
               ],
           },
       fundTaskCall: {
          contractAddress: process.env.ESCROW_CONTRACT!,
          entrypoint: "fund_task",
          calldata: [
             taskId,
             totalFunding.toString(),
               ],
           },
  };
       } else if (userWallet.type === "managed") {
        const result = await ctx.starknetSvc.fundTaskWithManagedWallet({
    taskId,
    totalFunding,
    walletAddress: userWallet.address,
  });

  return {
    type: "MANAGED",
    status: result.status,
  };
} else {
  throw new Error("Unknown wallet type");
}

    }),
});


