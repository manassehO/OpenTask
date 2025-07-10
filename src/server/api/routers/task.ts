import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { getTaskByIdSchema } from '../schemas/task';
import { db } from '~/server/db';
import { task, user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

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
});
