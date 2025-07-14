import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { getTaskByIdSchema } from '../schemas/task';
import { db } from '~/server/db';
import { task, user, wallets} from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { taskClaims } from '~/server/db/schema';

export const taskRouter = createTRPCRouter({
  getTaskById: protectedProcedure
    .input(getTaskByIdSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          creatorId: task.creatorId,
          creatorDisplayName: user.displayName,
        })
        .from(task)
        .where(eq(task.id, input.taskId))
        .leftJoin(user, eq(task.creatorId, user.id));

      if (!result.length) {
        throw new Error("Task not found");
      }

      return result[0];
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


    claimTask: protectedProcedure
  .input(z.object({ taskId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { taskId } = input;
    const userId = ctx.user.id;

    if (ctx.user.role !== "completer") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only completers can claim tasks" });
    }

    const [taskData] = await db
      .select({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    rewardAmount: task.rewardAmount,
    creatorId: task.creatorId,
    maxCompletions: task.maxCompletions,
    platformFee: task.platformFee,
    approvedCompletions: task.approvedCompletions,
    inProgressCompletions: task.inProgressCompletions,
  })
      .from(task)
      .where(eq(task.id, taskId));

    if (!taskData) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    }

    if (taskData.status !== "ACTIVE") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Task is not active" });
    }

    const slotsAvailable =
      (taskData.maxCompletions ?? 0) -
      (taskData.approvedCompletions ?? 0) -
      (taskData.inProgressCompletions ?? 0);

    if (slotsAvailable <= 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No available slots" });
    }

    await db.transaction(async (tx) => {
      
      await tx.insert(taskClaims).values({
        taskId,
        userId,
        status: "IN_PROGRESS",
        createdAt: new Date(),
      });

      await tx
        .update(task)
        .set({ inProgressCompletions: (taskData.inProgressCompletions ?? 0) + 1 })
        .where(eq(task.id, taskId));
    });

    return { success: true, message: "Task claimed successfully" };
  }),

});
