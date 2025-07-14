import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { getTaskByIdSchema } from '../schemas/task';
import { db } from '~/server/db';
import { task, user, wallets} from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

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
});


